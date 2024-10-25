import axios from 'axios';
import { listTasksResponseInterface } from './interfaces/list-tasks-response.interface';

export class Task {
    constructor(private readonly baseUrl: string) { }

    async list(token: string, dto: any): Promise<listTasksResponseInterface> {
        try {
            const response = await axios.post(`${this.baseUrl}/tasks/list`, dto, {
                headers: {
                    jwt: `${token}`, // Include token in the Authorization header
                },
            });
            return {
                data: {
                    count: response.data.count || 0,
                    tasks: response.data.tasks || []
                },
                success: true,
                message: 'Get task list successful'
            };
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    }
}
