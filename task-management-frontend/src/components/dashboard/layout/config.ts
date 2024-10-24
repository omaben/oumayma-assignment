import { paths } from '@/paths';
import type { NavItemConfig } from '@/types/nav';

// NOTE: We did not use React Components for Icons, because
//  you may one to get the config from the server.

// NOTE: First level elements are groups.

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [
    {
      key: 'tasks',
      title: '',
      items: [
        {
          key: 'task', title: 'Tasks', href: paths.dashboard.home, icon: 'house'
        },
      ],
    },
    {
      key: 'general',
      title: '',
      items: [
      ],
    },
  ],
} satisfies LayoutConfig;
