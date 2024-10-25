import 'reflect-metadata';
import { TaskManagement } from './task-management';
// DTOs
export { AuthLoginDto } from './auth/dto/auth-login.dto';
export { TaskListDto } from './tasks/dto/task-list.dto';
export { AuthUserAddDto } from './users/auth-user-add.dto';
// Enumerations
export { UserRole } from './enum/user-role.enum';
// Interfaces
export { LoginResponseInterface } from './lib/interfaces/login-response.interface';
export { UserResponseInterface } from './lib/interfaces/user-response.interface';
export { ListTasksResponseInterface } from './tasks/interfaces/list-tasks-response.interface';
export { TaskItem } from './tasks/interfaces/task.interface';
// Classes

// Create a singleton instance of Auth
const taskManagement = new TaskManagement('http://localhost:3006');

export { taskManagement };

