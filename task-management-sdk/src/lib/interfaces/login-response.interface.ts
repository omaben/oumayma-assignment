import { UserResponseInterface } from "./user-response.interface";

export interface LoginResponseInterface extends UserResponseInterface {
    token: string;
}
