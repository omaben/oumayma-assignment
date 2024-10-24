import * as React from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, Chip, Stack } from '@mui/material';

import { config } from '@/config';
import { CenteredLayout } from '@/components/auth/centered-layout';
import { SignInForm } from '@/components/auth/custom/sign-in-form';
import { GuestGuard } from '@/components/auth/guest-guard';

export const metadata: Metadata = { title: `Sign in | Custom | Auth | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <CenteredLayout>
        <Card>
          <CardContent>
            <SignInForm />
          </CardContent>
        </Card>
      </CenteredLayout>
    </GuestGuard>
  );
}
