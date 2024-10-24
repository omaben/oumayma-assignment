import { NextApiRequest, NextApiResponse } from 'next';
import {  authSdk } from 'task-management-sdk/dist';
import { AuthLoginDto } from 'task-management-sdk/dist/dto/auth-login.dto';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { password, username }: AuthLoginDto = req.body; // Retrieve the token from the request body
    const dto: AuthLoginDto = {
        username,
        password
    }
    try {
        const response = await authSdk.login(dto);
        console.log(response)
        res.status(200).json(response);
    } catch (error: any) {
        console.log(error, 'test');
        return res.status(400).json('internal error');
    }
};
