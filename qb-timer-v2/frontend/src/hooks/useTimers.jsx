import { useCallback } from "react";
import useTimerState from "./states/useTimerState";
import useExpiryTimestamp from "./utils/useExpiryTimestamp";

export const useTimers = (expiryTimestamp) => {
  const { getExpiryTimestamp } = useExpiryTimestamp();
  const duration = getExpiryTimestamp(expiryTimestamp);
  const primaryTimer = useTimerState(duration);
  const secondaryTimer = useTimerState(duration);

  const togglePrimaryTimer = useCallback(() => {
    if (!primaryTimer.isRunning) {
      secondaryTimer.pause();
    }
    primaryTimer.toggleRunning();
  }, [primaryTimer, secondaryTimer]);

  const toggleSecondaryTimer = useCallback(() => {
    if (!secondaryTimer.isRunning) {
      primaryTimer.pause();
    }
    secondaryTimer.toggleRunning();
  }, [primaryTimer, secondaryTimer]);

  const pauseTimers = useCallback(() => {
    primaryTimer.pause();
    secondaryTimer.pause();
  }, [primaryTimer, secondaryTimer]);

  const restartTimers = useCallback(() => {
    primaryTimer.restart();
    secondaryTimer.restart();
  }, [primaryTimer, secondaryTimer]);

  return {
    primaryMinutes: primaryTimer.minutes,
    primarySeconds: primaryTimer.seconds,
    secondaryMinutes: secondaryTimer.minutes,
    secondarySeconds: secondaryTimer.seconds,
    isPrimaryRunning: primaryTimer.isRunning,
    isSecondaryRunning: secondaryTimer.isRunning,
    togglePrimaryTimer,
    toggleSecondaryTimer,
    restartTimers,
    pauseTimers,
  };
};
