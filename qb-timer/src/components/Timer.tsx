// Timer.tsx
import React from "react";

interface TimerProps {
    minutes: number;
    seconds: number;
    label: string;
    isActive: boolean;
    idleStyle?: React.CSSProperties;
    activeStyle?: React.CSSProperties;
}

export default function Timer({
                                  minutes,
                                  seconds,
                                  label,
                                  isActive,
                                  idleStyle = {},
                                  activeStyle = {},
                              }: TimerProps) {
    const style = isActive ? activeStyle : idleStyle;
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 style={{ fontSize: "1.3rem", fontWeight: "bold", ...style }}>{label}</h1>
            <h2 style={{ fontSize: "8rem", fontWeight: "bold", ...style }}>
                {minutes}:{String(seconds).padStart(2, "0")}
            </h2>
        </div>
    );
}
