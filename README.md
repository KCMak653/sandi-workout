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
