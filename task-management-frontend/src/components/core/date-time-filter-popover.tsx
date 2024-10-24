import React from 'react';
import { Button, FormControl, Stack } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import { timedifference } from '@/lib/helper';

import { FilterPopover, useFilterContext } from './filter-button';
import { TimezoneContext } from '@/contexts/auth/timezone';

export function DateTimeFilterPopover(): React.JSX.Element {
  const { anchorEl, onApply, onClose, open, value: initialValueFrom, valueTo: initialValueTo } = useFilterContext();
  const [valueFrom, setValueFrom] = React.useState<Date>();
  const [valueTo, setValueTo] = React.useState<Date>();
  const { timezone, setTimezone } = React.useContext(TimezoneContext);

  React.useEffect(() => {
    if (timezone) {
      setValueFrom(
        new Date(
          (parseInt(initialValueFrom as string) + timedifference * 60 - timezone?.timezoneOffset * 60) * 1000
        ) as Date | undefined
      );
      setValueTo(
        new Date((parseInt(initialValueTo as string) + timedifference * 60 - timezone?.timezoneOffset * 60) * 1000) as
          | Date
          | undefined
      );
    }
  }, [initialValueFrom, initialValueTo, timezone]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Filter by Date" width="300px">
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
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
          }}
        >
          Last 48h
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            const now = new Date();
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
            const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

            setValueFrom(startOfToday);
            setValueTo(endOfToday);
          }}
        >
          Today
        </Button>
      </Stack>
      <FormControl>
        <DateTimePicker
          format="YYYY-MM-DD HH:mm"
          label="From"
          onChange={(date) => {
            setValueFrom(date?.toDate());
          }}
          value={dayjs(valueFrom)}
        />
      </FormControl>
      <FormControl>
        <DateTimePicker
          format="YYYY-MM-DD HH:mm"
          label="To"
          onChange={(date) => {
            setValueTo(date?.toDate());
          }}
          value={dayjs(valueTo)}
        />
      </FormControl>
      <Button
        onClick={() => {
          if (valueFrom) {
            onApply(valueFrom, valueTo);
          }
        }}
        variant="contained"
      >
        Apply
      </Button>
    </FilterPopover>
  );
}
