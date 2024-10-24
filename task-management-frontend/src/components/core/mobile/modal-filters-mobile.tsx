'use client';

import * as React from 'react';
import { Box, Divider, Drawer } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

export interface ModalFiltersProps {
  filters?: any;
  sortDir?: any;
  details?: boolean;
  href?: string;
}

export interface ModalFiltersMobileModalProps extends ModalFiltersProps {
  onClose: () => void;
  open: boolean;
  FiltersForm: React.JSX.Element;
}

export function ModalFiltersMobileModal({
  onClose,
  open,
  filters,
  details,
  href,
  FiltersForm,
}: ModalFiltersMobileModalProps): React.JSX.Element {
  return (
    <Drawer
      ModalProps={{ BackdropProps: { invisible: true } }}
      PaperProps={{ elevation: 24, sx: { display: 'flex', flexDirection: 'column', maxWidth: '100%', width: '440px' } }}
      anchor="right"
      onClose={onClose}
      open={open}
    >
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 2 }}>
        <Typography variant="h6">filters</Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <IconButton onClick={onClose}>
            <XIcon />
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
      <Stack spacing={1} sx={{ overflowY: 'auto', p: 0 }}>
        <Box
          sx={{
            display: 'block',
            flexDirection: { xs: 'row', md: 'row' },
            p: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            // display: { xs: 'none', sm: 'flex' }
          }}
        >
          {FiltersForm}
        </Box>
      </Stack>
    </Drawer>
  );
}
