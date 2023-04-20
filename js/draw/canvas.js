export const canvas = document.getElementById('interactionCanvas');

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
    const circle_radius  = 50;
    const trig_height = 20;

    if (obj.type === 'eras') {
      ctx.beginPath();
      ctx.arc(x, y, circle_radius / 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red'; 
      ctx.fillStyle = 'white';
      ctx.stroke();
      continue;
    }
    
    if (obj.type === 'init') {
      ctx.beginPath();
      ctx.arc(x, y, circle_radius / 3, 0, 2 * Math.PI);
      ctx.strokeStyle = 'blue'; 
      ctx.stroke();
      continue;
    }
    

    

    if (obj.type === 'trig') {
      const trianglePorts = getTrianglePorts(obj.pos.x, obj.pos.y, trig_height, obj.rotation);

      
      for (const [portIndex, port] of obj.ports.entries()) {
        const target = world[port.target];
        if (!obj || !target) return;

        const targetTrianglePorts = getTrianglePorts(target.pos.x, target.pos.y, trig_height, target.rotation);

         // Create a unique identifier for the current line
         const a = id > port.target ? `${id}-${portIndex}`          : `${port.target}-${port.slot}`;
         const b = id > port.target ? `${port.target}-${port.slot}` : `${id}-${portIndex}`;
         const lineKey = `${a}-${b}`;

         // If the line has already been drawn, skip the current iteration
         if (drawnLines.has(lineKey)) {
           continue;
         }

        let startPoint, endPoint;
        if (portIndex === 0) {
          startPoint = trianglePorts[0];
        } else if (portIndex === 1) {
          startPoint = trianglePorts[1];
        } else {
          startPoint = trianglePorts[2];
        }

        if (target.type === 'trig') {
          if (obj.ports[portIndex].slot === 0) {
            endPoint = targetTrianglePorts[0];
          } else if (obj.ports[portIndex].slot === 1) {
            endPoint = targetTrianglePorts[1];
          } else {
            endPoint = targetTrianglePorts[2];
          }
        } else {
          endPoint = {x: target.pos.x, y: target.pos.y}
        }

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(endPoint.x, endPoint.y);
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
      const trianglePoints = getRotatedTrianglePoints(x, y, trig_height, obj.rotation);
      const pointX = x + trig_height * Math.cos(obj.rotation);
      const pointY = y + trig_height * Math.sin(obj.rotation);
      ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
      ctx.lineTo(trianglePoints[1].x, trianglePoints[1].y);
      ctx.lineTo(trianglePoints[2].x, trianglePoints[2].y);
      ctx.closePath();
      ctx.strokeStyle = 'black';
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red'; 
      ctx.fillStyle = 'white';
      ctx.stroke();
    }

    // Draw the label
    if (obj.label != 0) {
      
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.strokeStyle = 'black'; 
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.stroke();
      
      ctx.font = '15px Arial';
      ctx.fillStyle = 'black'; 
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obj.label, x, y);
      continue;
    }
  }
  ctx.restore();
}

// Camera
  export const camera = {
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

  function getTrianglePoints(x, y, height) {
    const base = 2 * height;
    return [
      { x: x, y: y + height },
      { x: x - base / 2, y: y },
      { x: x + base / 2, y: y },
    ];
  }

  function getTrianglePorts(x, y, height, rotation) {
    const trianglePoints = getRotatedTrianglePoints(x, y, height, rotation);
    return [
      trianglePoints[0],
      { x: (trianglePoints[2].x * 4 + trianglePoints[1].x) / 5, y: (trianglePoints[2].y * 4 + trianglePoints[1].y) / 5 },
      { x: (trianglePoints[1].x * 4 + trianglePoints[2].x) / 5, y: (trianglePoints[1].y * 4 + trianglePoints[2].y) / 5 }
    ];
  }

  function getRotatedTrianglePoints(x, y, height, rotation) {
    const offset_rotation = rotation - (Math.PI / 2)
    const unrotatedPoints = getTrianglePoints(x, y, height);
    const rotatedPoints = unrotatedPoints.map(point => {
      const dx = point.x - x;
      const dy = point.y - y;
      const newDx = dx * Math.cos(offset_rotation) - dy * Math.sin(offset_rotation);
      const newDy = dx * Math.sin(offset_rotation) + dy * Math.cos(offset_rotation);
      return { x: x + newDx, y: y + newDy };
    });
    return rotatedPoints;
  }

