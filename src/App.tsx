import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { KpiDashboard } from './pages/KpiDashboard';
import { SectionPage } from './pages/SectionPage';

type SectionRoute = {
  path: string;
  title: string;
  description: string;
};

const sectionRoutes: SectionRoute[] = [
  {
    path: 'users',
    title: 'Пользователи',
    description: 'Единая база пользователей, ролей и статусов.',
  },
  {
    path: 'payments',
    title: 'Платежи',
    description: 'Транзакции, возвраты, холды и спорные операции.',
  },
  { path: 'editors', title: 'Редакторы', description: 'Доступы команды и зоны ответственности.' },
  {
    path: 'crm/dashboard',
    title: 'CRM / Дашборд',
    description: 'Сводка коммуникаций, сегментов и кампаний.',
  },
  { path: 'crm/segments', title: 'Сегменты', description: 'Аудитории, фильтры и правила попадания.' },
  { path: 'crm/campaigns', title: 'Кампании', description: 'Рассылки, сценарии и результаты запусков.' },
  { path: 'support/tickets', title: 'Тикеты', description: 'Очередь обращений и SLA по поддержке.' },
  { path: 'support/faq', title: 'FAQ', description: 'База ответов и статусы публикации.' },
  { path: 'risk', title: 'Risk Engine', description: 'Сигналы риска, алерты и ручная проверка.' },
  { path: 'funnel', title: 'Воронка и когорты', description: 'Конверсии, удержание и поведение групп.' },
  {
    path: 'referrals',
    title: 'Рефералы',
    description: 'Партнёрские ссылки, начисления и качество трафика.',
  },
  { path: 'tournaments', title: 'Турниры', description: 'Расписание, статусы и промо-блоки турниров.' },
  { path: 'promo', title: 'Промо', description: 'Акции, баннеры и условия публикации.' },
];

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<Navigate to="/admin/kpi" replace />} />
        <Route path="kpi" element={<KpiDashboard />} />
        {sectionRoutes.map(({ path, title, description }) => (
          <Route
            key={path}
            path={path}
            element={<SectionPage title={title} description={description} />}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/admin/kpi" replace />} />
    </Routes>
  );
}
