import 'reflect-metadata';
// DTOs
export { AuthLoginDto } from './auth/dto/auth-login.dto';
export { AuthUserAddDto } from './users/auth-user-add.dto';
// Enumerations
export { UserRole } from './enum/user-role.enum';
// Interfaces
export { loginResponseInterface } from './lib/interfaces/login-response.interface';
export { userResponseInterface } from './lib/interfaces/user-response.interface';
// Classes
import { Auth } from './auth/auth.class';

// Create a singleton instance of Auth
const authSdk = new Auth('http://localhost:3006');

export { authSdk };
