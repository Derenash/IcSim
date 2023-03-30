const canvas = document.getElementById('interactionCanvas');
export { canvas };
export { camera };

// Render
export function render(world, canvas) {
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

    if (obj.type === 'eras') {
      ctx.beginPath();
      ctx.arc(x, y, size / 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red'; 
      ctx.fillStyle = 'white';
      ctx.stroke();
      continue;
    }
    
    if (obj.type === 'init') {
      ctx.beginPath();
      ctx.arc(x, y, size / 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'blue'; 
      ctx.stroke();
      continue;
    }
    

    
    // Draw lines between trigs based on their ports
    if (obj.type === 'trig') {
      for (const [portIndex, port] of obj.ports.entries()) {
        const target = world[port.target];
        if (!obj || !target) return;
        const a = `${id}-${portIndex}`;
        const b = `${port.target}-${port.slot}`;
        const lineKey = id <= port.target ? `${a}-${b}` : `${b}-${a}`;

        if (drawnLines.has(lineKey)) {
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(obj.pos.x, obj.pos.y);
        ctx.lineTo(target.pos.x, target.pos.y);
        ctx.strokeStyle = 'black';
        ctx.stroke();

        drawnLines.add(lineKey);
      }
    }

    // Draw rectangle and text for 'val' type
    if (obj.type === 'val') {
      const padding = 5;
      const { name } = obj;
      ctx.font = '16px Arial';
      const textWidth = ctx.measureText(name).width;

      // Draw rectangle
      ctx.beginPath();
      ctx.rect(x - textWidth / 2 - padding, y - 8 - padding, textWidth + 2 * padding, 16 + 2 * padding);
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();

      // Draw name
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(name, x, y);
      continue;
    }

    if (obj.type === 'trig') {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.strokeStyle = 'black'; 
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
    }

    // Draw the label
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black'; 
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
