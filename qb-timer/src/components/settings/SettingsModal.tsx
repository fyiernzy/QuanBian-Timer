// SettingsModal.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

// -------------------
// Type Definitions
// -------------------
export interface FontEffectConfig {
    fontSize: number;
    fontColor: string;
    italic: boolean;
    bold: boolean;
    underline: boolean;
    glowX: number;
    glowY: number;
    glowBlur: number;
    glowColor: string;
    customCssColor: string; // might be optional or unused
}

export interface FontStanceConfig {
    active: FontEffectConfig;
    idle: FontEffectConfig;
}

export interface FontConfig {
    fontFamily: "system" | "custom";
    customFontFile?: File | null;
    stanceA: FontStanceConfig;
    stanceB: FontStanceConfig;
}

export interface SettingsData {
    jsonData?: any;
    imageA?: File | null;
    imageB?: File | null;
    fontConfig: FontConfig;
}

interface SettingsModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: SettingsData) => void;
}

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

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose, onSave }) => {
    const [jsonData, setJsonData] = useState<any>(null);
    const [imageA, setImageA] = useState<File | null>(null);
    const [imageB, setImageB] = useState<File | null>(null);
    const [fontConfig, setFontConfig] = useState<FontConfig>(defaultFontConfig);
    const [customFontURL, setCustomFontURL] = useState<string | undefined>(undefined);

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
    // Font Family Changes
    // -------------------
    const handleCommonFontChange = (field: keyof Pick<FontConfig, "fontFamily" | "customFontFile">) => (
        e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<"system" | "custom">
    ) => {
        if (field === "fontFamily") {
            const value = (e as SelectChangeEvent<"system" | "custom">).target.value;
            setFontConfig((prev) => ({
                ...prev,
                fontFamily: value as "system" | "custom",
            }));
        }
    };

    const handleCustomFontUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFontConfig((prev) => ({
            ...prev,
            customFontFile: file,
        }));
    };

    // -------------------
    // Preview Styles
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
        // CHANGED HERE: use effect.fontColor so that changes to "Font Color" are actually visible
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

                    {/* Common Font Family Configuration */}
                    <Box>
                        <InputLabel>Font Family</InputLabel>
                        <FormControl fullWidth>
                            <Select
                                value={fontConfig.fontFamily}
                                onChange={handleCommonFontChange("fontFamily")}
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

                    {/* Stance A Font Configuration */}
                    <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
                        <Typography variant="h6">Stance A Font Settings</Typography>
                        {/* Active Configuration */}
                        <Typography variant="subtitle1">Active Configuration</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <TextField
                                label="Font Size"
                                type="number"
                                value={fontConfig.stanceA.active.fontSize}
                                onChange={(e) =>
                                    updateStanceConfig("stanceA", "active", "fontSize", Number(e.target.value))
                                }
                                fullWidth
                            />
                            <TextField
                                label="Font Color"
                                type="color"
                                value={fontConfig.stanceA.active.fontColor}
                                onChange={(e) =>
                                    updateStanceConfig("stanceA", "active", "fontColor", e.target.value)
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <Box display="flex" gap={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fontConfig.stanceA.active.italic}
                                            onChange={(e) =>
                                                updateStanceConfig("stanceA", "active", "italic", e.target.checked)
                                            }
                                        />
                                    }
                                    label="Italic"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fontConfig.stanceA.active.bold}
                                            onChange={(e) =>
                                                updateStanceConfig("stanceA", "active", "bold", e.target.checked)
                                            }
                                        />
                                    }
                                    label="Bold"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fontConfig.stanceA.active.underline}
                                            onChange={(e) =>
                                                updateStanceConfig("stanceA", "active", "underline", e.target.checked)
                                            }
                                        />
                                    }
                                    label="Underline"
                                />
                            </Box>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <TextField
                                    label="Glow X"
                                    type="number"
                                    value={fontConfig.stanceA.active.glowX}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceA", "active", "glowX", Number(e.target.value))
                                    }
                                />
                                <TextField
                                    label="Glow Y"
                                    type="number"
                                    value={fontConfig.stanceA.active.glowY}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceA", "active", "glowY", Number(e.target.value))
                                    }
                                />
                                <TextField
                                    label="Glow Blur"
                                    type="number"
                                    value={fontConfig.stanceA.active.glowBlur}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceA", "active", "glowBlur", Number(e.target.value))
                                    }
                                />
                                <TextField
                                    label="Glow Color"
                                    type="color"
                                    value={fontConfig.stanceA.active.glowColor}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceA", "active", "glowColor", e.target.value)
                                    }
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <TextField
                                label="Custom CSS Color Snippet"
                                multiline
                                minRows={2}
                                value={fontConfig.stanceA.active.customCssColor}
                                onChange={(e) =>
                                    updateStanceConfig("stanceA", "active", "customCssColor", e.target.value)
                                }
                                fullWidth
                            />
                        </Box>

                        {/* Idle Configuration */}
                        <Box mt={2}>
                            <Typography variant="subtitle1">Idle Configuration</Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <TextField
                                    label="Font Size (Idle)"
                                    type="number"
                                    value={fontConfig.stanceA.idle.fontSize}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceA", "idle", "fontSize", Number(e.target.value))
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Font Color (Idle)"
                                    type="color"
                                    value={fontConfig.stanceA.idle.fontColor}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceA", "idle", "fontColor", e.target.value)
                                    }
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Box display="flex" gap={1}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={fontConfig.stanceA.idle.italic}
                                                onChange={(e) =>
                                                    updateStanceConfig("stanceA", "idle", "italic", e.target.checked)
                                                }
                                            />
                                        }
                                        label="Italic"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={fontConfig.stanceA.idle.bold}
                                                onChange={(e) =>
                                                    updateStanceConfig("stanceA", "idle", "bold", e.target.checked)
                                                }
                                            />
                                        }
                                        label="Bold"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={fontConfig.stanceA.idle.underline}
                                                onChange={(e) =>
                                                    updateStanceConfig("stanceA", "idle", "underline", e.target.checked)
                                                }
                                            />
                                        }
                                        label="Underline"
                                    />
                                </Box>
                                <Box display="flex" gap={1} flexWrap="wrap">
                                    <TextField
                                        label="Glow X (Idle)"
                                        type="number"
                                        value={fontConfig.stanceA.idle.glowX}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceA", "idle", "glowX", Number(e.target.value))
                                        }
                                    />
                                    <TextField
                                        label="Glow Y (Idle)"
                                        type="number"
                                        value={fontConfig.stanceA.idle.glowY}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceA", "idle", "glowY", Number(e.target.value))
                                        }
                                    />
                                    <TextField
                                        label="Glow Blur (Idle)"
                                        type="number"
                                        value={fontConfig.stanceA.idle.glowBlur}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceA", "idle", "glowBlur", Number(e.target.value))
                                        }
                                    />
                                    <TextField
                                        label="Glow Color (Idle)"
                                        type="color"
                                        value={fontConfig.stanceA.idle.glowColor}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceA", "idle", "glowColor", e.target.value)
                                        }
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <TextField
                                    label="Custom CSS Color Snippet (Idle)"
                                    multiline
                                    minRows={2}
                                    value={fontConfig.stanceA.idle.customCssColor}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceA", "idle", "customCssColor", e.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                        </Box>

                        {/* Stance A Preview */}
                        <Box mt={2}>
                            <Typography variant="subtitle2">Stance A Active Preview</Typography>
                            <Box mt={1} p={2} style={computePreviewStyle(fontConfig.stanceA.active)}>
                                The quick brown fox jumps over the lazy dog.
                            </Box>
                        </Box>
                    </Box>

                    {/* Stance B Font Configuration */}
                    <Box border={1} borderColor="grey.300" borderRadius={2} p={2}>
                        <Typography variant="h6">Stance B Font Settings</Typography>
                        {/* Active Configuration */}
                        <Typography variant="subtitle1">Active Configuration</Typography>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <TextField
                                label="Font Size"
                                type="number"
                                value={fontConfig.stanceB.active.fontSize}
                                onChange={(e) =>
                                    updateStanceConfig("stanceB", "active", "fontSize", Number(e.target.value))
                                }
                                fullWidth
                            />
                            <TextField
                                label="Font Color"
                                type="color"
                                value={fontConfig.stanceB.active.fontColor}
                                onChange={(e) =>
                                    updateStanceConfig("stanceB", "active", "fontColor", e.target.value)
                                }
                                InputLabelProps={{ shrink: true }}
                            />
                            <Box display="flex" gap={1}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fontConfig.stanceB.active.italic}
                                            onChange={(e) =>
                                                updateStanceConfig("stanceB", "active", "italic", e.target.checked)
                                            }
                                        />
                                    }
                                    label="Italic"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fontConfig.stanceB.active.bold}
                                            onChange={(e) =>
                                                updateStanceConfig("stanceB", "active", "bold", e.target.checked)
                                            }
                                        />
                                    }
                                    label="Bold"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={fontConfig.stanceB.active.underline}
                                            onChange={(e) =>
                                                updateStanceConfig("stanceB", "active", "underline", e.target.checked)
                                            }
                                        />
                                    }
                                    label="Underline"
                                />
                            </Box>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                <TextField
                                    label="Glow X"
                                    type="number"
                                    value={fontConfig.stanceB.active.glowX}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceB", "active", "glowX", Number(e.target.value))
                                    }
                                />
                                <TextField
                                    label="Glow Y"
                                    type="number"
                                    value={fontConfig.stanceB.active.glowY}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceB", "active", "glowY", Number(e.target.value))
                                    }
                                />
                                <TextField
                                    label="Glow Blur"
                                    type="number"
                                    value={fontConfig.stanceB.active.glowBlur}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceB", "active", "glowBlur", Number(e.target.value))
                                    }
                                />
                                <TextField
                                    label="Glow Color"
                                    type="color"
                                    value={fontConfig.stanceB.active.glowColor}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceB", "active", "glowColor", e.target.value)
                                    }
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                            <TextField
                                label="Custom CSS Color Snippet"
                                multiline
                                minRows={2}
                                value={fontConfig.stanceB.active.customCssColor}
                                onChange={(e) =>
                                    updateStanceConfig("stanceB", "active", "customCssColor", e.target.value)
                                }
                                fullWidth
                            />
                        </Box>

                        {/* Idle Configuration */}
                        <Box mt={2}>
                            <Typography variant="subtitle1">Idle Configuration</Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <TextField
                                    label="Font Size (Idle)"
                                    type="number"
                                    value={fontConfig.stanceB.idle.fontSize}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceB", "idle", "fontSize", Number(e.target.value))
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Font Color (Idle)"
                                    type="color"
                                    value={fontConfig.stanceB.idle.fontColor}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceB", "idle", "fontColor", e.target.value)
                                    }
                                    InputLabelProps={{ shrink: true }}
                                />
                                <Box display="flex" gap={1}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={fontConfig.stanceB.idle.italic}
                                                onChange={(e) =>
                                                    updateStanceConfig("stanceB", "idle", "italic", e.target.checked)
                                                }
                                            />
                                        }
                                        label="Italic"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={fontConfig.stanceB.idle.bold}
                                                onChange={(e) =>
                                                    updateStanceConfig("stanceB", "idle", "bold", e.target.checked)
                                                }
                                            />
                                        }
                                        label="Bold"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={fontConfig.stanceB.idle.underline}
                                                onChange={(e) =>
                                                    updateStanceConfig("stanceB", "idle", "underline", e.target.checked)
                                                }
                                            />
                                        }
                                        label="Underline"
                                    />
                                </Box>
                                <Box display="flex" gap={1} flexWrap="wrap">
                                    <TextField
                                        label="Glow X (Idle)"
                                        type="number"
                                        value={fontConfig.stanceB.idle.glowX}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceB", "idle", "glowX", Number(e.target.value))
                                        }
                                    />
                                    <TextField
                                        label="Glow Y (Idle)"
                                        type="number"
                                        value={fontConfig.stanceB.idle.glowY}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceB", "idle", "glowY", Number(e.target.value))
                                        }
                                    />
                                    <TextField
                                        label="Glow Blur (Idle)"
                                        type="number"
                                        value={fontConfig.stanceB.idle.glowBlur}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceB", "idle", "glowBlur", Number(e.target.value))
                                        }
                                    />
                                    <TextField
                                        label="Glow Color (Idle)"
                                        type="color"
                                        value={fontConfig.stanceB.idle.glowColor}
                                        onChange={(e) =>
                                            updateStanceConfig("stanceB", "idle", "glowColor", e.target.value)
                                        }
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <TextField
                                    label="Custom CSS Color Snippet (Idle)"
                                    multiline
                                    minRows={2}
                                    value={fontConfig.stanceB.idle.customCssColor}
                                    onChange={(e) =>
                                        updateStanceConfig("stanceB", "idle", "customCssColor", e.target.value)
                                    }
                                    fullWidth
                                />
                            </Box>
                        </Box>

                        {/* Stance B Preview */}
                        <Box mt={2}>
                            <Typography variant="subtitle2">Stance B Active Preview</Typography>
                            <Box mt={1} p={2} style={computePreviewStyle(fontConfig.stanceB.active)}>
                                The quick brown fox jumps over the lazy dog.
                            </Box>
                        </Box>
                    </Box>
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
