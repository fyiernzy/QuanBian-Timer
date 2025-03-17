import { useCallback } from "react";
import { useTimer } from "react-timer-hook";

interface QbTimer {
  isRunning: boolean;
  seconds: number;
  minutes: number;
  toggle: () => void;
  pause: () => void;
  restart: () => void;
}

export const useQbTimer = (expiryTimestamp: Date): QbTimer => {
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    resume,
    restart: restartTimer,
  } = useTimer({
    expiryTimestamp,
    autoStart: false,
  });

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
      resume();
    }
  }, [isRunning, pause, start, resume]);

  const restart = useCallback(() => {
    restartTimer(expiryTimestamp, false);
  }, [expiryTimestamp, restartTimer]);

  return {
    isRunning,
    seconds,
    minutes,
    toggle,
    pause,
    restart,
  };
};
