import { UserRole } from "../../enum/user-role.enum";
import { BaseSuccessApiResponse } from "./base-success-api-response.interface";
import { userResponseInterface } from "./user-response.interface";

export interface loginResponseInterface extends userResponseInterface {
    token: string;
}
