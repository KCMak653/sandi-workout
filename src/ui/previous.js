import { el, topbar } from './dom.js';
import { getWorkout } from '../workouts/index.js';
import { getCompletedSessions } from '../repo.js';
import { formatDate } from './format.js';

export function renderPrevious(root, app) {
  root.append(topbar('Previous Workouts', () => app.go('home')));

  const sessions = getCompletedSessions();
  if (sessions.length === 0) {
    root.append(el('p', { class: 'note', text: 'No workouts logged yet.' }));
    return;
  }

  for (const session of sessions) {
    const workout = getWorkout(session.template_id);
    root.append(
      el(
        'button',
        {
          class: 'exercise-row',
          onclick: () => app.go('session', { pastSession: session }),
        },
        [
          el('span', { class: 'name', text: formatDate(session.date) }),
          el('span', { class: 'sub', text: workout?.name ?? session.template_id }),
        ],
      ),
    );
  }
}
