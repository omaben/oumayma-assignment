import { NextApiRequest, NextApiResponse } from 'next';
import { taskManagement } from 'task-management-sdk/dist';
import { getAuthorizationToken, handleApiError } from '../helpers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getAuthorizationToken(req, res);
    if (!token) return;  // Return if token is not found

    const dto: any = req.body;
    try {
        const response = await taskManagement.task.list(token, dto);
        res.status(200).json(response);
    } catch (error: any) {
        handleApiError(res, error);  // Use helper for error handling
    }
};
