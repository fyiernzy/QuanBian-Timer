import TimeInput from "./TimeInput.tsx";
import * as React from "react";

interface DurationPickerProps {
    duration: {
        minutes: number;
        seconds: number;
    };
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DurationPicker({duration, handleInputChange}: DurationPickerProps) {
    return (
        <div className="flex">
            <TimeInput
                label="分钟"
                name="分钟"
                value={String(duration.minutes).padStart(2, "0")}
                onChange={handleInputChange}
            />
            <div>
                <p className="px-2 py-4 text-3xl font-bold"> :</p>
                <p className="mt-1 my-2"></p>
            </div>
            <TimeInput
                label="秒"
                name="秒"
                value={String(duration.seconds).padStart(2, "0")}
                onChange={handleInputChange}
            />
        </div>
    );
};
