// Loads the workout plans. Add a new plan file here to make it available in the app.

import workoutA from './workout-a.js';
import workoutB from './workout-b.js';

export const WORKOUTS = [workoutA, workoutB];

export function getWorkout(id) {
  return WORKOUTS.find((w) => w.id === id) ?? null;
}
