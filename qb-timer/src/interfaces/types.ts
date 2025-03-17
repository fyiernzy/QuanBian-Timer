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
    customCssColor: string;
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
