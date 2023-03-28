const canvas = document.getElementById('interactionCanvas');
const tickInterval = 16; // in milliseconds

const world = {
  0: {type: "init", ports: [{target: 1, slot: 0}], pos: {x: 90, y: 15, z: 0}, vel: {x: 0, y: 0, z: 0}},
  1: {type: "trig", label: 0, ports: [{target: 0, slot: 0}, {target: 3, slot: 0}, {target: 2, slot: 0}], pos: {x: 110, y: 80,  z: 0}, vel: {x: 0, y: 0, z: 0}},
  2: {type: "trig", label: 0, ports: [{target: 1, slot: 2}, {target: 5, slot: 1}, {target: 4, slot: 2}], pos: {x: 150, y: 170, z: 0}, vel: {x: 0, y: 0, z: 0}},
  3: {type: "trig", label: 1, ports: [{target: 1, slot: 1}, {target: 4, slot: 0}, {target: 5, slot: 0}], pos: {x: 70,  y: 170, z: 0}, vel: {x: 0, y: 0, z: 0}},
  4: {type: "trig", label: 0, ports: [{target: 3, slot: 1}, {target: 5, slot: 2}, {target: 2, slot: 2}], pos: {x: 190, y: 240, z: 0}, vel: {x: 0, y: 0, z: 0}},
  5: {type: "trig", label: 0, ports: [{target: 3, slot: 2}, {target: 2, slot: 1}, {target: 4, slot: 1}], pos: {x: 270, y: 240, z: 0}, vel: {x: 0, y: 0, z: 0}}
};

// Render
  function render(world, canvas) {
    const ctx = canvas.getContext('2d');
    const drawnLines = new Set();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Offset the context using the camera's position
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    for (const [id, obj] of Object.entries(world)) {
      const {x, y} = obj.pos;
      const size = 20;

      if (obj.type === 'init') {
        ctx.beginPath();
        ctx.arc(x, y, size / 3, 0, 2 * Math.PI);
        ctx.stroke();
        continue;
      }

      // Draw lines between trigs based on their ports
      if (obj.type === 'trig') {
        for (const [portIndex, port] of obj.ports.entries()) {
          const target = world[port.target];
          const a = `${id}-${portIndex}`;
          const b = `${port.target}-${port.slot}`;
          const lineKey = id <= port.target ? `${a}-${b}` : `${b}-${a}`;

          if (drawnLines.has(lineKey)) {
            continue;
          }

          ctx.beginPath();
          ctx.moveTo(obj.pos.x, obj.pos.y);
          ctx.lineTo(target.pos.x, target.pos.y);
          ctx.stroke();

          drawnLines.add(lineKey);
        }
      }

      // Draw a circle for 'trig' type
      if (obj.type === 'trig') {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.stroke();
      }

      // Draw the label
      ctx.font = '16px Arial';
      ctx.fillStyle = 'black'; // Choose the text color, e.g., black
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.label, x, y);
    }
    ctx.restore();
  }

  // Camera
    const camera = {
      x: -500,
      y: -500,
      dragging: false,
      lastMouseX: null,
      lastMouseY: null
    };

    // Event listeners for mouse interactions
    canvas.addEventListener('mousedown', (e) => {
      camera.dragging = true;
      camera.lastMouseX = e.clientX;
      camera.lastMouseY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (camera.dragging) {
        const deltaX = e.clientX - camera.lastMouseX;
        const deltaY = e.clientY - camera.lastMouseY;

        camera.x -= deltaX;
        camera.y -= deltaY;

        camera.lastMouseX = e.clientX;
        camera.lastMouseY = e.clientY;
      }
    });

    canvas.addEventListener('mouseup', () => {
      camera.dragging = false;
    });

    canvas.addEventListener('mouseleave', () => {
      camera.dragging = false;
    });


// Physics
  function tick(world) {
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

      for (const port of obj1.ports) {
        const obj2 = world[port.target];
        const distance = distanceBetweenPoints(obj1.pos, obj2.pos);
        const attractionForce = attraction * Math.pow(distance, attractionPow) / 500000;

        const direction = {
          x: (obj2.pos.x - obj1.pos.x) / distance,
          y: (obj2.pos.y - obj1.pos.y) / distance,
          z: (obj2.pos.z - obj1.pos.z) / distance,
        };

        obj1.vel.x += attractionForce * direction.x;
        obj1.vel.y += attractionForce * direction.y;
        obj1.vel.z += attractionForce * direction.z;
      }
  
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

// Sliders
  // Get the sliders and value elements
  const repulsionSlider  = document.getElementById('repulsion');
  const attractionSlider = document.getElementById('attraction');
  const coolingSlider    = document.getElementById('cooling');
  const repulsionValue   = document.getElementById('repulsion-value');
  const attractionValue  = document.getElementById('attraction-value');
  const coolingValue     = document.getElementById('cooling-value');

  // Define variables to hold the slider values
  let repulsion  = parseFloat(repulsionSlider.value);
  let attraction = parseFloat(attractionSlider.value);
  let cooling    = parseFloat(coolingSlider.value);

  // Function to update the slider value display
  function updateSliderValueDisplay(slider, displayElement) {
    displayElement.textContent = slider.value;
  }

  // Update initial slider value display
  updateSliderValueDisplay(repulsionSlider, repulsionValue);
  updateSliderValueDisplay(attractionSlider, attractionValue);
  updateSliderValueDisplay(coolingSlider, attractionValue);

  // Add event listeners to update the values and display when sliders are changed
  repulsionSlider.addEventListener('input', (e) => {
    repulsion = parseFloat(e.target.value);
    updateSliderValueDisplay(e.target, repulsionValue);
  });

  attractionSlider.addEventListener('input', (e) => {
    attraction = parseFloat(e.target.value);
    updateSliderValueDisplay(e.target, attractionValue);
  });

  coolingSlider.addEventListener('input', (e) => {
    cooling = parseFloat(e.target.value);
    updateSliderValueDisplay(e.target, coolingValue);
  });

setInterval(() => {
  tick(world);
  render(world, canvas, camera); // Pass the camera object to the render function
}, tickInterval);


