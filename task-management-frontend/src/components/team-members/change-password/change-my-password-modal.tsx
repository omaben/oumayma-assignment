'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Button,
  DialogContent,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { User } from '@/types/user';

export interface ChangePasswordModalProps {
  currentData?: User;
  onClose: () => void;
  open: boolean;
}

const schema = zod.object({
  newPassword: zod.string(),
  oldPassword: zod.string(),
});

type Values = zod.infer<typeof schema>;

export function ChangeMyPasswordModal({ currentData, onClose, open }: ChangePasswordModalProps): React.JSX.Element {
  const defaultValues = {
    newPassword: '',
    oldPassword: '',
  };

  const [isPending, setIsPending] = React.useState<boolean>(false);
  const hasFetchedData = React.useRef(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

  React.useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open]);

  const onSubmit = React.useCallback(
    async (values: Values): Promise<void> => {
      setIsPending(true);
    },
    [setError, reset, defaultValues, onClose]
  );
  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
        <Typography variant="h6">Change Password</Typography>
        <IconButton
          onClick={() => {
            hasFetchedData.current = false;
            onClose();
          }}
        >
          <XIcon />
        </IconButton>
      </Stack>
      <Divider />
      <DialogContent sx={{ textAlign: 'center', minHeight: 150 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} sx={{ textAlign: 'left' }}>
            <Stack spacing={2}>
            <Controller
                control={control}
                name="oldPassword"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.oldPassword)}>
                    <InputLabel required>Old Password</InputLabel>
                    <OutlinedInput {...field} type="password" />
                    {errors.oldPassword ? <FormHelperText>{errors.oldPassword.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="newPassword"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.newPassword)}>
                    <InputLabel required>New Password</InputLabel>
                    <OutlinedInput {...field} type="password" />
                    {errors.newPassword ? <FormHelperText>{errors.newPassword.message}</FormHelperText> : null}
                  </FormControl>
                )}
              />
            </Stack>
            <Divider />
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'right', p: 2 }}>
              {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
              <Button
                color="secondary"
                onClick={() => {
                  hasFetchedData.current = false;
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button disabled={isPending} type="submit" variant="contained">
                Submit
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}
