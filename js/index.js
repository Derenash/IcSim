import { render, canvas, camera } from './draw/canvas.js';
import { tickInterval, param } from './controller/params.js';
import { world } from './model/world.js';
import { tick } from './model/physics.js';
import './parse/parse.js';
import './controller/sliders.js';


setInterval(() => {
  tick(world, param);
  render(world, canvas, camera);
}, tickInterval);

