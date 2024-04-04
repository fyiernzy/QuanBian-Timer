import { shortcuts } from "./configuration.js";
import { TIMER_1, TIMER_2, TIMER_MANAGER } from "./components.js";

const setupFileInputListener = () => {
  document.getElementById("data").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      TIMER_MANAGER.setData(JSON.parse(await file.text()));
      TIMER_MANAGER.loadCurrentIndexData();
    }
  });
};

const setupShortcut = () => {
  const keysPressed = {};

  document.addEventListener("keydown", (event) => {
    if (event.target !== document.body) return;

    keysPressed[event.code] = true;

    if (keysPressed["AltLeft"] && keysPressed["KeyR"])
      [TIMER_1, TIMER_2].forEach((timer) => timer.reset());

    const executeAction = {
      [shortcuts["toggleTimer1"]]: () =>
        TIMER_MANAGER.toggleFirstTimer(TIMER_1, TIMER_2),
      [shortcuts["toggleTimer2"]]: () =>
        TIMER_MANAGER.toggleSecondTimer(TIMER_2, TIMER_1),
      [shortcuts["nextItem"]]: () => TIMER_MANAGER.moveIndex(1),
      [shortcuts["prevItem"]]: () => TIMER_MANAGER.moveIndex(-1),
      [shortcuts["fastFwd"]]: () => TIMER_MANAGER.moveIndex(3),
      [shortcuts["rewind"]]: () => TIMER_MANAGER.moveIndex(-3),
      [shortcuts["shiftToggle"]]: () =>
        TIMER_MANAGER.toggleBothTimersConditionally(),
    }[event.code];

    console.log(executeAction);

    if (executeAction) {
      event.preventDefault();
      executeAction();
    }

    document.addEventListener("keyup", (event) => {
      delete keysPressed[event.code];
    });
  });
};

function setupBackgroundListener() {
  document.getElementById("background").addEventListener("change", (event) => {
    if (event.target.files.length > 0) {
      console.log(event.target.files[0]);
      const fileURL = URL.createObjectURL(event.target.files[0]);
      // document.body.style.backgroundImage = `url('${fileURL}')`;
      // localStorage.setItem("background", fileURL);
      // console.log("hello");
      // console.log(fileURL);
    }
  });
}

const setupSpecialKey = () => {
  document.addEventListener("keydown", (event) => {
    if (event.code === "Digit1") {
      TIMER_MANAGER.toggleCoachingOneMinute();
    } else if (event.code === "Digit2") {
      TIMER_MANAGER.toggleCoachingTwoMinutes();
    }
  });
};

const initialSetup = () => {
  const keys = [
    "toggleTIMER_1",
    "toggleTIMER_2",
    "nextItem",
    "prevItem",
    "shiftToggle",
    "background",
  ];

  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) {
      if (key === "background") {
        document.body.style.background = value;
      } else shortcuts[key] = value;
    }
  });

  const data = localStorage.getItem("data");
  if (data) {
    TIMER_MANAGER.loadCurrentIndexData();
  }
};

initialSetup();
setupFileInputListener();
setupShortcut();
setupBackgroundListener();
setupSpecialKey();
