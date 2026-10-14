import { el, topbar } from './dom.js';
import { getWorkout } from '../workouts/index.js';
import { formatTarget } from './format.js';
import { saveSession } from '../repo.js';

export function renderWorkout(root, app) {
  const session = app.state.session;
  const workout = getWorkout(session.template_id);

  root.append(topbar(workout.name, () => app.go('choose')));

  for (const section of workout.sections) {
    root.append(el('h2', { text: section.name }));
    for (const id of section.exercise_ids) {
      const exercise = workout.exercises[id];
      const done = session.entries[id]?.done === true;
      root.append(
        el(
          'button',
          {
            class: 'exercise-row' + (done ? ' done' : ''),
            onclick: () => app.go('exercise', { exerciseId: id }),
          },
          [
            el('span', { class: 'name', text: (done ? '✓ ' : '') + exercise.name }),
            el('span', { class: 'sub', text: formatTarget(exercise) }),
          ],
        ),
      );
    }
  }

  root.append(
    el('div', { class: 'footer-actions' }, [
      el('button', {
        class: 'btn',
        text: '🎉 Done — finish workout',
        onclick: () => {
          session.done = true;
          saveSession(session);
          app.go('home');
        },
      }),
    ]),
  );
}
