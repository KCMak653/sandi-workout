// Dependency-free icon generator.
// Rasterizes a turquoise tile + dumbbell into PNGs (no ImageMagick/Pillow needed).
//
// Usage: node tools/make-icons.mjs

import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import zlib from 'node:zlib';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, '..', 'icons');
mkdirSync(OUT, { recursive: true });

const SS = 4; // supersampling factor for antialiasing

// --- tiny PNG encoder -------------------------------------------------------
let CRC_TABLE = null;
function crcTable() {
  if (CRC_TABLE) return CRC_TABLE;
  CRC_TABLE = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    CRC_TABLE[n] = c >>> 0;
  }
  return CRC_TABLE;
}
function crc32(buf) {
  const t = crcTable();
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePng(size, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', idat),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- rasterizer (hard edges at high res, box-downsampled) -------------------
function insideRoundedRect(x, y, n, r) {
  const qx = Math.min(Math.max(x, r), n - r);
  const qy = Math.min(Math.max(y, r), n - r);
  const dx = x - qx;
  const dy = y - qy;
  return dx * dx + dy * dy <= r * r;
}
function distSeg(px, py, ax, ay, bx, by) {
  const vx = bx - ax;
  const vy = by - ay;
  const wx = px - ax;
  const wy = py - ay;
  const t = Math.max(0, Math.min(1, (wx * vx + wy * vy) / (vx * vx + vy * vy)));
  return Math.hypot(px - (ax + t * vx), py - (ay + t * vy));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function render(size, { rounded, maskable }) {
  const n = size * SS;
  const buf = new Uint8ClampedArray(n * n * 4);
  const put = (x, y, r, g, b, a) => {
    const i = (y * n + x) * 4;
    buf[i] = r;
    buf[i + 1] = g;
    buf[i + 2] = b;
    buf[i + 3] = a;
  };

  // background gradient: #2dd4bf -> #0d9488
  const radius = rounded ? 0.18 * n : 0;
  for (let y = 0; y < n; y++) {
    const t = y / (n - 1);
    const r = lerp(45, 13, t);
    const g = lerp(212, 148, t);
    const b = lerp(191, 136, t);
    for (let x = 0; x < n; x++) {
      if (rounded && !insideRoundedRect(x + 0.5, y + 0.5, n, radius)) continue;
      put(x, y, r, g, b, 255);
    }
  }

  // dumbbell
  const cx = n / 2;
  const cy = n / 2;
  const s = n * (maskable ? 0.85 : 1.0);
  const paint = (ax, ay, bx, by, rr) => {
    const minX = Math.max(0, Math.floor(Math.min(ax, bx) - rr - 1));
    const maxX = Math.min(n - 1, Math.ceil(Math.max(ax, bx) + rr + 1));
    const minY = Math.max(0, Math.floor(Math.min(ay, by) - rr - 1));
    const maxY = Math.min(n - 1, Math.ceil(Math.max(ay, by) + rr + 1));
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (distSeg(x + 0.5, y + 0.5, ax, ay, bx, by) <= rr) put(x, y, 240, 253, 250, 255);
      }
    }
  };
  // bar
  paint(cx - 0.3 * s, cy, cx + 0.3 * s, cy, 0.05 * s);
  // outer + inner plates
  for (const [px, hy, pr] of [
    [-0.3, 0.19, 0.06],
    [0.3, 0.19, 0.06],
    [-0.17, 0.13, 0.05],
    [0.17, 0.13, 0.05],
  ]) {
    paint(cx + px * s, cy - hy * s, cx + px * s, cy + hy * s, pr * s);
  }

  // downsample
  const out = Buffer.alloc(size * size * 4);
  const area = SS * SS;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const i = ((y * SS + sy) * n + (x * SS + sx)) * 4;
          r += buf[i];
          g += buf[i + 1];
          b += buf[i + 2];
          a += buf[i + 3];
        }
      }
      const o = (y * size + x) * 4;
      out[o] = Math.round(r / area);
      out[o + 1] = Math.round(g / area);
      out[o + 2] = Math.round(b / area);
      out[o + 3] = Math.round(a / area);
    }
  }
  return out;
}

const targets = [
  { file: 'icon-192.png', size: 192, rounded: true, maskable: false },
  { file: 'icon-512.png', size: 512, rounded: true, maskable: false },
  { file: 'icon-maskable-512.png', size: 512, rounded: false, maskable: true },
  { file: 'apple-touch-icon-180.png', size: 180, rounded: false, maskable: false },
  { file: 'favicon-32.png', size: 32, rounded: true, maskable: false },
];

for (const t of targets) {
  const png = encodePng(t.size, render(t.size, t));
  writeFileSync(path.join(OUT, t.file), png);
  console.log(`wrote icons/${t.file} (${t.size}x${t.size}, ${png.length} bytes)`);
}
