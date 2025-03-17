// StanceEditor.tsx
import React, { useState } from "react";
import { Box, Typography, Button, ButtonGroup } from "@mui/material";
import { FontEffectConfig, FontStanceConfig } from "../../interfaces/types";
import FontEffectEditor from "./FontEffectEditor";
import Timer from "../Timer.tsx";

interface StanceEditorProps {
    stanceLabel: string;
    stanceConfig: FontStanceConfig;
    onUpdate: (mode: "active" | "idle", field: keyof FontEffectConfig, value: any) => void;
    computePreviewStyle: (effect: FontEffectConfig) => React.CSSProperties;
}

const StanceEditor: React.FC<StanceEditorProps> = ({
                                                       stanceLabel,
                                                       stanceConfig,
                                                       onUpdate,
                                                       computePreviewStyle,
                                                   }) => {
    const [previewMode, setPreviewMode] = useState<"active" | "idle">("idle");

    return (
        <Box border={1} borderColor="grey.300" borderRadius={2} p={2} mb={2}>
            <Typography variant="h6">{stanceLabel} Font Settings</Typography>

            {/* Render the two configuration editors side by side */}
            <Box display="flex" flexDirection="row" gap={2} mt={2}>
                <FontEffectEditor
                    label="Active Configuration"
                    effect={stanceConfig.active}
                    onChange={(field, value) => onUpdate("active", field, value)}
                />
                <FontEffectEditor
                    label="Idle Configuration"
                    effect={stanceConfig.idle}
                    onChange={(field, value) => onUpdate("idle", field, value)}
                />
            </Box>

            {/* Toggle for Preview Mode */}
            <Box mt={2}>
                <ButtonGroup variant="outlined">
                    <Button
                        variant={previewMode === "active" ? "contained" : "outlined"}
                        onClick={() => setPreviewMode("active")}
                    >
                        Active Preview
                    </Button>
                    <Button
                        variant={previewMode === "idle" ? "contained" : "outlined"}
                        onClick={() => setPreviewMode("idle")}
                    >
                        Idle Preview
                    </Button>
                </ButtonGroup>
            </Box>

            {/* Timer Preview */}
            <Box mt={2}>
                <Timer
                    minutes={2}
                    seconds={0}
                    label="2:00"
                    isActive={previewMode === "active"}
                    activeStyle={computePreviewStyle(stanceConfig.active)}
                    idleStyle={computePreviewStyle(stanceConfig.idle)}
                />
            </Box>
        </Box>
    );
};

export default StanceEditor;
