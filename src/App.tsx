import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { KpiDashboard } from './pages/KpiDashboard';
import { SectionPage } from './pages/SectionPage';

const pages = [
  ['users', 'Пользователи', 'Единая база пользователей, ролей и статусов.'] as const,
  ['payments', 'Платежи', 'Транзакции, возвраты, холды и спорные операции.'] as const,
  ['editors', 'Редакторы', 'Доступы команды и зоны ответственности.'] as const,
  ['crm/dashboard', 'CRM / Дашборд', 'Сводка коммуникаций, сегментов и кампаний.'] as const,
  ['crm/segments', 'Сегменты', 'Аудитории, фильтры и правила попадания.'] as const,
  ['crm/campaigns', 'Кампании', 'Рассылки, сценарии и результаты запусков.'] as const,
  ['support/tickets', 'Тикеты', 'Очередь обращений и SLA по поддержке.'] as const,
  ['support/faq', 'FAQ', 'База ответов и статусы публикации.'] as const,
  ['risk', 'Risk Engine', 'Сигналы риска, алерты и ручная проверка.'] as const,
  ['funnel', 'Воронка и когорты', 'Конверсии, удержание и поведение групп.'] as const,
  ['referrals', 'Рефералы', 'Партнёрские ссылки, начисления и качество трафика.'] as const,
  ['tournaments', 'Турниры', 'Расписание, статусы и промо-блоки турниров.'] as const,
  ['promo', 'Промо', 'Акции, баннеры и условия публикации.'] as const,
];

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<Layout />}>
        <Route index element={<Navigate to="/admin/kpi" replace />} />
        <Route path="kpi" element={<KpiDashboard />} />
        {pages.map(([path, title, description]) => (
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