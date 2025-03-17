import {SessionData, SessionType} from "../interfaces/SessionData.ts";

export const isSingleSession = (sessionData: SessionData): boolean =>
    sessionData.type === SessionType.Single;

export const isDuoSession = (sessionData: SessionData): boolean =>
    sessionData.type === SessionType.Duo;