import React from 'react';
import { Button, Card, CardContent, CardHeader, Divider, FormControl, Stack, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { useTranslation } from 'next-i18next';

import { timedifference } from '@/lib/helper';
import { TimezoneContext } from '@/contexts/auth/timezone';

export interface FilterButtonProps {
  displayValue?: string;
  label: string;
  onFilterApply?: (value: unknown, valueTo?: unknown) => void;
  onFilterDelete?: () => void;
  currency?: string;
  value?: unknown;
  valueTo?: unknown;
  sx?: SxProps;
}

// Currently, the `value` prop can be string | number | boolean | undefined

export function DateTimeFilterMobile({
  displayValue,
  onFilterApply,
  onFilterDelete,
  currency,
  label,
  value: initialValueFrom,
  valueTo: initialValueTo,
  sx,
}: FilterButtonProps): React.JSX.Element {
  const [valueFrom, setValueFrom] = React.useState<Date | null>(null); // Initialize with null instead of undefined
  const [valueTo, setValueTo] = React.useState<Date | null>(null);     // Initialize with null instead of undefined
  const [keyData, setKeyData] = React.useState<number>(0);
  const { timezone, setTimezone } = React.useContext(TimezoneContext);
  const { t } = useTranslation();

  React.useEffect(() => {
    if (timezone) {
      setValueFrom(
        initialValueFrom
          ? new Date(
              (parseInt(initialValueFrom as string) + timedifference * 60 - timezone?.timezoneOffset * 60) * 1000
            )
          : null
      );
      setValueTo(
        initialValueTo
          ? new Date((parseInt(initialValueTo as string) + timedifference * 60 - timezone?.timezoneOffset * 60) * 1000)
          : null
      );
    }
  }, [initialValueFrom, initialValueTo, timezone]);

  const handleApply = React.useCallback(
    (newValue: unknown, newValueTo?: unknown) => {
      onFilterApply?.(newValue, newValueTo);
    },
    [onFilterApply]
  );

  const handleClear = React.useCallback(() => {
    setValueFrom(null);  // Set to null on clear
    setValueTo(null);    // Set to null on clear
    setKeyData(keyData + 1);
    onFilterDelete?.();
  }, [onFilterDelete, setValueFrom, setValueTo]);

  return (
    <Card>
      <CardHeader
        title={
          <Stack
            direction={'row'}
            spacing={2}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: '1 1 auto',
              flexWrap: 'wrap',
              p: 0,
            }}
          >
            <Typography>{label}</Typography>
            <Button color="error" variant="contained" onClick={handleClear}>
              Clear
            </Button>
          </Stack>
        }
      />
      <Divider />
      <Stack direction={'row'} spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap', p: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          sx={{ px: 1 }}
          onClick={() => {
            const nowUtc = new Date();
            const now = new Date(nowUtc.getTime() - timedifference * 60000 + timezone.timezoneOffset * 60000);
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            setValueFrom(firstDayOfMonth);
            setValueTo(lastDayOfMonth);
            handleApply(firstDayOfMonth, lastDayOfMonth);
          }}
        >
          This month
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const nowUtc = new Date();
            const now = new Date(nowUtc.getTime() + timedifference * 60000 - timezone.timezoneOffset * 60000);
            const last48Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000); // 48 hours ago

            setValueFrom(last48Hours);
            setValueTo(now);
            handleApply(last48Hours, now);
          }}
        >
          Last 48h
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const nowUtc = new Date();
            const now = new Date(nowUtc.getTime() + timedifference * 60000 - timezone.timezoneOffset * 60000);
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

            setValueFrom(startOfToday);
            setValueTo(endOfToday);
            handleApply(startOfToday, endOfToday);
          }}
        >
          Today
        </Button>
      </Stack>
      <Divider />
      <CardContent>
        <FormControl fullWidth>
          <DateTimePicker
            format="YYYY-MM-DD HH:mm"
            label="From"
            key={keyData}
            onChange={(date) => {
              setValueFrom(date?.toDate() ?? null);  // Use null instead of undefined
              handleApply(date?.toDate(), valueTo);
            }}
            value={valueFrom ? dayjs(valueFrom) : null}  // Use null for uncontrolled
          />
        </FormControl>
        <FormControl fullWidth>
          <DateTimePicker
            format="YYYY-MM-DD HH:mm"
            label="To"
            key={keyData}
            onChange={(date) => {
              setValueTo(date?.toDate() ?? null);  // Use null instead of undefined
              handleApply(valueFrom, date?.toDate());
            }}
            value={valueTo ? dayjs(valueTo) : null}  // Use null for uncontrolled
          />
        </FormControl>
      </CardContent>
    </Card>
  );
}

