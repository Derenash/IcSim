import { randomizeWorldPositions, world } from './world.js';
import { startingTerm} from './params.js';

// Parse:
export function parseLambdaTerm(term) {
  const nodes = {};
  let open_ports = {};
  let nodeId = 0;
  let path = { target: 0, slot: 0 };
  nodeId++;
  const node = { type: "init", ports: [parseTerm(term, path)] };
  nodes[0] = node;

  function parseTerm(subterm, path_to_parent) {
    let next = subterm[0];
    switch (next) {
      case "λ":
      case "@":
        return parseLam(subterm, path_to_parent);
      case "(":
        return parseApp(subterm, path_to_parent);
      default:
        return parseVal(subterm, path_to_parent);
    }
  }

  function parseLam(subterm, origin_port) {
    let nameEndIndex = 1;
    while (nameEndIndex < subterm.length && !['(', ' ', 'λ', '@', '.'].includes(subterm[nameEndIndex])) {
      nameEndIndex++;
    }
    const name = subterm.slice(1, nameEndIndex);
    open_ports[name] = { target: nodeId, slot: 1, uses: [] };
    
    let body = subterm.slice(nameEndIndex).trim();
    if (body.startsWith('.')) body = body.slice(1).trim();
  
    let path = { target: nodeId, slot: 2 };
    const result = { target: nodeId, slot: 0 };
    const lam_id = nodeId;
    nodeId++;
    let cont = parseTerm(body, path);
    const node = {
      type: 'trig',
      label: 0,
      ports: [origin_port, null, cont],
    };
    nodes[lam_id] = node;
    return result;
  }
  

  function parseApp(subterm, origin_port) {
    const [fun, arg] = divideTerm(subterm);
    const result = { target: nodeId, slot: 2 };
    let path_0 = { target: nodeId, slot: 0 };
    let path_1 = { target: nodeId, slot: 1 };
    const app_id = nodeId;
    nodeId++;
    let cont_0 = parseTerm(fun, path_0);
    let cont_1 = parseTerm(arg, path_1);
    const node = {
      type: "trig",
      label: 0,
      ports: [cont_0, cont_1, origin_port],
    };
    nodes[app_id] = node;
    return result;
  }

  function divideTerm(str) {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "(") {
        count++;
      } else if (str[i] === ")") {
        count--;
      } else if (str[i] === " " && count === 1) {
        return [str.slice(1, i).trim(), str.slice(i + 1, str.length - 1).trim()];
      }
    }
    return [];
  }

  function parseVal(subterm, path_to_parent) {
    const val_id = nodeId;
    let variable = subterm.trim();
    if (open_ports.hasOwnProperty(variable)) {
      open_ports[variable].uses.push(path_to_parent);
    } else {
      const newNode = {
        type: "val",
        name: variable,
        ports: [path_to_parent],
      };
      const result = { target: val_id, slot: 0 }
      nodes[val_id] = newNode;
      nodeId++;
      return result
    }
  }

  function addDups() {
    let dupLabel = 1;
  
    // Keep iterating while there are still open_ports
    while (Object.keys(open_ports).length > 0) {
      // Iterate through each variable in open_ports
      for (const variable in open_ports) {
        const open_port = open_ports[variable];
        const numUses = open_port.uses.length;
        const dup_id = nodeId
  
        // If there are no uses for this variable, create an erasure node
        if (numUses === 0) {
          const erasureNode = {
            type: 'eras',
            ports: [{ target: open_port.target, slot: open_port.slot }],
          };
          nodes[dup_id] = erasureNode;
          nodes[open_port.target].ports[open_port.slot] = {target: dup_id, slot: 0}
          nodeId++;
          delete open_ports[variable];
        }
        // If there's only one use for this variable,
        // directly connect it to the corresponding node
        // and connect the corresponding node to it
        else if (numUses === 1) {
          const ori_port = {target: open_port.target, slot: open_port.slot};
          const des_port = open_port.uses[0];
          let des_node = nodes[open_port.uses[0].target];
          let ori_node = nodes[open_port.target]; 
          des_node.ports[open_port.uses[0].slot] = ori_port
          ori_node.ports[open_port.slot] = des_port
          nodes[open_port.uses[0].target] = des_node;
          nodes[open_port.target] = ori_node;
          delete open_ports[variable]; // Remove this variable from open_ports
        }
        // If there are multiple uses for this variable, create a duplicate node and split the uses
        // and connect the original node into the dup
        else {
          const half = Math.ceil(numUses / 2);
          const leftUses = open_port.uses.slice(0, half);
          const rightUses = open_port.uses.slice(half);
  
          // Create a duplicate node
          const dupNode = {
            type: 'trig',
            label: dupLabel++,
            ports: [
              { target: open_port.target, slot: open_port.slot },
              null,
              null,
            ],
          };
          nodes[open_port.target].ports[open_port.slot] = {target: dup_id, slot: 0}
          nodes[dup_id] = dupNode;
          nodeId++;
          
  
          // Split the uses into left and right, and update open_ports
          open_ports[variable + '_left'] = {
            target: dup_id,
            slot: 1,
            uses: leftUses,
          };
          open_ports[variable + '_right'] = {
            target: dup_id,
            slot: 2,
            uses: rightUses,
          };
          delete open_ports[variable];
        }
      }
    }
  }
  
  addDups();
  return nodes;
  
}

const term  = "(λfλx(f (f x)) λaλb(a (a b)))"
const nodes = parseLambdaTerm(term)
console.log(JSON.stringify(nodes))

const lambdaInput = document.getElementById('lambdaInput');
const submitLambda = document.getElementById('submitLambda');

submitLambda.addEventListener('click', () => {
  const lambdaTerm = lambdaInput.value;
  if (lambdaTerm) {
    const parsedWorld = parseLambdaTerm(lambdaTerm);
    if (parsedWorld) {
      // Clear the current world
      for (const [id, _] of Object.entries(world)) {
        delete world[id];
      }
      
      // Paste the parsed world and randomize positions
      Object.assign(world, randomizeWorldPositions(parsedWorld));
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const lambdaInput = document.getElementById("lambdaInput");
  lambdaInput.value = startingTerm;
});

