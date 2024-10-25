import axios from 'axios';
import { loginResponseInterface } from '../lib/interfaces/login-response.interface';
import { userResponseInterface } from '../lib/interfaces/user-response.interface';
import { AuthLoginDto } from './dto/auth-login.dto';

export class Auth {
    constructor(private readonly baseUrl: string) { }

    async login(dto: AuthLoginDto): Promise<loginResponseInterface> {
        try {
            const response = await axios.post(`${this.baseUrl}/auth/login`, dto);
            return {
                user: {
                    username: response.data.username,
                    role: response.data.role,
                },
                token: response.data.access_token,
                success: true,
                message: 'Login successful'
            };
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    }

    async getProfile(token: string): Promise<userResponseInterface> {
        try {
            const response = await axios.get(`${this.baseUrl}/users/profile`, {
                headers: {
                    jwt: `${token}`, // Include token in the Authorization header
                },
            });
            return {
                user: {
                    username: response.data.username,
                    role: response.data.role,
                },
                success: true,
                message: 'Get Profil successful'
            };
        } catch (error: any) {
            throw error.response ? error.response.data : error;
        }
    }
}
