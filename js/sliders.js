import { physicsParams, reductionStart } from './params.js';

export let reduction = reductionStart;

// Sliders
const repulsionSlider  = document.getElementById('repulsion');
const attractionSlider = document.getElementById('attraction');
const coolingSlider    = document.getElementById('cooling');
const repulsionValue   = document.getElementById('repulsion-value');
const attractionValue  = document.getElementById('attraction-value');
const coolingValue     = document.getElementById('cooling-value');

export let repulsion  = physicsParams.repulsion;
export let attraction = physicsParams.attraction;
export let cooling    = physicsParams.cooling;

function updateSliderValueDisplay(slider, displayElement) {
  displayElement.textContent = slider.value;
}

updateSliderValueDisplay(repulsionSlider, repulsionValue);
updateSliderValueDisplay(attractionSlider, attractionValue);
updateSliderValueDisplay(coolingSlider, coolingValue);

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

// Button implementation
const reductionButtons = document.querySelectorAll(".reduction-button");

function handleReductionButtonClick(event) {
  const targetButton = event.target;

  // Deselect all buttons
  reductionButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Select the clicked button
  targetButton.classList.add("active");

  // Get the value from the data-value attribute
  reduction = targetButton.getAttribute("data-value");
  console.log("Selected reduction:", reduction);
}

// Add event listeners to the buttons
reductionButtons.forEach((button) => {
  button.addEventListener("click", handleReductionButtonClick);
});


export function updateReductionSelect(value) {
  // Find the button with the matching data-value attribute
  const targetButton = Array.from(reductionButtons).find(
    (button) => button.getAttribute("data-value") === value
  );

  // If a matching button is found, simulate a click event on it
  if (targetButton) {
    targetButton.click();
  }
}