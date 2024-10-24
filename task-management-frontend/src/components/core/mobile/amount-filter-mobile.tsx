import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';


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

export function AmountFilterMobile({
  displayValue,
  onFilterApply,
  onFilterDelete,
  currency,
  label,
  value: initialValueFrom,
  valueTo: initialValueTo,
  sx,
}: FilterButtonProps): React.JSX.Element {
  const [valueFrom, setValueFrom] = React.useState<number>();
  const [valueTo, setValueTo] = React.useState<number>();

  React.useEffect(() => {
    setValueFrom(parseFloat(initialValueFrom as string));
    setValueTo(parseFloat(initialValueTo as string));
  }, [initialValueFrom, initialValueTo]);

  const handleApply = React.useCallback(
    (newValue: unknown, newValueTo?: unknown) => {
      onFilterApply?.(newValue, newValueTo);
    },
    [onFilterApply]
  );

  return (
    <Card>
      <CardHeader
        title={
          <Stack
            direction={'row'}
            spacing={2}
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between', // Moves button to the right
              flex: '1 1 auto',
              flexWrap: 'wrap',
              p: 0,
            }}
          >
            <Typography>{label}</Typography>
          </Stack>
        }
      />
      <Divider />
      <Divider />
      <CardContent>
        <FormControl fullWidth>
          <InputLabel>From</InputLabel>
          <OutlinedInput
            type="number"
            onChange={(event) => {
              setValueFrom(parseFloat(event.target.value));
              handleApply(parseFloat(event.target.value), valueTo);
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                handleApply(valueFrom, valueTo);
              }
            }}
            value={valueFrom}
            inputProps={{ min: 0 }} // Set the minimum value here
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>To</InputLabel>
          <OutlinedInput
            type="number"
            onChange={(event) => {
              setValueTo(parseFloat(event.target.value));
              handleApply(valueFrom, parseFloat(event.target.value));
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter') {
                handleApply(valueFrom, valueTo);
              }
            }}
            value={valueTo}
            inputProps={{ min: 0 }} // Set the minimum value here
          />
        </FormControl>
      </CardContent>
    </Card>
  );
}
