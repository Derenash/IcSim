export function reduceNodes(world, idx1, idx2) {
  const node1 = world[idx1];
  const node2 = world[idx2];

  if (!node1 || !node2) {
    return;
  }

  const isConnected = node1.ports[0] && node1.ports[0].target === idx2 && node1.ports[0].slot === 0;
  
  if (isConnected) {
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
      const highestKey = Math.max(...Object.keys(world).map(key => parseInt(key)));

      const newNodeIdx1 = highestKey + 1;
      const newNodeIdx2 = newNodeIdx1 + 1;
      const newNodeIdx3 = newNodeIdx2 + 1;
      const newNodeIdx4 = newNodeIdx3 + 1;

      // Add 1 new nodes that are clones of the node 2
      world[newNodeIdx1] = { type: 'trig', label: node2.label, ports: 
        [node1.ports[2], { target: newNodeIdx3, slot: 2 }, { target: newNodeIdx4, slot: 2 }],
        vel: {x: 0, y: 0, z: 0},
        pos: randomPosOffset(node2.pos)
      };
      world[newNodeIdx2] = { type: 'trig', label: node2.label, ports: 
        [node1.ports[1], { target: newNodeIdx3, slot: 1 }, { target: newNodeIdx4, slot: 1 }],
        vel: {x: 0, y: 0, z: 0},
        pos: randomPosOffset(node2.pos)
      };

      // Add 2 new nodes that are clones of the node 1
      world[newNodeIdx3] = { type: 'trig', label: node1.label, ports: 
        [node2.ports[1], { target: newNodeIdx2, slot: 1 }, { target: newNodeIdx1, slot: 1 }],
        vel: {x: 0, y: 0, z: 0},
        pos: randomPosOffset(node1.pos)
      };
      world[newNodeIdx4] = { type: 'trig', label: node1.label, ports: 
        [node2.ports[2], { target: newNodeIdx2, slot: 2 }, { target: newNodeIdx1, slot: 2 }],
        vel: {x: 0, y: 0, z: 0},
        pos: randomPosOffset(node1.pos)
      };

      // Update port connections for the new nodes
      world[node1.ports[2].target].ports[node1.ports[2].slot] = { target: newNodeIdx1, slot: 0 }
      world[node1.ports[1].target].ports[node1.ports[1].slot] = { target: newNodeIdx2, slot: 0 }
      world[node2.ports[1].target].ports[node2.ports[1].slot] = { target: newNodeIdx3, slot: 0 };
      world[node2.ports[2].target].ports[node2.ports[2].slot] = { target: newNodeIdx4, slot: 0 };

      // Delete previous 2 nodes
      delete world[idx1];
      delete world[idx2];
    }
  }
  prt(world)
}

function randomPosOffset(pos) {
  const min = -15;
  const max =  15;
  return {
    x: pos.x + randomOffset(min, max),
    y: pos.y + randomOffset(min, max),
    z: pos.z 
  };
}

function randomOffset(min, max) {
  return Math.random() * (max - min) + min;
}



function prt(rawWorld) {
  for (const key in rawWorld) {
    const node = rawWorld[key];
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
