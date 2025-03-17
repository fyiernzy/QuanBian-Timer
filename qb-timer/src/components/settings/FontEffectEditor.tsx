// FontEffectEditor.tsx
import React from "react";
import { Box, TextField, FormControlLabel, Checkbox, Typography } from "@mui/material";
import { FontEffectConfig } from "../../interfaces/types";

interface FontEffectEditorProps {
    label: string; // e.g. "Active Configuration" or "Idle Configuration"
    effect: FontEffectConfig;
    onChange: (field: keyof FontEffectConfig, value: any) => void;
}

// Helper function to convert an RGB string to HEX.
const normalizeColor = (color: string): string => {
    if (color.startsWith("rgb(")) {
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
        if (!result) return color;
        const r = parseInt(result[1]).toString(16).padStart(2, "0");
        const g = parseInt(result[2]).toString(16).padStart(2, "0");
        const b = parseInt(result[3]).toString(16).padStart(2, "0");
        return `#${r}${g}${b}`;
    }
    return color;
};

const FontEffectEditor: React.FC<FontEffectEditorProps> = ({ label, effect, onChange }) => {
    return (
        <Box mt={2}>
            <Typography variant="subtitle1">{label}</Typography>
            <Box display="flex" flexDirection="column" gap={1}>
                <TextField
                    label="Font Size"
                    type="number"
                    value={effect.fontSize}
                    onChange={(e) => onChange("fontSize", Number(e.target.value))}
                    fullWidth
                />
                <TextField
                    label="Font Color"
                    type="color"
                    value={effect.fontColor}
                    onChange={(e) => onChange("fontColor", normalizeColor(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                />
                <Box display="flex" gap={1}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={effect.italic}
                                onChange={(e) => onChange("italic", e.target.checked)}
                            />
                        }
                        label="Italic"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={effect.bold}
                                onChange={(e) => onChange("bold", e.target.checked)}
                            />
                        }
                        label="Bold"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={effect.underline}
                                onChange={(e) => onChange("underline", e.target.checked)}
                            />
                        }
                        label="Underline"
                    />
                </Box>
                <Box display="flex" gap={1} flexWrap="wrap">
                    <TextField
                        label="Glow X"
                        type="number"
                        value={effect.glowX}
                        onChange={(e) => onChange("glowX", Number(e.target.value))}
                    />
                    <TextField
                        label="Glow Y"
                        type="number"
                        value={effect.glowY}
                        onChange={(e) => onChange("glowY", Number(e.target.value))}
                    />
                    <TextField
                        label="Glow Blur"
                        type="number"
                        value={effect.glowBlur}
                        onChange={(e) => onChange("glowBlur", Number(e.target.value))}
                    />
                    <TextField
                        label="Glow Color"
                        type="color"
                        value={effect.glowColor}
                        onChange={(e) => onChange("glowColor", normalizeColor(e.target.value))}
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <TextField
                    label="Custom CSS Color Snippet"
                    multiline
                    minRows={2}
                    value={effect.customCssColor}
                    onChange={(e) => onChange("customCssColor", e.target.value)}
                    fullWidth
                />
            </Box>
        </Box>
    );
};

export default FontEffectEditor;
