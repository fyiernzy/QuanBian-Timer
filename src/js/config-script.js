import { shortcuts, selectors } from "./configuration.js";
import { TIMER_MANAGER } from "./components.js";

var data = null;
var background = null;

// Short-hand for getting elements
const getElement = (selector) => document.querySelector(selector);

// Toggle modal display
const toggleModal = (display) => {
  getElement(selectors.settingsModal).style.display = display
    ? "block"
    : "none";
};

// Event listeners for modal
getElement(selectors.settingsButton).addEventListener("click", () =>
  toggleModal(true)
);
getElement(selectors.closeButton).addEventListener("click", () =>
  toggleModal(false)
);

document.addEventListener("DOMContentLoaded", (event) => {
  const saveButton = document.querySelector(".save-button");
  saveButton.addEventListener("click", saveSettings);
});

// Save settings to localStorage
const saveSettings = () => {
  Object.entries(selectors).forEach(([key, selector]) => {
    if (
      key !== "settingsButton" &&
      key !== "settingsModal" &&
      key !== "closeButton"
    ) {
      const element = getElement(selector);
      if (key === "data") {
        localStorage.setItem(key, data);
      } else {
        localStorage.setItem(key, element.value);
      }
    }
  });
  toggleModal(false); // Hide modal after save
};

// Load settings from localStorage with default values
const loadSettings = () => {
  Object.keys(shortcuts).forEach((key) => {
    const value = localStorage.getItem(key) || shortcuts[key];
    const element = getElement(selectors[key]);
    if (element) {
      element.value = value;
    } else {
      console.log(key);
    }
  });
};

// Initialize settings on window load
window.addEventListener("load", loadSettings);

const shortcutKeys = {
  "timer-one-toggle-key": "toggleTimer1",
  "timer-two-toggle-key": "toggleTimer2",
  "next-key": "nextItem",
  "previous-key": "prevItem",
  "shift-key": "shiftToggle",
  "reset-key": "reset",
  "rewind-key": "rewind",
  "fast-fwd-key": "fastFwd",
};

// Configure inputs to capture key codes
document.querySelectorAll(".config-input-type").forEach((input) => {
  input.addEventListener("keydown", (event) => {
    event.preventDefault();
    input.value = event.code;

    const key = shortcutKeys[input.id];

    if (key) {
      shortcuts[key] = event.code;
      localStorage.setItem(key, shortcuts[key]);
    }
  });
});

document
  .getElementById("data")
  .addEventListener("change", async function (event) {
    const file = event.target.files[0];
    if (file) {
      const text = JSON.parse(await file.text()); // Check the actual text content
      data = text;
    }
  });

document.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    getElement(selectors.settingsModal).style.display === "block"
      ? toggleModal(false)
      : toggleModal(true);
  }
});

document.getElementById("auto-shift").addEventListener("change", (event) => {
  TIMER_MANAGER.setAutoToggle(event.target.checked);
  localStorage.setItem("autoShift", event.target.checked);
});
