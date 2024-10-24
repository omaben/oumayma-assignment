// src/lib/auth/get-auth.ts
'use server';

import { cookies } from 'next/headers';
import { logger } from '@/lib/default-logger';
import { User } from '@/types/user';

/**
 * Retrieve the auth from client's cookies.
 * This should be used in Server Components.
 */
export async function getAuth(): Promise<Partial<User>> {
    const cookieStore = cookies();
    const authStr = cookieStore.get('app.auth')?.value;
    let auth: Partial<User> = {};

    if (authStr) {
        try {
            auth = JSON.parse(authStr) as Partial<User>;
        } catch {
            logger.error('Unable to parse the settings');
        }
    }

    return auth;
}
