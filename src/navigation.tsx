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
      { label: 'Пользователи', path: '/admin/users', icon: <Users /> },
      { label: 'Платежи', path: '/admin/payments', icon: <CreditCard /> },
      { label: 'Редакторы', path: '/admin/editors', icon: <UserCog /> },
    ],
  },
  {
    title: 'КОММУНИКАЦИЯ',
    items: [
      {
        label: 'CRM',
        icon: <Workflow />,
        children: [
          { label: 'Дашборд', path: '/admin/crm/dashboard', icon: <BarChart3 /> },
          { label: 'Пользователи', path: '/admin/users?view=crm', icon: <Users /> },
          { label: 'Сегменты', path: '/admin/crm/segments', icon: <Spline /> },
          { label: 'Кампании', path: '/admin/crm/campaigns', icon: <Megaphone /> },
        ],
      },
      {
        label: 'Поддержка',
        icon: <Headphones />,
        children: [
          { label: 'Тикеты', path: '/admin/support/tickets', icon: <BadgePercent /> },
          { label: 'FAQ', path: '/admin/support/faq', icon: <HelpCircle /> },
        ],
      },
    ],
  },
  {
    title: 'АНАЛИТИКА',
    items: [
      { label: 'KPI Dashboard', path: '/admin/kpi', icon: <BarChart3 /> },
      { label: 'Risk Engine', path: '/admin/risk', icon: <ShieldAlert /> },
      { label: 'Воронка и когорты', path: '/admin/funnel', icon: <PieChart /> },
    ],
  },
  {
    title: 'ПАРТНЁРСТВО',
    items: [{ label: 'Рефералы', path: '/admin/referrals', icon: <Network /> }],
  },
  {
    title: 'КОНТЕНТ',
    items: [
      { label: 'Турниры', path: '/admin/tournaments', icon: <Trophy /> },
      { label: 'Промо', path: '/admin/promo', icon: <Megaphone /> },
    ],
  },
];

export const ExpandIcon = ChevronDown;