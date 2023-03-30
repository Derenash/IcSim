import { render, canvas, camera } from './canvas.js';
import { world } from './world.js';
import { tick } from './physics.js';
import './parse.js';
import './sliders.js';

const tickInterval = 16; // in milliseconds

setInterval(() => {
  tick(world);
  render(world, canvas, camera);
}, tickInterval);

