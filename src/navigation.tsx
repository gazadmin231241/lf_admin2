/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import {
  BadgePercent,
  BarChart3,
  ChevronDown,
  CreditCard,
  Headphones,
  HelpCircle,
  Megaphone,
  Network,
  PieChart,
  ShieldAlert,
  Spline,
  Trophy,
  UserCog,
  Users,
  Workflow,
} from 'lucide-react';

export type NavigationItem = {
  label: string;
  path?: string;
  icon: ReactNode;
  children?: NavigationItem[];
};

export type NavigationGroup = {
  title: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    title: 'УПРАВЛЕНИЕ',
    items: [
      { label: 'Пользователи', path: '/management/users', icon: <Users /> },
      { label: 'Платежи', path: '/management/payments', icon: <CreditCard /> },
      { label: 'Редакторы', path: '/management/editors', icon: <UserCog /> },
    ],
  },
  {
    title: 'КОММУНИКАЦИЯ',
    items: [
      {
        label: 'CRM',
        icon: <Workflow />,
        children: [
          { label: 'Дашборд', path: '/communication/crm/dashboard', icon: <BarChart3 /> },
          { label: 'Пользователи', path: '/management/users?view=crm', icon: <Users /> },
          { label: 'Сегменты', path: '/communication/crm/segments', icon: <Spline /> },
          { label: 'Кампании', path: '/communication/crm/campaigns', icon: <Megaphone /> },
        ],
      },
      {
        label: 'Поддержка',
        icon: <Headphones />,
        children: [
          { label: 'Тикеты', path: '/communication/support/tickets', icon: <BadgePercent /> },
          { label: 'FAQ', path: '/communication/support/faq', icon: <HelpCircle /> },
        ],
      },
    ],
  },
  {
    title: 'АНАЛИТИКА',
    items: [
      { label: 'KPI Dashboard', path: '/analytics/kpi', icon: <BarChart3 /> },
      { label: 'Risk Engine', path: '/analytics/risk', icon: <ShieldAlert /> },
      { label: 'Воронка и когорты', path: '/analytics/funnel', icon: <PieChart /> },
    ],
  },
  {
    title: 'ПАРТНЁРСТВО',
    items: [{ label: 'Рефералы', path: '/partnership/referrals', icon: <Network /> }],
  },
  {
    title: 'КОНТЕНТ',
    items: [
      { label: 'Турниры', path: '/content/tournaments', icon: <Trophy /> },
      { label: 'Промо', path: '/content/promo', icon: <Megaphone /> },
    ],
  },
];

export const ExpandIcon = ChevronDown;
