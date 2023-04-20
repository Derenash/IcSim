import { reduce_nodes } from './reduction.js';

// Physics
export function tick(world, param) {

  // Iterate through all nodes to apply the below effects:
  //   Physics:
  //     Repulsion: Nodes are repelled by all other Nodes
  //     Attraction: Nodes are pulled by all connected Nodes
  //   Reduction (should only happen when 2 nodes connected by their main port are very close to each other):
  //     Annihilation: When the 2 Nodes have the same Label
  //     - The 2 Nodes are deleted
  //     - The 2 pair of nodes connected to each one of the deleted nodes are connected to each other
  //     Duplication: When the 2 Nodes have different Label
  //     - The 2 nodes are cloned
  //     - The clones are connected to each other by the ports 1 and 2
  //     - Their main port is connected to each one of the ports 1 and 2 of the previous Nodes

  for (const id1 in world) {
    const obj1 = world[id1];
    
    // All nodes repel current node
    for (const id2 in world) {
      // Ignore if a node is interacting with itself
      if (id1 === id2) continue;
      const obj2 = world[id2];
      const distance = distance_between_points(obj1.pos, obj2.pos);
      // Force / (Distance ^ e)
      const repulsion_force = param.rep_str / Math.pow(distance, param.rep_exp);

      const direction = {
        x: (obj1.pos.x - obj2.pos.x) / distance,
        y: (obj1.pos.y - obj2.pos.y) / distance,
        z: (obj1.pos.z - obj2.pos.z) / distance,
      };

        obj1.vel.x += repulsion_force * direction.x;
        obj1.vel.y += repulsion_force * direction.y;
        obj1.vel.z += repulsion_force * direction.z;
    }

    // Iteract through the 3 ports of the object, to apply Attraction or Reduction
    obj1.ports.forEach((port, idx) => {
      const obj2 = world[port.target];
      if (!obj1 || !obj2) return;
      const distance = distance_between_points(obj1.pos, obj2.pos);
      // Checks if Reduction is active && the 2 Nodes are connected by Port 0
      const to_reduce = ((idx + port.slot) === 0) && (typeof param.reductions !== 'undefined' && param.reductions !== 'Off') && (obj1.type === 'trig') && (obj2.type === 'trig');
      // Accelerates the Node if it should be reduced
      const port_attraction = to_reduce ? param.att_str * 5 : param.att_str;
      // Force * (Distance ^ e)
      const attraction_force = port_attraction * Math.pow(distance, param.att_exp) / 500000;
      // If they're close enough and should be reduced, reduce them
      if ((distance <= 60) && to_reduce) {
        reduce_nodes(world, id1, port.target)
        if (param.reductions === "One") {
          param.reductions = "Off"
        };
      }

      if (obj1.type === 'trig') {
        // Calculate the current angle of the triangle
        const current_angle = obj1.rotation;
      
        // Calculate the desired angle to face towards the string
        const target = world[obj1.ports[0].target];
        const dx = target.pos.x - obj1.pos.x;
        const dy = target.pos.y - obj1.pos.y;
        const target_angle = Math.atan2(dy, dx);
      
        // Calculate the angular difference between the current and target angles
        const angular_diff = target_angle - current_angle;
      
        // Apply a torque proportional to the angular difference
        const torque = angular_diff * param.rot_str;
        obj1.rotation += torque;
      }
      
      // Never divide by 0
      if (distance === 0) return;
      const direction = {
        x: (obj2.pos.x - obj1.pos.x) / distance,
        y: (obj2.pos.y - obj1.pos.y) / distance,
        z: (obj2.pos.z - obj1.pos.z) / distance,
      };
    
        obj1.vel.x += attraction_force * direction.x;
        obj1.vel.y += attraction_force * direction.y;
        obj1.vel.z += attraction_force * direction.z;
    });    

    // Moves the object
    obj1.pos.x += obj1.vel.x;
    obj1.pos.y += obj1.vel.y;
    obj1.pos.z += obj1.vel.z;

    // Reduces the velocity by a friction constant
    // ex if friction is 95, velocity will be reduced by 5% each frame
    obj1.vel.x *= 1 - (param.friction / 100);
    obj1.vel.y *= 1 - (param.friction / 100);
    obj1.vel.z *= 1 - (param.friction / 100);
  }
}

function distance_between_points(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2) + Math.pow(p1.z - p2.z, 2));
  }
