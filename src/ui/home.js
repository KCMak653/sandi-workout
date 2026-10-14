import { el } from './dom.js';

export function renderHome(root, app) {
  root.append(
    el('h1', { text: "💪 Sandi's Workout" }),
    el('button', {
      class: 'btn',
      text: '🏋️ Log Workout',
      onclick: () => app.go('choose'),
    }),
    el('button', {
      class: 'btn secondary',
      text: '📅 See Previous Workouts',
      onclick: () => app.go('previous'),
    }),
  );
}
