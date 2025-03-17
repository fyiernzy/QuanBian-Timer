import * as React from "react";

interface BaseNumberInputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BaseNumberInput({label, name, value, onChange}: BaseNumberInputProps) {
    return (<div className="mb-4">
        <label className="block mb-2">{label}</label>
        <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            className="input w-full"
        />
    </div>);
}
