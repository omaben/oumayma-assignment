import { handleApiRequest } from "@/pages/api/helpers";
import { paths } from "@/paths";

class UsersData {

    async getMeUser(): Promise<{
        data?: any, error?: string
    }> {
        return handleApiRequest(paths.api.me, null, 'An unknown error occurred during get current user details process');
    }
}

export const usersData = new UsersData();