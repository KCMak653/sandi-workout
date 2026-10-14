// Workout A — a self-contained plan. Edit this file freely; it is loaded by index.js.

export default {
  id: 'A',
  name: 'Workout A',

  exercises: {
    treadmill_warmup: {
      kind: 'cardio',
      name: 'Treadmill (Warm-up)',
      instructions: 'Start slow, then build to a brisk walk or light jog.',
      target: { duration_min: 10 },
    },
    treadmill_cooldown: {
      kind: 'cardio',
      name: 'Treadmill (Cool-down)',
      instructions: 'Slow to an easy walk and let your breathing settle.',
      target: { duration_min: 20 },
    },
    wall_sit: {
      kind: 'strength',
      name: 'Wall Sit',
      instructions: 'Back flat against a wall, slide down until your knees are bent as if sitting. Hold.',
      unilateral: false,
      target: { sets: 2, seconds: 20 },
    },
    bird_dog: {
      kind: 'strength',
      name: 'Bird Dog',
      instructions: 'On hands and knees, extend one arm and the opposite leg, hold briefly, then switch sides.',
      unilateral: true,
      target: { sets: 2, reps: 15 },
    },
    squats: {
      kind: 'strength',
      name: 'Squats',
      instructions: 'Feet shoulder-width apart. Sit back and down, keep your chest up, then stand.',
      unilateral: false,
      target: { sets: 2, reps: 10 },
    },
    hip_abduction: {
      kind: 'strength',
      name: 'Hip Abduction',
      instructions: 'Seated on the machine, push your knees outward against the pads, then return slowly.',
      unilateral: false,
      target: { sets: 3, reps: 15 },
    },
    leg_press: {
      kind: 'strength',
      name: 'Leg Press',
      instructions: 'Back flat against the pad. Push through your heels, then return slowly.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
    cable_row: {
      kind: 'strength',
      name: 'Cable Row',
      instructions: 'Sit tall, pull the handle to your stomach, squeeze your shoulder blades, then return.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
    chest_press: {
      kind: 'strength',
      name: 'Chest Press',
      instructions: 'Handles at chest height. Press out smoothly without locking your elbows.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
    shoulder_press: {
      kind: 'strength',
      name: 'Dumbbell Shoulder Press',
      instructions: 'Dumbbells at shoulder height. Press straight up, then lower slowly.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
    leg_curls: {
      kind: 'strength',
      name: 'Leg Curls',
      instructions: 'Curl your heels toward your bottom, then lower slowly.',
      unilateral: false,
      target: { sets: 2, reps: 10 },
    },
  },

  sections: [
    { id: 'intro_cardio', name: 'Intro Cardio', exercise_ids: ['treadmill_warmup'] },
    { id: 'core', name: 'Core', exercise_ids: ['wall_sit', 'bird_dog', 'squats'] },
    {
      id: 'weights',
      name: 'Weights',
      exercise_ids: [
        'hip_abduction',
        'leg_press',
        'cable_row',
        'chest_press',
        'shoulder_press',
        'leg_curls',
      ],
    },
    { id: 'outro_cardio', name: 'Outro Cardio', exercise_ids: ['treadmill_cooldown'] },
  ],
};
