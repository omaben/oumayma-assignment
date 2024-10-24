'use client';

import { MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import * as React from 'react';

import { ChangeMyPasswordModal } from '@/components/team-members/change-password/change-my-password-modal';
import { config } from '@/config';
import { useUserContext } from '@/contexts/auth/custom/user-context';
import { AuthStrategy } from '@/lib/auth/strategy';

import { CustomSignOut } from './custom-sign-out';

export interface UserPopoverProps {
  anchorEl: null | Element;
  onClose?: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { user } = useUserContext();
  const [openChangePassword, setOpenChangePassword] = React.useState(false);

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setOpenChangePassword(false);
  };

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={Boolean(open)}
      slotProps={{ paper: { sx: { width: '280px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Box sx={{ p: 2 }}>
        <Typography>{user?.username?.toUpperCase()}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user?.role}
        </Typography>
      </Box>
      <Divider />
      {user && (
        <Box sx={{ p: 1 }}>
          <MenuItem component="div" sx={{ justifyContent: 'center' }} onClick={() => handleOpenChangePassword()}>
            Change My Password
          </MenuItem>
        </Box>
      )}

      <Divider />
      <Box sx={{ p: 1 }}>{config.auth.strategy === AuthStrategy.CUSTOM ? <CustomSignOut /> : null}</Box>
      {user && (
        <ChangeMyPasswordModal
          currentData={user as any}
          open={openChangePassword}
          onClose={handleCloseChangePassword}
        />
      )}
    </Popover>
  );
}
