// Queries over saved sessions. This is the seam: the UI depends on these
// functions, not on storage. Swapping localStorage for an API later means
// writing another module with the same signatures.

import { load, save } from './storage.js';

function byDateDesc(sessions) {
  return [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getSessions() {
  return load().sessions;
}

export function getUnit() {
  return load().settings?.unit ?? 'lb';
}

// Finished workouts only, newest first.
export function getCompletedSessions() {
  return byDateDesc(getSessions()).filter((s) => s.done === true);
}

export function saveSession(session) {
  const data = load();
  const i = data.sessions.findIndex((s) => s.id === session.id);
  if (i >= 0) data.sessions[i] = session;
  else data.sessions.push(session);
  save(data);
}

export function startSession(templateId) {
  return {
    id: makeId(),
    date: new Date().toISOString(),
    template_id: templateId,
    entries: {},
  };
}

// Most recent previous entry for an exercise, ignoring the session in progress.
export function getPreviousEntry(exerciseId, excludeSessionId) {
  for (const session of byDateDesc(getSessions())) {
    if (session.id === excludeSessionId) continue;
    const entry = session.entries?.[exerciseId];
    if (entry) return entry;
  }
  return null;
}

function makeId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
