// The mascot: a bearded, capped, muscle-shirt guy who flexes on tap.

import { el } from './dom.js';

const AVATAR = `
<svg viewBox="0 0 120 120" aria-hidden="true">
  <defs>
    <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f4d3a7"/>
      <stop offset="1" stop-color="#d4a574"/>
    </linearGradient>
    <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9333ea"/>
      <stop offset="1" stop-color="#6b21a8"/>
    </linearGradient>
    <linearGradient id="beard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6b4423"/>
      <stop offset="1" stop-color="#4a2c17"/>
    </linearGradient>
    <linearGradient id="cap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#22d3ee"/>
      <stop offset="1" stop-color="#0891b2"/>
    </linearGradient>
  </defs>

  <!-- Thick muscular neck -->
  <rect x="47" y="46" width="26" height="24" rx="3" fill="url(#skin)"/>
  <rect x="49" y="46" width="22" height="22" rx="2" fill="#c79660" opacity="0.3"/>

  <!-- Purple muscle shirt: broad chest, straight taper down to a narrow waist -->
  <path d="M30,76
           C36,68 44,63 52,62
           C56,66 64,66 68,62
           C76,63 84,68 90,76
           C87,92 81,107 74,118
           L46,118
           C39,107 33,92 30,76 Z" fill="url(#shirt)"/>

  <!-- Muscle definition lines -->
  <path d="M60,72 L60,118" stroke="#7c3aed" stroke-width="2" opacity="0.4"/>
  <path d="M45,79 C52,83 56,85 60,85" stroke="#7c3aed" stroke-width="2" fill="none" opacity="0.3"/>
  <path d="M75,79 C68,83 64,85 60,85" stroke="#7c3aed" stroke-width="2" fill="none" opacity="0.3"/>

  <!-- Head -->
  <circle cx="60" cy="34" r="15" fill="url(#skin)"/>
  <ellipse cx="47" cy="36" rx="3.5" ry="4" fill="url(#skin)"/>
  <ellipse cx="73" cy="36" rx="3.5" ry="4" fill="url(#skin)"/>

  <!-- Full thick beard -->
  <path d="M45,36
           C42,46 43,56 48,64
           C52,70 56,72 60,74
           C64,72 68,70 72,64
           C77,56 78,46 75,36
           C73,42 68,45 60,45
           C52,45 47,42 45,36 Z" fill="url(#beard)"/>

  <!-- Mouth: hidden at rest; when speaking the beard parts, mustache lifts, round mouth opens -->
  <g class="mouth-closed">
    <path d="M51,46 Q60,42 69,46" stroke="#4a2c17" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </g>
  <g class="mouth-open">
    <ellipse cx="60" cy="51" rx="7" ry="5.5" fill="url(#skin)"/>
    <path d="M50,43 Q60,39 70,43" stroke="#4a2c17" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="60" cy="51" r="4.5" fill="#1a0f08"/>
  </g>

  <!-- Eyes and face -->
  <circle cx="55" cy="32" r="2.5" fill="#2d1810"/>
  <circle cx="65" cy="32" r="2.5" fill="#2d1810"/>
  <rect x="50" y="28" width="8" height="2.5" fill="#4a2c17"/>
  <rect x="62" y="28" width="8" height="2.5" fill="#4a2c17"/>
  <path d="M60,34 L60,38" stroke="#d4a574" stroke-width="2" stroke-linecap="round"/>

  <!-- Baseball cap -->
  <path d="M45,26 C45,14 75,14 75,26 L75,28 L45,28 Z" fill="url(#cap)"/>
  <path d="M45,28 C36,27 30,30 25,36 C40,38 56,34 75,28" fill="#0891b2"/>
  <circle cx="60" cy="18" r="2.5" fill="#0891b2"/>

  <!-- Rest arms - hanging at sides -->
  <g class="arms-rest">
    <path d="M30,76 L24,98" stroke="url(#skin)" stroke-width="20" stroke-linecap="round"/>
    <path d="M24,98 L21,118" stroke="url(#skin)" stroke-width="17" stroke-linecap="round"/>
    <ellipse cx="28" cy="84" rx="9" ry="12" transform="rotate(-15 28 84)" fill="url(#skin)"/>

    <path d="M90,76 L96,98" stroke="url(#skin)" stroke-width="20" stroke-linecap="round"/>
    <path d="M96,98 L99,118" stroke="url(#skin)" stroke-width="17" stroke-linecap="round"/>
    <ellipse cx="92" cy="84" rx="9" ry="12" transform="rotate(15 92 84)" fill="url(#skin)"/>
  </g>

  <!-- Flex arms - double biceps -->
  <g class="arms-flex">
    <path d="M32,78 L12,64" stroke="url(#skin)" stroke-width="22" stroke-linecap="round"/>
    <path d="M12,64 L16,44" stroke="url(#skin)" stroke-width="18" stroke-linecap="round"/>
    <ellipse cx="18" cy="68" rx="12" ry="16" transform="rotate(-30 18 68)" fill="url(#skin)"/>
    <circle cx="16" cy="42" r="9" fill="url(#skin)"/>

    <path d="M88,78 L108,64" stroke="url(#skin)" stroke-width="22" stroke-linecap="round"/>
    <path d="M108,64 L104,44" stroke="url(#skin)" stroke-width="18" stroke-linecap="round"/>
    <ellipse cx="102" cy="68" rx="12" ry="16" transform="rotate(30 102 68)" fill="url(#skin)"/>
    <circle cx="104" cy="42" r="9" fill="url(#skin)"/>
  </g>
</svg>`;

let timer;

export function mountTravis() {
  const host = document.getElementById('travis');
  if (!host) return;

  const bubble = el('div', { class: 'travis-bubble', text: "Let's Gooo" });
  const avatar = el('button', {
    class: 'travis-avatar',
    type: 'button',
    'aria-label': 'Say hello',
    html: AVATAR,
  });
  const widget = el('div', { class: 'travis' }, [bubble, avatar]);

  avatar.addEventListener('click', () => {
    widget.classList.add('flex');
    clearTimeout(timer);
    timer = setTimeout(() => widget.classList.remove('flex'), 1500);
  });

  host.append(widget);
}
