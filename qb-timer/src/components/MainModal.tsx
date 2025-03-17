import {SessionData} from "../interfaces/SessionData.ts";
import {useCallback, useState} from "react";
import {useKeyboardShortcut} from "../hooks/useKeyboardShortcut.tsx";
import Session from "./Session.tsx";
import {useKeyContext} from "../contexts/KeyContext.tsx";

interface MainModalProps {
    sessions: SessionData[];
}

export default function MainModal({sessions}: MainModalProps) {
    const [sessionIndex, setSessionIndex] = useState(0);
    const [timersRunning, setTimersRunning] = useState(false);

    const handleNextSession = useCallback(() => {
        if (timersRunning) return;
        const isLastSession = sessionIndex === sessions.length - 1;
        if (!isLastSession) {
            setSessionIndex((prev) => prev + 1);
        }
    }, [sessionIndex, sessions.length, timersRunning]);

    const handlePreviousSession = useCallback(() => {
        if (timersRunning) return;
        const isFirstSession = sessionIndex === 0;
        if (!isFirstSession) {
            setSessionIndex((prev) => prev - 1);
        }
    }, [sessionIndex, sessions.length, timersRunning]);

    const {keys} = useKeyContext();

    useKeyboardShortcut(keys.next, handleNextSession);
    useKeyboardShortcut(keys.previous, handlePreviousSession);

    return (
        <div>
            <Session
                key={sessionIndex}
                sessionData={sessions[sessionIndex]}
                onStatusChange={setTimersRunning}/>
        </div>
    )
}