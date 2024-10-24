'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';
import { useUserContext } from '@/contexts/auth/custom/user-context';
import { layoutConfig } from '../dashboard/layout/config';
import { NavItemConfig } from '@/types/nav';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const { user: userContext } = useUserContext();

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (user) {
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');
      // Find the first path that the user has permission to access
      
      const firstAuthorizedPath =  layoutConfig.navItems[0].items[0]
      if (firstAuthorizedPath) {
        logger.debug('[GuestGuard]: User has access, redirecting to', firstAuthorizedPath.href);
        router.replace(firstAuthorizedPath.href || '/');
      } else {
        logger.debug('[GuestGuard]: User does not have any permissions, redirecting to not authorized page');
        router.replace(paths.notAuthorized);
      }
      return;
    }

    setIsChecking(false);
  };

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
