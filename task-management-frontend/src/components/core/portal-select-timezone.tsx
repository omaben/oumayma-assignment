import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { Clock } from '@phosphor-icons/react';
import _ from 'lodash';
import moment from 'moment-timezone';
import { useTimezoneSelect } from 'react-timezone-select';

import timezonesData from '@/types/timezones.json';
import { TimezoneContext } from '@/contexts/auth/timezone';

const labelStyle = 'abbrev';
const timezones = {
  ...timezonesData,
};

function formatOffsetAsHoursMinutes(offset: number): string {
  // Determine the sign (plus or minus)
  const sign = offset >= 0 ? '+' : '-';

  // Split the offset into hours and minutes
  const hours = Math.abs(Math.floor(offset));
  let minutes = Math.abs(Math.round((offset - hours) * 60));

  // Ensure that minutes are within the valid range (0 to 59)
  minutes = Math.min(59, Math.max(0, minutes));

  // Format the hours and minutes as "00:00"
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  // Check if the offset is 0 and return "00:00" in that case
  if (offset === 0) {
    return '00:00';
  } else {
    return `${sign}${formattedHours}:${formattedMinutes}`;
  }
}

const PortalSelectTimezone = () => {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle,
    timezones,
  });
  const timezoneList = _.uniqBy(options, 'offset');
  const { timezone, setTimezone } = React.useContext(TimezoneContext);
  const [selectedIndex, setSelectedIndex] = useState(_.findIndex(timezoneList, ['value', timezone?.timezone]));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number, value: string, abbrev?: string) => {
    setSelectedIndex(index);
    setAnchorEl(null);

    parseTimezone(value);

    const offset = moment.tz.zone(value)?.utcOffset(moment().valueOf());
    setTimezone({
      timezone: value,
      timezoneOffset: offset || 0,
      abbrev: abbrev || '',
    });
  };

  const menu = () =>
    timezoneList?.map((option, index) => (
      <MenuItem
        value={option.value}
        key={option.value}
        selected={index === selectedIndex}
        onClick={(event) => handleMenuItemClick(event, index, option.value, option.abbrev)}
      >
        {`${
          option.offset === 0 ? '+00:00' : option.offset && formatOffsetAsHoursMinutes(option.offset)
        } : ${option.abbrev}`}{' '}
        {option.value === Intl.DateTimeFormat().resolvedOptions().timeZone && '(Local)'}
      </MenuItem>
    ));

  return (
    <>
      <IconButton onClick={handleClick} size="medium">
        <Clock />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {menu()}
      </Menu>
    </>
  );
};

export default PortalSelectTimezone;
