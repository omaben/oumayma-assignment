import { UserRole } from "../../enum/user-role.enum";
import { BaseSuccessApiResponse } from "./base-success-api-response.interface";

export declare interface UserResponseInterface extends BaseSuccessApiResponse {
    user?: {
        username: string;
        role: UserRole;
    };
}
