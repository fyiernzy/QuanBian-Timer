// SettingsModal.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Box,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { FontEffectConfig, FontStanceConfig, FontConfig, SettingsData } from "../../interfaces/types";
import StanceEditor from "./StanceEditor";

// -------------------
// Default Values
// -------------------
const defaultFontEffect: FontEffectConfig = {
    fontSize: 16,
    fontColor: "#000000",
    italic: false,
    bold: false,
    underline: false,
    glowX: 0,
    glowY: 0,
    glowBlur: 0,
    glowColor: "#000000",
    customCssColor: "#000000",
};

const defaultFontStanceConfig: FontStanceConfig = {
    active: { ...defaultFontEffect },
    idle: { ...defaultFontEffect },
};

const defaultFontConfig: FontConfig = {
    fontFamily: "system",
    customFontFile: null,
    stanceA: { ...defaultFontStanceConfig },
    stanceB: { ...defaultFontStanceConfig },
};

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: SettingsData) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onSave }) => {
    const [jsonData, setJsonData] = useState<any>(null);
    const [imageA, setImageA] = useState<File | null>(null);
    const [imageB, setImageB] = useState<File | null>(null);
    const [fontConfig, setFontConfig] = useState<FontConfig>(defaultFontConfig);
    const [customFontURL, setCustomFontURL] = useState<string | undefined>(undefined);

    // If a custom font is uploaded, create an object URL and inject an @font-face.
    useEffect(() => {
        if (fontConfig.fontFamily === "custom" && fontConfig.customFontFile) {
            const url = URL.createObjectURL(fontConfig.customFontFile);
            setCustomFontURL(url);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setCustomFontURL(undefined);
        }
    }, [fontConfig.fontFamily, fontConfig.customFontFile]);

    // -------------------
    // File Handlers
    // -------------------
    const handleJsonUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result as string);
                    setJsonData(data);
                } catch (error) {
                    console.error("Invalid JSON file", error);
                }
            };
            reader.readAsText(file);
        }
    };

    const handleFileUpload = (
        e: ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<File | null>>
    ) => {
        const file = e.target.files?.[0] || null;
        setter(file);
    };

    // -------------------
    // Updater for Nested Font Configs
    // -------------------
    const updateStanceConfig = (
        stance: "stanceA" | "stanceB",
        mode: "active" | "idle",
        field: keyof FontEffectConfig,
        value: any
    ) => {
        setFontConfig((prev) => ({
            ...prev,
            [stance]: {
                ...prev[stance],
                [mode]: {
                    ...prev[stance][mode],
                    [field]: value,
                },
            },
        }));
    };

    // -------------------
    // Font Family
    // -------------------
    const handleCommonFontChange = (e: SelectChangeEvent<"system" | "custom">) => {
        setFontConfig((prev) => ({
            ...prev,
            fontFamily: e.target.value as "system" | "custom",
        }));
    };

    const handleCustomFontUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFontConfig((prev) => ({
            ...prev,
            customFontFile: file,
        }));
    };

    // -------------------
    // Compute Inline Style from FontEffectConfig
    // -------------------
    const computePreviewStyle = (effect: FontEffectConfig): React.CSSProperties => ({
        fontSize: `${effect.fontSize}px`,
        fontFamily:
            fontConfig.fontFamily === "system"
                ? "system-ui, sans-serif"
                : customFontURL
                    ? '"CustomFont", sans-serif'
                    : "sans-serif",
        fontStyle: effect.italic ? "italic" : "normal",
        fontWeight: effect.bold ? "bold" : "normal",
        textDecoration: effect.underline ? "underline" : "none",
        color: effect.fontColor,
        textShadow: `${effect.glowX}px ${effect.glowY}px ${effect.glowBlur}px ${effect.glowColor}`,
        transition: "all 0.3s ease",
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    });

    // -------------------
    // Save Settings
    // -------------------
    const handleSave = () => {
        onSave({ jsonData, imageA, imageB, fontConfig });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* Inject custom font-face if available */}
            {customFontURL && (
                <style>
                    {`
            @font-face {
              font-family: "CustomFont";
              src: url(${customFontURL});
            }
          `}
                </style>
            )}
            <DialogTitle>Customize Settings</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    {/* JSON File Upload */}
                    <Box>
                        <InputLabel>Upload JSON File</InputLabel>
                        <input type="file" accept=".json" onChange={handleJsonUpload} />
                    </Box>

                    {/* Image Uploads */}
                    <Box display="flex" gap={2}>
                        <Box flex={1}>
                            <InputLabel>Upload Image A</InputLabel>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setImageA)} />
                        </Box>
                        <Box flex={1}>
                            <InputLabel>Upload Image B</InputLabel>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setImageB)} />
                        </Box>
                    </Box>

                    {/* Font Family Selector */}
                    <Box>
                        <InputLabel>Font Family</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                value={fontConfig.fontFamily}
                                onChange={handleCommonFontChange}
                                label="Font Family"
                            >
                                <MenuItem value="system">System Font</MenuItem>
                                <MenuItem value="custom">Custom Upload</MenuItem>
                            </Select>
                        </FormControl>
                        {fontConfig.fontFamily === "custom" && (
                            <Box mt={1}>
                                <InputLabel>Upload .ttf Font File</InputLabel>
                                <input type="file" accept=".ttf" onChange={handleCustomFontUpload} />
                            </Box>
                        )}
                    </Box>

                    {/* Stance A and Stance B Editors */}
                    <StanceEditor
                        stanceLabel="Stance A"
                        stanceConfig={fontConfig.stanceA}
                        onUpdate={(mode, field, value) => updateStanceConfig("stanceA", mode, field, value)}
                        computePreviewStyle={computePreviewStyle}
                    />
                    <StanceEditor
                        stanceLabel="Stance B"
                        stanceConfig={fontConfig.stanceB}
                        onUpdate={(mode, field, value) => updateStanceConfig("stanceB", mode, field, value)}
                        computePreviewStyle={computePreviewStyle}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">
                    Save Settings
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SettingsModal;
