import Timer from "./Timer";
import PauseModal from "./modals/PauseModal";
import PropTypes from "prop-types";
import { useState } from "react";
import { useTimers } from "../hooks/useTimers";
import useKeyboardShortcut from "../hooks/utils/useKeyboardShortcut";

function Screen({ config, session }) {
  const [isPaused, setIsPaused] = useState(false);
  const {
    primaryMinutes,
    primarySeconds,
    secondaryMinutes,
    secondarySeconds,
    isPrimaryRunning,
    isSecondaryRunning,
    togglePrimaryTimer,
    toggleSecondaryTimer,
    restartTimers,
    pauseTimers,
  } = useTimers(session.duration);

  useKeyboardShortcut(config.primaryTimerToggle, togglePrimaryTimer);
  useKeyboardShortcut(config.secondaryTimerToggle, toggleSecondaryTimer);
  useKeyboardShortcut(config.restart, restartTimers);
  useKeyboardShortcut(config.pause, () => {
    pauseTimers();
    setIsPaused((prev) => !prev);
  });

  return (
    <div className="w-screen h-screen flex justify-center">
      <Timer
        key="Primary"
        minutes={primaryMinutes}
        seconds={primarySeconds}
        label={session.label1}
        isActive={
          session.isDualTimer && isPrimaryRunning && !isSecondaryRunning
        }
        idleStyle="text-slate-400"
        activeStyle={"text-blue-500"}
      />
      {session.isDualTimer && (
        <Timer
          key="Secondary"
          minutes={secondaryMinutes}
          seconds={secondarySeconds}
          label={session.label2}
          isActive={
            session.isDualTimer && !isPrimaryRunning && isSecondaryRunning
          }
          idleStyle="text-slate-400"
          activeStyle={"text-red-500"}
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
