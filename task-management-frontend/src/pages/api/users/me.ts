import { NextApiRequest, NextApiResponse } from 'next';
import { getAuthorizationToken, handleApiError } from '../helpers';
import { taskManagement } from 'task-management-sdk/dist';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getAuthorizationToken(req, res);
    if (!token) return;  // Return if token is not found
    try {
        const response = await taskManagement.auth.getProfile(token);
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error)
        handleApiError(res, error);  // Use helper for error handling
    }
};
