import { param } from './params.js';

// Sliders
const repulsionSlider  = document.getElementById('repulsion');
const attractionSlider = document.getElementById('attraction');
const frictionSlider   = document.getElementById('friction');
const repulsionValue   = document.getElementById('repulsion-value');
const attractionValue  = document.getElementById('attraction-value');
const frictionValue    = document.getElementById('friction-value');

function updateSliderValueDisplay(slider, displayElement) {
  displayElement.textContent = slider.value;
}

updateSliderValueDisplay(repulsionSlider, repulsionValue);
updateSliderValueDisplay(attractionSlider, attractionValue);
updateSliderValueDisplay(frictionSlider, frictionValue);

repulsionSlider.addEventListener('input', (e) => {
  param.repStr = parseFloat(e.target.value);
  updateSliderValueDisplay(e.target, repulsionValue);
});

attractionSlider.addEventListener('input', (e) => {
  param.attStr = parseFloat(e.target.value);
  updateSliderValueDisplay(e.target, attractionValue);
});

frictionSlider.addEventListener('input', (e) => {
  param.friction = parseFloat(e.target.value);
  updateSliderValueDisplay(e.target, frictionValue);
});

// Button implementation
const reductionButtons = document.querySelectorAll(".reduction-button");

function handleReductionButtonClick(event) {
  const targetButton = event.target;

  // Deselect all buttons
  reductionButtons.forEach((button) => {
    button.classList.remove('active');
  });

  // Select the clicked button
  targetButton.classList.add('active');

  // Get the value from the data-value attribute
  param.reductions = targetButton.getAttribute('data-value');
  console.log('Selected reduction:', param.reductions);
}

// Add event listeners to the buttons
reductionButtons.forEach((button) => {
  button.addEventListener('click', handleReductionButtonClick);
});

// Define a setter for param.reductions
Object.defineProperty(param, 'reductions', {
  set(value) {
    this._reductions = value;
    console.log('param.reductions changed:', value);
    updateReductionSelect(value);
  },
  get() {
    return this._reductions;
  },
});

export function updateReductionSelect(value) {
  // Find the button with the matching data-value attribute
  const targetButton = Array.from(reductionButtons).find(
    (button) => button.getAttribute('data-value') === value
  );

  // If a matching button is found, simulate a click event on it
  if (targetButton) {
    targetButton.click();
  }
}