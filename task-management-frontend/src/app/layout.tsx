import type { Viewport } from 'next';
import * as React from 'react';

import '@/styles/global.css';

import { Analytics } from '@/components/core/analytics';
import { I18nProvider } from '@/components/core/i18n-provider';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { Toaster } from '@/components/core/toaster';
import { config } from '@/config';
import { TimezoneProvider } from '@/contexts/auth/timezone';
import { UserProvider } from '@/contexts/auth/user-context';
import { SettingsProvider } from '@/contexts/settings';
import { applyDefaultSettings } from '@/lib/settings/apply-default-settings';
import { getSettings as getPersistedSettings } from '@/lib/settings/get-settings';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: config.site.themeColor,
} satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps): Promise<React.JSX.Element> {
  const settings = applyDefaultSettings(await getPersistedSettings());

  return (
    <html data-mui-color-scheme={settings.colorScheme} lang="en">
      <body>
        <Analytics>
          <LocalizationProvider>
            <TimezoneProvider>
              <UserProvider>
                <SettingsProvider settings={settings}>
                      <I18nProvider language="en">
                        <ThemeProvider>
                          {children}
                          {/* <SettingsButton /> */}
                          <Toaster richColors position="bottom-right" />
                        </ThemeProvider>
                      </I18nProvider>
                </SettingsProvider>
              </UserProvider>
            </TimezoneProvider>
          </LocalizationProvider>
        </Analytics>
      </body>
    </html>
  );
}
