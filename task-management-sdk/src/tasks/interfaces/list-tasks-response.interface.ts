import { BaseSuccessApiResponse } from "../../lib/interfaces/base-success-api-response.interface";
import { Task } from "./task.interface";

export interface listTasksResponseInterface extends BaseSuccessApiResponse {
    data: {
        tasks: Task[];
        count: number;
    };
}
