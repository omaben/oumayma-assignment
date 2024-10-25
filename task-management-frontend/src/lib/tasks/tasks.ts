import { handleApiRequest } from "@/pages/api/helpers";
import { paths } from "@/paths";

class TasksData {

    async list(params: any): Promise<{
        data?: any, error?: string
    }> {
        return handleApiRequest(paths.api.tasksList, params, 'An unknown error occurred during get current user details process');
    }
}

export const tasksData = new TasksData();