'use client';

import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { config } from '@/config';
import { useUser } from '@/hooks/use-user';
import { AuthStrategy } from '@/lib/auth/strategy';
import { logger } from '@/lib/default-logger';
import { paths } from '@/paths';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');

      switch (config.auth.strategy) {
        case AuthStrategy.CUSTOM: {
          router.replace(paths.auth.signIn);
          return;
        }
        default: {
          logger.error('[AuthGuard]: Unknown auth strategy');
          return;
        }
      }
    }

    setIsChecking(false);
  };

  const hasFetchedData = React.useRef(false);


  React.useEffect(() => {
    if (hasFetchedData.current) return;
  });

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);

  if (isChecking) {
    return null;
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
