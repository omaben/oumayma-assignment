import { UserRole } from "../../enum/user-role.enum";
import { BaseSuccessApiResponse } from "./base-success-api-response.interface";

export interface userResponseInterface extends BaseSuccessApiResponse {
    user?: {
        username: string;
        role: UserRole;
    };
}
