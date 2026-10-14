// The ONLY module that touches localStorage. Everything else goes through repo.js.

const KEY = 'sandi-workout';

const SCHEMA_VERSION = 2;

function empty() {
  return { schema_version: SCHEMA_VERSION, settings: { unit: 'lb' }, sessions: [] };
}

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    return migrate(JSON.parse(raw));
  } catch (err) {
    console.error('Could not read saved workouts:', err);
    return empty();
  }
}

export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Could not save workouts:', err);
  }
}

// Schema changes are applied here, step by step, keyed off schema_version.
function migrate(data) {
  const version = data.schema_version ?? 0;
  data.settings = data.settings ?? {};
  if (version < 2) data.settings.unit = 'lb'; // v2: global unit changed kg -> lb
  data.schema_version = SCHEMA_VERSION;
  return data;
}
