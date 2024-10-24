'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import { authClient } from '@/lib/auth/custom/client';
import { logger } from '@/lib/default-logger';
import type { User } from '@/types/user';

import { TimezoneContext } from '../timezone';
import type { UserContextValue } from '../types';
import { initialStateTimezone } from '@/types/common';

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
    user: null,
    error: null,
    isLoading: true,
  });
  const router = useRouter();
  const { timezone, setTimezone } = React.useContext(TimezoneContext);

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await authClient.getUser();
      if (error) {
        logger.error(error);
        router.refresh();
        setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
        return;
      }

      setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));
      if (!timezone) {
        setTimezone(initialStateTimezone);
      }
    } catch (err) {
      logger.error(err);
      router.refresh();
      setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
    }
  }, []);

  const setUser = React.useCallback((user: User | null): void => {
    setState((prev) => ({ ...prev, user }));
  }, []); // Initialize setUser

  React.useEffect(() => {
    checkSession().catch((err) => {
      logger.error(err);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession, setUser }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;

export const useUserContext = (): UserContextValue => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
