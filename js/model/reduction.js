export function reduce_nodes(world, idx1, idx2) {
  const node1 = world[idx1];
  const node2 = world[idx2];

  if (!node1 || !node2) {
    return;
  }

  const is_connected = node1.ports[0] && node1.ports[0].target === idx2 && node1.ports[0].slot === 0;
  
  if (is_connected) {
    if (node1.label === node2.label) {
      console.log('objects anihilating: ', idx1, ': ', node1, idx2, ': ', node2)
      world[node1.ports[1].target].ports[node1.ports[1].slot] = node2.ports[1];
      world[node1.ports[2].target].ports[node1.ports[2].slot] = node2.ports[2];
      world[node2.ports[1].target].ports[node2.ports[1].slot] = node1.ports[1];
      world[node2.ports[2].target].ports[node2.ports[2].slot] = node1.ports[2];

      delete world[idx1];
      delete world[idx2];
    } else {
      // Find the highest valued key in the world object
      console.log('objects duplicating: ', idx1, ': ', node1, idx2, ': ', node2)
      const highest_key = Math.max(...Object.keys(world).map(key => parseInt(key)));

      const new_node_idx1 = highest_key + 1;
      const new_node_idx2 = new_node_idx1 + 1;
      const new_node_idx3 = new_node_idx2 + 1;
      const new_node_idx4 = new_node_idx3 + 1;

      // Add 1 new nodes that are clones of the node 2
      world[new_node_idx1] = { type: 'trig', label: node2.label, ports: 
        [node1.ports[2], { target: new_node_idx3, slot: 2 }, { target: new_node_idx4, slot: 2 }],
        vel: {x: 0, y: 0, z: 0},
        pos: random_pos_offset(node2.pos),
        rotation: node2.rotation 
      };
      world[new_node_idx2] = { type: 'trig', label: node2.label, ports: 
        [node1.ports[1], { target: new_node_idx3, slot: 1 }, { target: new_node_idx4, slot: 1 }],
        vel: {x: 0, y: 0, z: 0},
        pos: random_pos_offset(node2.pos),
        rotation: node2.rotation 
      };

      // Add 2 new nodes that are clones of the node 1
      world[new_node_idx3] = { type: 'trig', label: node1.label, ports: 
        [node2.ports[1], { target: new_node_idx2, slot: 1 }, { target: new_node_idx1, slot: 1 }],
        vel: {x: 0, y: 0, z: 0},
        pos: random_pos_offset(node1.pos),
        rotation: node1.rotation 
      };
      world[new_node_idx4] = { type: 'trig', label: node1.label, ports: 
        [node2.ports[2], { target: new_node_idx2, slot: 2 }, { target: new_node_idx1, slot: 2 }],
        vel: {x: 0, y: 0, z: 0},
        pos: random_pos_offset(node1.pos),
        rotation: node1.rotation 
      };

      // Update port connections for the new nodes
      world[node1.ports[2].target].ports[node1.ports[2].slot] = { target: new_node_idx1, slot: 0 }
      world[node1.ports[1].target].ports[node1.ports[1].slot] = { target: new_node_idx2, slot: 0 }
      world[node2.ports[1].target].ports[node2.ports[1].slot] = { target: new_node_idx3, slot: 0 };
      world[node2.ports[2].target].ports[node2.ports[2].slot] = { target: new_node_idx4, slot: 0 };

      // Delete previous 2 nodes
      delete world[idx1];
      delete world[idx2];
    }
  }
  prt(world)
}

function random_pos_offset(pos) {
  const min = -15;
  const max =  15;
  return {
    x: pos.x + random_offset(min, max),
    y: pos.y + random_offset(min, max),
    z: pos.z 
  };
}

function random_offset(min, max) {
  return Math.random() * (max - min) + min;
}



function prt(raw_world) {
  for (const key in raw_world) {
    const node = raw_world[key];
    console.log(`Node ${key}:`);
    if (node.label !== undefined) {
      console.log(`  Label: ${node.label}`);
    }

    console.log('  Ports:');
    node.ports.forEach((port, index) => {
      console.log(`    Port ${index}:`, 'Target: ', port.target, ' Slot: ', port.slot );
    });
    console.log(node.pos)
  }
}
