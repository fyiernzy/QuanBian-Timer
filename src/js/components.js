import { Timer } from "./timer.js";
import { TimerManager } from "./time-manager.js";
import { elements } from "./configuration.js";

export const TIMER_1 = new Timer(
  elements.timerOneTitle,
  elements.minutes1,
  elements.seconds1
);

export const TIMER_2 = new Timer(
  elements.timerTwoTitle,
  elements.minutes2,
  elements.seconds2
);

export const TIMER_MANAGER = new TimerManager(
  localStorage.getItem("data"),
  TIMER_1,
  TIMER_2
);
