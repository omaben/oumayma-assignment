'use client';

import { paths } from '@/paths';
import { DecodedToken } from '@/types/common';
import type { User } from '@/types/user';
import { jwtDecode } from 'jwt-decode';
import { setCookie } from 'typescript-cookie';
import { setAuth as setPersistedAuth } from '../set-auth';
import { usersData } from '@/lib/users/users';
import { AuthLoginDto } from 'task-management-sdk/dist/dto/auth-login.dto';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {

  async signInWithPassword(params: AuthLoginDto): Promise<{ data?: any, error?: string }> {
    const { username, password } = params;
    // Construct the login URL
    const loginUrl = `${paths.api.login}`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.message || 'Invalid credentials' };
      }

      const data = await response.json();
      console.log(data, 'ssjsjk')
      const token = data.token;

      if (token) {
        localStorage.setItem('custom-auth-token', token);
        setCookie('access_token', token);
        const user = data
        setPersistedAuth(user)
        return {
          data
        };
      } else {
        return { error: data.message };
      }
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      } else {
        return { error: 'An unknown error occurred during the sign-in process' };
      }
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request
    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');
    if (!token) {
      this.signOut();
      return {};
    }
    let decodedToken: DecodedToken;
    try {
      decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken && decodedToken.exp > currentTime) {
        const { data, error } = await usersData.getMeUser();
        
        const auth: User = decodedToken as User;

        if(!data?.success) return {}

        if(!data.user) return {error: 'User object is missing'}

        return { data: { ...data.user } }

      } else {
        this.signOut();

        return {};
      }

    } catch (error) {
      this.signOut()
      return {};
    }
  }

  async signOut(): Promise<{ error?: string }> {
    // router.replace(paths.auth.signIn);
    localStorage.removeItem('custom-auth-token');
    // window.location.reload();
    return {};
  }
}

export const authClient = new AuthClient();
