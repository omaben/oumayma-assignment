import { Link } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowRight } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import RouterLink from 'next/link';
import * as React from 'react';

import { paths } from '@/paths';

export interface SummaryProps {
  amount: number;
  diff: number;
  icon: Icon;
  title: string;
  TRX: number;
  TRXInUSD: number;
  USDT: number;
  USDTInUSD: number;
  titleLink: string;
  link: string;
}

export function SummaryWithDetails({ amount, diff, icon: Icon, title, TRX, TRXInUSD, USDT, USDTInUSD, link, titleLink }: SummaryProps): React.JSX.Element {
  return (
    <Card sx={{ mb: 0, height: 360 }}>
      <CardContent>
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              '--Avatar-size': '48px',
              bgcolor: 'var(--mui-palette-background-paper)',
              boxShadow: 'var(--mui-shadows-8)',
              color: 'var(--mui-palette-text-primary)',
            }}
          >
            <Icon fontSize="var(--icon-fontSize-lg)" />
          </Avatar>
          <div>
            <Typography color="text.secondary" variant="body1">
              {title}
            </Typography>
            {/* <Typography variant="h3">{new Intl.NumberFormat('en-US').format(amount)}</Typography> */}
          </div>
        </Stack>
      </CardContent>
      <Box sx={{ p: '16px', pt: 0 }}>
        <Stack direction="column" spacing={1}>
          <Typography color="text.secondary" variant="body2">
            Total Balance
          </Typography>
          <Typography variant="h5">${new Intl.NumberFormat('en-US').format(amount)}</Typography>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: '8px' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ width: '24px', height: '24px' }} src={`/assets/crypto/trx.png`} />
          <Stack direction="row" spacing={0} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
            <Typography sx={{ flex: '1 1 auto' }} variant="subtitle2">
              TRX
            </Typography>
            <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }} variant="body2" textAlign={'right'}>
              <Typography color={'var(--mui-palette-success-main)'}>
                {new Intl.NumberFormat('en-US').format(TRX)}
              </Typography>
              <Typography color={'text.secondary'}>${new Intl.NumberFormat('en-US').format(TRXInUSD)}</Typography>
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: '8px' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ width: '24px', height: '24px' }} src={`/assets/crypto/usdt.png`} />
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
            <Typography sx={{ flex: '1 1 auto' }} variant="subtitle2">
              USDT
            </Typography>
            <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }} variant="body2" textAlign={'right'}>
              <Typography color={'var(--mui-palette-success-main)'}>
                {new Intl.NumberFormat('en-US').format(USDT)}
              </Typography>
              <Typography color={'text.secondary'}>${new Intl.NumberFormat('en-US').format(USDTInUSD)}</Typography>
            </Typography>
          </Stack>
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: '16px' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={link}
            sx={{ alignItems: 'center', display: 'flex', gap: 1 }}
            variant="subtitle2"
          >
            {titleLink} <ArrowRight />
          </Link>
        </Stack>
      </Box>
    </Card>
  );
}
