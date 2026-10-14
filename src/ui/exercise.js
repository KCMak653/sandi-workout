import { el, topbar } from './dom.js';
import { getWorkout } from '../workouts/index.js';
import { formatTarget, summarizeEntry } from './format.js';
import { getPreviousEntry, saveSession, getUnit } from '../repo.js';

const num = (value) => (value === '' || value == null ? null : Number(value));

export function renderExercise(root, app) {
  const exerciseId = app.state.exerciseId;
  const session = app.state.session;
  const workout = getWorkout(session.template_id);
  const exercise = workout.exercises[exerciseId];
  const previous = getPreviousEntry(exerciseId, session.id);

  // Prefill: current session entry, else last time, else blank.
  let entry = session.entries[exerciseId];
  if (!entry) {
    entry = previous ? structuredClone(previous) : blankEntry(exercise);
    delete entry.done; // completion is per-session, never copied from last time
  }

  const commit = () => {
    session.entries[exerciseId] = entry;
    saveSession(session);
  };

  root.append(topbar(exercise.name, () => app.go('workout')));

  const target = formatTarget(exercise);
  if (target) {
    root.append(
      el('div', { class: 'target' }, [
        el('div', { class: 'label', text: 'Target' }),
        el('div', { class: 'value', text: target }),
      ]),
    );
  }

  if (previous) {
    root.append(
      el('p', { class: 'prev', text: `Last time: ${summarizeEntry(previous, exercise)}` }),
    );
  }

  // Help button
  const helpBody = el('div', { class: 'body', text: exercise.instructions });
  helpBody.style.display = 'none';
  root.append(
    el('div', { class: 'help' }, [
      el('button', {
        class: 'btn ghost',
        text: 'Help — how to do it',
        onclick: () => {
          helpBody.style.display = helpBody.style.display === 'none' ? 'block' : 'none';
        },
      }),
      helpBody,
    ]),
  );

  if (exercise.kind === 'cardio') {
    root.append(cardioFields(entry, commit));
  } else {
    root.append(strengthFields(entry, exercise, commit, app));
  }

  root.append(
    el('div', { class: 'footer-actions' }, [
      el('button', {
        class: 'btn',
        text: entry.done ? 'Done ✓' : 'Done',
        onclick: () => {
          entry.done = true;
          commit();
          app.go('workout');
        },
      }),
      entry.done
        ? el('button', {
            class: 'btn ghost',
            text: 'Mark as not done',
            onclick: () => {
              entry.done = false;
              commit();
              app.go('workout');
            },
          })
        : null,
    ]),
  );
}

const blankSet = (weight = null) => ({ reps: null, seconds: null, weight });

function blankEntry(exercise) {
  if (exercise.kind === 'cardio') return { duration_min: null, incline: null, pace: null };
  const count = exercise.target?.sets ?? 1;
  return { sets: Array.from({ length: count }, () => blankSet()) };
}

function cardioFields(entry, commit) {
  const field = (label, key) =>
    el('div', { class: 'field' }, [
      el('label', { text: label }),
      el('input', {
        type: 'number',
        inputmode: 'decimal',
        step: 'any',
        value: entry[key] ?? '',
        oninput: (e) => {
          entry[key] = num(e.target.value);
          commit();
        },
      }),
    ]);

  return el('div', {}, [
    field('Duration (min)', 'duration_min'),
    field('Incline', 'incline'),
    field('Pace', 'pace'),
  ]);
}

function strengthFields(entry, exercise, commit, app) {
  const timed = exercise.target?.seconds != null;
  const unit = getUnit();
  const rows = el('div', { class: 'sets' });

  entry.sets.forEach((set, i) => {
    rows.append(
      el('div', { class: 'set-row' }, [
        el('span', { class: 'set-num', text: String(i + 1) }),
        el('div', { class: 'field' }, [
          el('label', { text: timed ? 'Seconds' : 'Reps' }),
          el('input', {
            type: 'number',
            inputmode: 'numeric',
            value: (timed ? set.seconds : set.reps) ?? '',
            oninput: (e) => {
              const v = num(e.target.value);
              if (timed) set.seconds = v;
              else set.reps = v;
              commit();
            },
          }),
        ]),
        el('div', { class: 'field' }, [
          el('label', { text: `Weight (${unit})` }),
          el('input', {
            type: 'number',
            inputmode: 'decimal',
            step: 'any',
            value: set.weight ?? '',
            oninput: (e) => {
              set.weight = num(e.target.value);
              commit();
            },
          }),
        ]),
      ]),
    );
  });

  const addSet = el('button', {
    class: 'btn secondary',
    text: '+ Add Set',
    onclick: () => {
      const last = entry.sets.at(-1);
      entry.sets.push(blankSet(last?.weight ?? null));
      commit();
      app.render();
    },
  });

  return el('div', {}, [rows, addSet]);
}
