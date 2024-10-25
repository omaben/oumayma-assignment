import { BaseSuccessApiResponse } from "../../lib/interfaces/base-success-api-response.interface";
import { TaskItem } from "./task.interface";

export interface ListTasksResponseInterface extends BaseSuccessApiResponse {
    tasks: TaskItem[];
    count: number;
}
