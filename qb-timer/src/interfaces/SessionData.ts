export interface SessionData {
    name: string;
    duration: number;
    type: SessionType.Single | SessionType.Duo;

    // For single sessions, a stance are required.
    stance?: StanceType.Affirmative | StanceType.Negative;

    // For duo sessions, label1 and label2 are required.
    label1?: string;
    label2?: string;
}

export enum SessionType {
    Single = "single",
    Duo = "duo",
}

export enum StanceType {
    Affirmative = "affirmative",
    Negative = "negative",
}