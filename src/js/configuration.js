export var shortcuts = {
  toggleTimer1: "KeyQ",
  toggleTimer2: "KeyW",
  shiftToggle: "KeyA",
  nextItem: "Period",
  prevItem: "Comma",
  fastFwd: "Slash",
  rewind: "KeyM",
  reset: "KeyR",
  secureKey: "AltLeft",
};

export var stanceStyles = {
  正方: "stance1-style",
  反方: "stance2-style",
  无: "no-stance-style",
};

export const selectors = {
  toggleTimer1: "#timer-one-toggle-key",
  toggleTimer2: "#timer-two-toggle-key",
  nextItem: "#next-key",
  prevItem: "#previous-key",
  shiftToggle: "#shift-key",
  reset: "#reset-key",
  rewind: "#rewind-key",
  fastFwd: "#fast-fwd-key",
  autoShift: "#auto-shift",
  settingsButton: "#settingsButton",
  settingsModal: "#settingsModal",
  closeButton: ".close-button",
  data: "#data",
  background: "#background",
};

export const elements = {
  timerOneTitle: document.getElementById("title1"),
  timerTwoTitle: document.getElementById("title2"),
  minutes1: document.getElementById("minutes1"),
  seconds1: document.getElementById("seconds1"),
  minutes2: document.getElementById("minutes2"),
  seconds2: document.getElementById("seconds2"),
};
