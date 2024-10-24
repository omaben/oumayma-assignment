'use server';

import { cookies } from 'next/headers';

import { User } from '@/types/user';

/**
 * Store auth (partial patch) in client's cookies.
 * This should be used as Server Action.
 *
 * To remove a specific key, set its value to `null`.
 */
export async function setAuth(auth: Partial<User>): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set('app.auth', JSON.stringify(auth));
}
