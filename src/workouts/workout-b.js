// Workout B — a self-contained plan. Edit this file freely; it is loaded by index.js.

export default {
  id: 'B',
  name: 'Workout B',

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
    side_plank: {
      kind: 'strength',
      name: 'Side Plank',
      instructions: 'Lie on your side with your knees bent and resting on the floor. Prop up on your forearm, lift your hips, and hold.',
      unilateral: true,
      target: { sets: 2, seconds: 20 },
    },
    glute_bridge: {
      kind: 'strength',
      name: 'Glute Bridges',
      instructions: 'Lie on your back with knees bent and feet flat. Squeeze your glutes to lift your hips, then lower slowly.',
      unilateral: false,
      target: { sets: 2, reps: 20 },
    },
    squats: {
      kind: 'strength',
      name: 'Squats',
      instructions: 'Feet shoulder-width apart. Sit back and down, keep your chest up, then stand.',
      unilateral: false,
      target: { sets: 2, reps: 10 },
    },
    hip_adduction: {
      kind: 'strength',
      name: 'Hip Adduction (Inner Thigh)',
      instructions: 'Seated on the machine, squeeze your knees together against the pads, then release slowly.',
      unilateral: false,
      target: { sets: 3, reps: 15 },
    },
    romanian_deadlift: {
      kind: 'strength',
      name: 'Dumbbell Romanian Deadlift',
      instructions: 'Hold dumbbells in front of your thighs. Push your hips back and lower, keeping your back flat, then stand.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
    lat_pulldown: {
      kind: 'strength',
      name: 'Lat Pulldown',
      instructions: 'Grip the bar wide, pull it down to your chest, squeeze your back, then let it rise slowly.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
    reverse_pec_deck: {
      kind: 'strength',
      name: 'Reverse Pec Deck Fly',
      instructions: 'Face the pad, grip the handles, pull them apart by squeezing your shoulder blades, then return.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
    leg_extension: {
      kind: 'strength',
      name: 'Leg Extension',
      instructions: 'Seated on the machine, straighten your legs against the pad, then lower slowly.',
      unilateral: false,
      target: { sets: 3, reps: 10 },
    },
  },

  sections: [
    { id: 'intro_cardio', name: 'Intro Cardio', exercise_ids: ['treadmill_warmup'] },
    { id: 'core', name: 'Core', exercise_ids: ['side_plank', 'glute_bridge', 'squats'] },
    {
      id: 'weights',
      name: 'Weights',
      exercise_ids: [
        'hip_adduction',
        'romanian_deadlift',
        'lat_pulldown',
        'reverse_pec_deck',
        'leg_extension',
      ],
    },
    { id: 'outro_cardio', name: 'Outro Cardio', exercise_ids: ['treadmill_cooldown'] },
  ],
};
