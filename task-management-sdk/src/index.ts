import 'reflect-metadata';
import { Auth } from './taskManagement/auth.class';

// Create a singleton instance of Auth
const authSdk = new Auth('http://localhost:3006');

export { authSdk };
export { AuthLoginDto } from './dto/auth-login.dto';
export { AuthUserAddDto } from './dto/auth-user-add.dto';
