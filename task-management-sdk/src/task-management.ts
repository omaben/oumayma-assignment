import { AuthService } from "./auth/auth.class";
import { TaskService } from "./tasks/task.class";

export class TaskManagement {
    private _baseUrl: string;
    auth: AuthService;
    task: TaskService;

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
        this.auth = new AuthService(baseUrl);
        this.task = new TaskService(baseUrl)
    }
}