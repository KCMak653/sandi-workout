import { el, topbar } from './dom.js';
import { getWorkout } from '../workouts/index.js';
import { summarizeEntry, formatDate } from './format.js';

// Read-only summary of one finished session.
export function renderSession(root, app) {
  const session = app.state.pastSession;
  const workout = getWorkout(session.template_id);

  root.append(topbar(workout?.name ?? 'Workout', () => app.go('previous')));
  root.append(el('p', { class: 'prev', text: formatDate(session.date) }));

  for (const section of workout?.sections ?? []) {
    root.append(el('h2', { text: section.name }));
    for (const id of section.exercise_ids) {
      const exercise = workout?.exercises[id];
      if (!exercise) continue;
      const entry = session.entries[id];
      root.append(
        el('div', { class: 'exercise-row readonly' }, [
          el('span', {
            class: 'name',
            text: (entry?.done ? '✓ ' : '') + exercise.name,
          }),
          el('span', {
            class: 'sub',
            text: entry ? summarizeEntry(entry, exercise) : 'Not recorded',
          }),
        ]),
      );
    }
  }
}
