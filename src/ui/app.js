// Bootstrap + a very small screen router.

import { renderHome } from './home.js';
import { renderChoose } from './choose.js';
import { renderWorkout } from './workout.js';
import { renderExercise } from './exercise.js';
import { renderPrevious } from './previous.js';
import { renderSession } from './session.js';

export const app = {
  state: {
    screen: 'home',
    session: null,
    pastSession: null,
    exerciseId: null,
  },

  go(screen, patch = {}) {
    Object.assign(this.state, patch);
    this.state.screen = screen;
    this.render();
    window.scrollTo(0, 0);
  },

  render() {
    const root = document.getElementById('app');
    root.replaceChildren();
    const screens = {
      home: renderHome,
      choose: renderChoose,
      workout: renderWorkout,
      exercise: renderExercise,
      previous: renderPrevious,
      session: renderSession,
    };
    (screens[this.state.screen] ?? renderHome)(root, this);
  },
};

app.render();
