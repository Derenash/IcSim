import { physicsParams } from './params.js'

// Sliders
  // Get the sliders and value elements
  const repulsionSlider  = document.getElementById('repulsion');
  const attractionSlider = document.getElementById('attraction');
  const coolingSlider    = document.getElementById('cooling');
  const repulsionValue   = document.getElementById('repulsion-value');
  const attractionValue  = document.getElementById('attraction-value');
  const coolingValue     = document.getElementById('cooling-value');

  // Define variables to hold the slider values
  export let repulsion  = physicsParams.repulsion;
  export let attraction = physicsParams.attraction;
  export let cooling    = physicsParams.cooling; 

  // Function to update the slider value display
  function updateSliderValueDisplay(slider, displayElement) {
    displayElement.textContent = slider.value;
  }

  // Update initial slider value display
  updateSliderValueDisplay(repulsionSlider, repulsionValue);
  updateSliderValueDisplay(attractionSlider, attractionValue);
  updateSliderValueDisplay(coolingSlider, coolingValue);

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
