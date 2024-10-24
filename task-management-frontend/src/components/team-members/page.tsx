'use client';

import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import * as React from 'react';

import { useUserContext } from '@/contexts/auth/custom/user-context';

import RenderPageTitle from '../core/render-page-title';

interface PageProps {
  searchParams: { view?: 'group' | 'list'; sortDir?: 'asc' | 'desc'; sortBy?: string };
}

export default function TeamMemberPage({ searchParams }: PageProps): React.JSX.Element {
  const { view = 'list' } = searchParams;
  const [openNewStaff, setOpenNewStaff] = React.useState(false);
  const [keyRefresh, setKeyRefresh] = React.useState(0);
  const [isPending, setIsPending] = React.useState(false);
  const { user } = useUserContext();

  const handleOpenNewStaff = () => {
    setOpenNewStaff(true);
  };

  const handleCloseNewStaff = () => {
    setOpenNewStaff(false);
  };

  const handleOnSuccess = () => {
    handleCloseNewStaff();
    hadnleSuccess();
  };

  const hadnleSuccess = () => {
    setKeyRefresh(keyRefresh + 1);
  };
  return (
    <Box
      sx={{
        // maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={1}>
        <RenderPageTitle
          isPending={isPending}
          reload={() => setKeyRefresh(keyRefresh + 1)}
          title="Team Members"
          hasTotalAmount={false}
          buttons={
            user ? (
              <Button variant="contained" onClick={handleOpenNewStaff}>
                New User
              </Button>
            ) : undefined
          }
        />
        <Stack direction="row" spacing={4} sx={{ alignItems: 'flex-start' }}>
          <Stack spacing={4} sx={{ flex: '1 1 auto', minWidth: 0 }}>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
