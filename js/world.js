import { parseLambdaTerm } from './parse.js';
import { startingTerm } from './params.js';
export { world };

// λf.λx.(f (f x))
// const rawWorld = {
//   0: {type: "init", ports: [{target: 1, slot: 0}]},
//   1: {type: "trig", label: 0, ports: [{target: 0, slot: 0}, {target: 3, slot: 0}, {target: 2, slot: 0}]},
//   2: {type: "trig", label: 0, ports: [{target: 1, slot: 2}, {target: 5, slot: 1}, {target: 4, slot: 2}]},
//   3: {type: "trig", label: 1, ports: [{target: 1, slot: 1}, {target: 4, slot: 0}, {target: 5, slot: 0}]},
//   4: {type: "trig", label: 0, ports: [{target: 3, slot: 1}, {target: 5, slot: 2}, {target: 2, slot: 2}]},
//   5: {type: "trig", label: 0, ports: [{target: 3, slot: 2}, {target: 2, slot: 1}, {target: 4, slot: 1}]}
// };


// λf.λx.((f x) (x (x x)))
// const rawWorld = {
//   0: {type: "init", ports: [{target: 1, slot: 0}]},
//   1: {type: "trig", label: 0, ports: [{target: 0, slot: 0}, {target: 4, slot: 0}, {target: 2, slot: 0}]},
//   2: {type: "trig", label: 0, ports: [{target: 1, slot: 2}, {target: 7, slot: 0}, {target: 3, slot: 2}]},
//   3: {type: "trig", label: 0, ports: [{target: 4, slot: 2}, {target: 5, slot: 2}, {target: 2, slot: 2}]},
//   4: {type: "trig", label: 0, ports: [{target: 1, slot: 1}, {target: 8, slot: 1}, {target: 3, slot: 0}]},
//   5: {type: "trig", label: 0, ports: [{target: 8, slot: 2}, {target: 6, slot: 2}, {target: 3, slot: 1}]},
//   6: {type: "trig", label: 0, ports: [{target: 9, slot: 1}, {target: 9, slot: 2}, {target: 5, slot: 1}]},
//   7: {type: "trig", label: 1, ports: [{target: 2, slot: 1}, {target: 8, slot: 0}, {target: 9, slot: 0}]},
//   8: {type: "trig", label: 2, ports: [{target: 7, slot: 1}, {target: 4, slot: 1}, {target: 5, slot: 0}]},
//   9: {type: "trig", label: 3, ports: [{target: 7, slot: 2}, {target: 6, slot: 0}, {target: 6, slot: 1}]},
// }

const rawWorld = parseLambdaTerm(startingTerm);
const world    = randomizeWorldPositions(rawWorld);

export function randomizeWorldPositions(world) {
  const newWorld  = {};
  for (const key in world) {
    const newObj  = {...world[key]};
    newObj.pos    = {x: Math.floor(Math.random() * 301), y: Math.floor(Math.random() * 301), z: 0};
    newObj.vel    = {x: 0, y: 0, z: 0};
    newWorld[key] = newObj;
  }
  return newWorld;
}