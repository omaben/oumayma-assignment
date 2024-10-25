import { TaskStatus } from "../../enum/task-status.enum";

export interface TaskItem {
    _id: string;
    title: string;
    description: string;
    due_date: Date;
    isDeleted: boolean;
    status: TaskStatus;
    assignee?: string;
    createdBy: string;
    updatedBy?: string;
}
