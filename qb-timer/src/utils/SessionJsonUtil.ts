import {SessionData, SessionType} from "../../interfaces/SessionData.ts";

export const isValidSessionData = (item: any): item is SessionData => {
    if (typeof item !== "object" || item === null) return false;
    if (typeof item.name !== "string") return false;
    if (typeof item.duration !== "number") return false;
    if (item.type !== SessionType.Single && item.type !== SessionType.Duo) return false;
    if (item.type === SessionType.Single) {
        // For single sessions: stance is optional (if present, must be string), and duo-specific properties must not exist.
        if ("stance" in item && typeof item.stance !== "string") return false;
        if ("label1" in item || "label2" in item) return false;
    } else if (item.type === SessionType.Duo) {
        // For duo sessions: label1 and label2 must exist as strings, and stance must not exist.
        if (typeof item.label1 !== "string" || typeof item.label2 !== "string") return false;
        if ("stance" in item) return false;
    }
    return true;
};

export const isValidJsonStructure = (json: any): boolean =>
    Array.isArray(json) && json.every(isValidSessionData);

const readFileAsText = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });

export const processJsonFile = async (
    acceptedFiles: File[],
    updateJsonFile: (name: string) => void,
    updateData: (data: SessionData[]) => void,
    displayError: (show: boolean) => void,
    updateErrorMessage: (msg: string) => void
): Promise<void> => {
    try {
        const file = acceptedFiles[0];
        const text = await readFileAsText(file);
        const json = JSON.parse(text);
        console.error(isValidJsonStructure(json))
        if (!isValidJsonStructure(json)) {
            throw new Error("Invalid JSON structure");
        }
        updateJsonFile(file.name);
        updateData(json);
        displayError(false);
    } catch (error: unknown) {
        updateErrorMessage(
            "JSON 文件格式错误，请确保 JSON 文件的每个环节包含正确的属性：sessionName、sessionDuration、type，以及根据 type 对应的属性。"
        );
        displayError(true);
    }
};
