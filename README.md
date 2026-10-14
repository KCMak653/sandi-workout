# Sandi's Workout

A simple, mobile-first workout tracker. No build step, no backend — plain
HTML/CSS/JS with data saved in the browser's `localStorage`.

## Run locally

ES modules must be served over HTTP (not opened as a `file://` URL), so start
any static server from this folder:

    python -m http.server 8000

Then open <http://localhost:8000> on your phone or browser.

## Structure

- `index.html` — app shell
- `styles.css` — mobile-first, large-touch styles
- `src/workouts/` — one self-contained plan per file (`workout-a.js`, `workout-b.js`),
  each owning its exercises + sections; `index.js` loads them
- `src/storage.js` — the only code that touches `localStorage`
- `src/repo.js` — queries over saved sessions (the seam for a future API)
- `src/ui/` — screens + tiny DOM helpers

## Stored data

Sessions live under the `sandi-workout` `localStorage` key:

    { schema_version, settings, sessions: [...] }

Each session:

    { id, date, template_id, entries: { <exercise_id>: <entry> }, done? }

An entry holds **actual input plus a completion flag**:

- cardio:    `{ duration_min, incline, pace, done? }`
- strength:  `{ sets: [ { reps?, seconds?, weight? } ], done? }`

`done` is set by the exercise screen's **Done** button and drives the ✓ /
strikethrough on the workout screen. It is never copied when prefilling.

Prescriptions (`target`) live in `src/exercises.js` and are display-only.

## Icons & offline (PWA)

The manifest, home-screen icons, and service worker make this installable and
usable offline.

- Regenerate icons after changing the design: `npm run icons`
  (dependency-free, writes to `icons/`).
- `sw.js` precaches the whole app shell; bump `CACHE_VERSION` at the top of
  `sw.js` whenever the cached files change so devices pick up the update.
- Offline/install only work over **HTTPS** (localhost is exempt), so it kicks
  in once deployed.

## Deploy (Railway)

No build step. Railway runs the tiny static server in `server.js`:

1. Push this repo to GitHub (`origin` is `KCMak653/sandi-workout`).
2. Railway → **New Project → Deploy from GitHub repo** → pick `sandi-workout`.
3. Railway auto-detects Node (`package.json`) and runs `npm start` →
   `node server.js`, which binds to Railway's `$PORT`.
4. **Settings → Networking → Generate Domain**. HTTPS is automatic.
5. Open the URL on the phone → *Add to Home Screen* / *Install app*.

Notes:

- Railway is a service host, so an always-on deploy needs a paid plan
  (Hobby is ~$5/mo). For a free alternative, the same files work as-is on
  Cloudflare Pages or GitHub Pages (`main` / root, no build command).
- Data is per-browser `localStorage`, so it does not sync across devices and a
  different URL starts empty.

### Run the production server locally

    PORT=3000 npm start   # then open http://localhost:3000
