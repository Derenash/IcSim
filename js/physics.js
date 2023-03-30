import { repulsion, attraction, cooling, reduction, updateReductionSelect} from './sliders.js';
import { reduceNodes } from './reduction.js';

// Physics
export function tick(world) {
  const repulsionPow = 2;
  const attractionPow = 1;

  // Repulsion between all nodes
  for (const id1 in world) {
    const obj1 = world[id1];
    
    for (const id2 in world) {
      if (id1 === id2) continue;
      const obj2 = world[id2];
      const distance = distanceBetweenPoints(obj1.pos, obj2.pos);
      const repulsionForce = repulsion / Math.pow(distance, repulsionPow);

      const direction = {
        x: (obj1.pos.x - obj2.pos.x) / distance,
        y: (obj1.pos.y - obj2.pos.y) / distance,
        z: (obj1.pos.z - obj2.pos.z) / distance,
      };

      obj1.vel.x += repulsionForce * direction.x;
      obj1.vel.y += repulsionForce * direction.y;
      obj1.vel.z += repulsionForce * direction.z;
    }

    obj1.ports.forEach((port, idx) => {
      const obj2 = world[port.target];
      if (!obj1 || !obj2) return;
      const distance = distanceBetweenPoints(obj1.pos, obj2.pos);
      const to_reduce = ((idx + port.slot) === 0) && (reduction !== 'Off') && (obj1.type === 'trig') && (obj2.type === 'trig');
      const port_attraction = to_reduce ? attraction * 5 : attraction;
      const attractionForce = port_attraction * Math.pow(distance, attractionPow) / 500000;
      if ((distance <= 60) && to_reduce) {
        reduceNodes(world, id1, port.target)
        if (reduction === "One") {
          updateReductionSelect("Off")
        }
        ;
      }

      if (distance === 0) return;
      const direction = {
        x: (obj2.pos.x - obj1.pos.x) / distance,
        y: (obj2.pos.y - obj1.pos.y) / distance,
        z: (obj2.pos.z - obj1.pos.z) / distance,
      };
    
      obj1.vel.x += attractionForce * direction.x;
      obj1.vel.y += attractionForce * direction.y;
      obj1.vel.z += attractionForce * direction.z;
    });    

    obj1.pos.x += obj1.vel.x;
    obj1.pos.y += obj1.vel.y;
    obj1.pos.z += obj1.vel.z;

    obj1.vel.x *= cooling / 100;
    obj1.vel.y *= cooling / 100;
    obj1.vel.z *= cooling / 100;
  }
}

function distanceBetweenPoints(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
}
