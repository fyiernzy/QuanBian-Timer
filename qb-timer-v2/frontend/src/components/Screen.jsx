import Timer from "./Timer";
import PauseModal from "./modals/PauseModal";
import PropTypes from "prop-types";
import { useState } from "react";
import { useQbTimers } from "../hooks/useQbTimers.tsx";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut.tsx";
import { useKeyContext } from "../contexts/KeyContext";

function Screen({ session }) {
  const [isPaused, setIsPaused] = useState(false);
  const {
    timer1Min,
    timer1Sec,
    timer2Min,
    timer2Sec,
    isTimer1Running,
    isTimer2Running,
    toggleTimer1,
    toggleTimer2,
    restartTimers,
    pauseTimers,
  } = useQbTimers(session.duration);

  const { keys } = useKeyContext();

  useKeyboardShortcut(keys.timer1, toggleTimer1);
  useKeyboardShortcut(keys.timer2, toggleTimer2);
  useKeyboardShortcut(keys.restart, restartTimers);
  useKeyboardShortcut(keys.pause, () => {
    pauseTimers();
    setIsPaused((prev) => !prev);
  });

  return (
    <div className="w-screen h-screen flex justify-center">
      <Timer
        key="Primary"
        minutes={timer1Min}
        seconds={timer1Sec}
        label={session.label1}
        isActive={
          session.isDualTimer && isTimer1Running && !isTimer2Running
        }
        idleStyle="text-slate-400"
        activeStyle="text-blue-500"
      />
      {session.isDualTimer && (
        <Timer
          key="Secondary"
          minutes={timer2Min}
          seconds={timer2Sec}
          label={session.label2}
          isActive={
            session.isDualTimer && !isTimer1Running && isTimer2Running
          }
          idleStyle="text-slate-400"
          activeStyle="text-red-500"
        />
      )}
      {isPaused && <PauseModal isOpen={isPaused} onClose={pauseTimers} />}
    </div>
  );
}

Screen.propTypes = {
  config: PropTypes.shape({
    primaryTimerToggle: PropTypes.string.isRequired,
    secondaryTimerToggle: PropTypes.string.isRequired,
    restart: PropTypes.string.isRequired,
    pause: PropTypes.string.isRequired,
  }).isRequired,
  session: PropTypes.shape({
    isDualTimer: PropTypes.bool.isRequired,
    duration: PropTypes.number.isRequired,
    label1: PropTypes.string.isRequired,
    label2: PropTypes.string.isRequired,
  }).isRequired,
};

export default Screen;
