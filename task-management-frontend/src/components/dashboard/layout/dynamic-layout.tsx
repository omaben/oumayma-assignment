'use client';

import * as React from 'react';

import { useSettings } from '@/hooks/use-settings';

import { HorizontalLayout } from './horizontal/horizontal-layout';
import { VerticalLayout } from './vertical/vertical-layout';

export interface DynamicLayoutProps {
  children: React.ReactNode;
}

export function DynamicLayout({ children }: DynamicLayoutProps): React.JSX.Element {
  const { settings } = useSettings();
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const opId = searchParams?.get('opId') || '';

  React.useEffect(() => {
  }, []);
  return settings.layout === 'horizontal' ? (
    <HorizontalLayout>{children}</HorizontalLayout>
  ) : (
    <VerticalLayout>{children}</VerticalLayout>
  );
}
