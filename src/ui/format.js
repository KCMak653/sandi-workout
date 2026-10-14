// Turn targets and entries into short human-readable strings.

function cardioText(v) {
  const parts = [];
  if (v.duration_min != null) parts.push(`${v.duration_min} min`);
  if (v.incline != null) parts.push(`incline ${v.incline}`);
  if (v.pace != null) parts.push(`pace ${v.pace}`);
  return parts.join(' · ');
}

export function formatTarget(exercise) {
  const t = exercise.target;
  if (!t) return '';
  const side = exercise.unilateral ? ' each side' : '';
  if (exercise.kind === 'cardio') return cardioText(t);
  if (t.sets != null && t.reps != null) return `${t.sets} × ${t.reps} reps${side}`;
  if (t.sets != null && t.seconds != null) return `${t.sets} × ${t.seconds} sec${side}`;
  if (t.sets != null) return `${t.sets} sets`;
  return '';
}

export function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function summarizeEntry(entry, exercise) {
  if (exercise.kind === 'cardio') return cardioText(entry);
  const text = (entry.sets ?? [])
    .map((s) => {
      if (s.seconds != null && s.weight != null) return `${s.weight} × ${s.seconds}s`;
      if (s.seconds != null) return `${s.seconds}s`;
      if (s.reps != null && s.weight != null) return `${s.weight} × ${s.reps}`;
      if (s.reps != null) return `${s.reps} reps`;
      return '—';
    })
    .join(', ');
  return exercise.unilateral ? `${text} (each side)` : text;
}
