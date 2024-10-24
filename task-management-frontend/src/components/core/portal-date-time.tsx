import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import moment from 'moment-timezone';

import { TimezoneContext } from '@/contexts/auth/timezone';

interface PortalDateTimeProps {
  timestamp: string;
  format?: 'milliseconds' | 'unix';
  timezoneAbrevText?: boolean;
}

const PortalDateTime = ({ timestamp, format, timezoneAbrevText, ...props }: PortalDateTimeProps & TypographyProps) => {
  const { timezone } = React.useContext(TimezoneContext);
  const timezoneData = timezone?.timezone || 'UTC';
  const timezoneAbrev = timezone?.abbrev || 'GMT';
  const dateAndTime = formatTimestamp(timestamp, timezoneData, format);

  return (
    <Typography variant="caption" {...props}>
      {dateAndTime} {timezoneAbrevText && <Typography variant="caption">{timezoneAbrev}</Typography>}
    </Typography>
  );
};

const formatTimestamp = (timestamp: string, timezone: string, format?: 'milliseconds' | 'unix') => {
  // Define a list of possible acceptable date formats
  const formats = [
    moment.ISO_8601,              // ISO8601 format
    'YYYY-MM-DDTHH:mm:ssZ',       // Example format: '2024-09-03T11:22:34+04:00'
    'YYYY-MM-DD HH:mm:ss',        // Example format: '2024-09-03 11:22:34'
    'ddd MMM DD YYYY HH:mm:ss ZZ' // Example format: 'Tue Sep 03 2024 15:22:34 +0400'
  ];

  // Try parsing the timestamp with the formats list (without strict mode)
  const parsedTimestamp = moment(timestamp, formats);
  
  if (parsedTimestamp.isValid()) {
    let time;
    switch (format) {
      case 'unix':
        time = parsedTimestamp.tz(timezone).format('x'); // Unix timestamp in milliseconds
        break;
      case 'milliseconds':
        time = parsedTimestamp.tz(timezone).format('YYYY-MM-DD HH:mm:ss:SSS'); // Milliseconds format
        break;
      default:
        time = parsedTimestamp.tz(timezone).format('YYYY-MM-DD HH:mm:ss'); // Default format
    }
    return time;
  } else {
    return '--'; // Return '--' for invalid timestamps
  }
};

export default PortalDateTime;
