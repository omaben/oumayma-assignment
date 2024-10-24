'use client';

import * as React from 'react';

import { CurrentTimezoneState, initialStateTimezone } from '@/types/common';

export interface TimezoneContextValue {
  timezone: CurrentTimezoneState;
  setTimezone: (timezone: CurrentTimezoneState) => void;
}

export const TimezoneContext = React.createContext<TimezoneContextValue>({
  timezone: initialStateTimezone,
  setTimezone: (timezone) => {
    timezone = initialStateTimezone;
  },
});

export interface TimezoneProviderProps {
  children: React.ReactNode;
  initialTimezone?: CurrentTimezoneState;
}

export function TimezoneProvider({ children, initialTimezone }: TimezoneProviderProps): React.JSX.Element {
  const [timezone, setTimezone] = React.useState<CurrentTimezoneState>(() => {
    if (typeof window !== 'undefined') {
      const savedTimezone = localStorage.getItem('timezone');
      return savedTimezone ? JSON.parse(savedTimezone) : initialTimezone;
    }
    return initialTimezone;
  });
  // Save the timezone to localStorage whenever it changes
  React.useEffect(() => {
    if (timezone) {
      localStorage.setItem('timezone', JSON.stringify(timezone));
    }
  }, [timezone]);

  return <TimezoneContext.Provider value={{ timezone, setTimezone }}>{children}</TimezoneContext.Provider>;
}

export const TimezoneConsumer = TimezoneContext.Consumer;
