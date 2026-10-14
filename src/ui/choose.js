import { el, topbar } from './dom.js';
import { WORKOUTS } from '../workouts/index.js';
import { startSession } from '../repo.js';

export function renderChoose(root, app) {
  root.append(topbar('Log Workout', () => app.go('home')));

  for (const workout of WORKOUTS) {
    const ready = workout.sections.length > 0;
    root.append(
      el('button', {
        class: ready ? 'btn' : 'btn secondary',
        disabled: ready ? null : 'true',
        text: ready ? workout.name : `${workout.name} (not set up yet)`,
        onclick: () => {
          app.go('workout', { session: startSession(workout.id) });
        },
      }),
    );
  }
}
