import { User } from "./user";

export type DecodedToken = {
    exp: number;
    iat: number;
} & User

export const timezone: string = 'UTC'

export const DefaultLimit: number = 25;


export interface CurrentTimezoneState {
    timezone: string
    timezoneOffset: number
    abbrev: string
}

export const initialStateTimezone: CurrentTimezoneState = {
    timezone: 'Etc/GMT',
    timezoneOffset: 0,
    abbrev: 'GMT'
}
export enum TaskStatus {
    NOT_STARTED = 'not_started',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}