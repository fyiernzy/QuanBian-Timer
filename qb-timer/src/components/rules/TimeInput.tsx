import * as React from "react";

interface TimeInputProps {
    label: string;
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TimeInput({label, name, value, onChange}: TimeInputProps) {
    return (
        <div className="flex flex-col justify-center">
            <input
                type="number"
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-2 py-4 border border-slate-400 rounded text-3xl text-center overflow-hidden"
            />
            <label className="block mt-1 my-2">{label}</label>
        </div>
    );
};

