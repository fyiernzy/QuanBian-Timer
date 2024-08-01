import { useCallback } from "react";
import { useTimer } from "react-timer-hook";

const useTimerState = (expiryTimestamp) => {
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

  const toggleRunning = useCallback(() => {
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
    toggleRunning,
    pause,
    restart,
  };
};

export default useTimerState;
