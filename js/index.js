import { render, canvas, camera } from './canvas.js';
import { tickInterval } from './params.js';
import { world } from './world.js';
import { tick } from './physics.js';
import './parse.js';
import './sliders.js';


setInterval(() => {
  tick(world);
  render(world, canvas, camera);
}, tickInterval);

