import { useCallback } from "react";
import {useQbTimer} from "./useQbTimer";

interface QbTimers {
  timer1Min: number;
  timer1Sec: number;
  timer2Min: number;
  timer2Sec: number;
  isTimer1Running: boolean;
  isTimer2Running: boolean;
  toggleTimer1: () => void;
  toggleTimer2: () => void;
  restartTimers: () => void;
  pauseTimers: () => void;
  switchTimers: () => void;
}

export const useQbTimers = (sessionDurationInSec: number): QbTimers => {
  // Use useCallback to memoize the function, so that it doesn't get recreated on every render
  const getDuration = useCallback((sessionDurationInSec: number) => {
    return new Date(Date.now() + sessionDurationInSec * 1000);
  }, []);
  const duration = getDuration(sessionDurationInSec);

  const timer1 = useQbTimer(duration);
  const timer2 = useQbTimer(duration);

  const toggleTimer1 = useCallback(() => {
    if (!timer1.isRunning) {
      timer2.pause();
    }
    timer1.toggle();
  }, [timer1, timer2]);

  const toggleTimer2 = useCallback(() => {
    if (!timer2.isRunning) {
      timer1.pause();
    }
    timer2.toggle();
  }, [timer1, timer2]);

  const pauseTimers = useCallback(() => {
    timer1.pause();
    timer2.pause();
  }, [timer1, timer2]);

  const restartTimers = useCallback(() => {
    timer1.restart();
    timer2.restart();
  }, [timer1, timer2]);

  const switchTimers = useCallback(() => {
    timer1.toggle();
    timer2.toggle();
  }, [timer1, timer2]);

  return {
    timer1Min: timer1.minutes,
    timer1Sec: timer1.seconds,
    timer2Min: timer2.minutes,
    timer2Sec: timer2.seconds,
    isTimer1Running: timer1.isRunning,
    isTimer2Running: timer2.isRunning,
    toggleTimer1: toggleTimer1,
    toggleTimer2: toggleTimer2,
    restartTimers,
    pauseTimers,
    switchTimers
  };
};
