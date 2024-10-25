import { TaskStatus } from "../../enum/task-status.enum";
import { PaginationBaseDto } from "../../lib/dto/pagination-base.dto";

export declare class FindTaskDto {
    id?: string;
    title?: string;
    description?: string;
    date?: Date;
    status?: TaskStatus;
    assignee?: string;
    createdBy?: string;
    updatedBy?: string;
}

export declare class TaskListDto extends PaginationBaseDto {
    find: FindTaskDto;
}