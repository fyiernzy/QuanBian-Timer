import { useEffect, useState } from "react";
import { useQbTimers } from "../hooks/useQbTimers.tsx";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut.tsx";
import { useKeyContext } from "../contexts/KeyContext.js";
import Timer from "./Timer.tsx";
import PauseModal from "./PauseModal.tsx";
import { SessionData } from "../interfaces/SessionData.ts";
import { isDuoSession, isSingleSession } from "../utils/SessionUtils.ts";

interface SessionProps {
    sessionData: SessionData;
    onStatusChange?: (isRunning: boolean) => void;
}

export default function Session({ sessionData, onStatusChange }: SessionProps) {
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
    } = useQbTimers(sessionData.duration);

    const { keys } = useKeyContext();

    useKeyboardShortcut(keys.timer1, toggleTimer1);
    useKeyboardShortcut(keys.timer2, toggleTimer2);
    useKeyboardShortcut(keys.restart, restartTimers);
    useKeyboardShortcut(keys.pause, () => {
        pauseTimers();
        setIsPaused((prev) => !prev);
    });

    // Always call useKeyboardShortcut and check condition inside callback.
    useKeyboardShortcut(keys.switch, () => {
        if (isDuoSession(sessionData)) {
            if (!isTimer1Running && isTimer2Running) {
                toggleTimer1();
            } else if (isTimer1Running && !isTimer2Running) {
                toggleTimer2();
            }
        }
    });

    useEffect(() => {
        if (onStatusChange) {
            const isRunning = isTimer1Running || isTimer2Running;
            onStatusChange(isRunning);
        }
    }, [isTimer1Running, isTimer2Running, onStatusChange]);

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <Timer
                key="Primary"
                minutes={timer1Min}
                seconds={timer1Sec}
                label={sessionData?.label1 || ""}
                isActive={
                    (isSingleSession(sessionData) && isTimer1Running) ||
                    (isDuoSession(sessionData) && isTimer1Running && !isTimer2Running)
                }
                idleStyle="text-slate-400"
                activeStyle="text-blue-500"
            />

            {isDuoSession(sessionData) && (
                <Timer
                    key="Secondary"
                    minutes={timer2Min}
                    seconds={timer2Sec}
                    label={sessionData?.label2 || ""}
                    isActive={!isTimer1Running && isTimer2Running}
                    idleStyle="text-slate-400"
                    activeStyle="text-red-500"
                />
            )}
            {isPaused && <PauseModal onClose={pauseTimers} />}
        </div>
    );
}
