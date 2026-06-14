import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { KpiDashboard } from './pages/KpiDashboard';
import { SectionPage } from './pages/SectionPage';

const pages = [
  ['management/users', 'Пользователи', 'Единая база пользователей, ролей и статусов.'],
  ['management/payments', 'Платежи', 'Транзакции, возвраты, холды и спорные операции.'],
  ['management/editors', 'Редакторы', 'Доступы команды и зоны ответственности.'],
  ['communication/crm/dashboard', 'CRM / Дашборд', 'Сводка коммуникаций, сегментов и кампаний.'],
  ['communication/crm/segments', 'Сегменты', 'Аудитории, фильтры и правила попадания.'],
  ['communication/crm/campaigns', 'Кампании', 'Рассылки, сценарии и результаты запусков.'],
  ['communication/support/tickets', 'Тикеты', 'Очередь обращений и SLA по поддержке.'],
  ['communication/support/faq', 'FAQ', 'База ответов и статусы публикации.'],
  ['analytics/risk', 'Risk Engine', 'Сигналы риска, алерты и ручная проверка.'],
  ['analytics/funnel', 'Воронка и когорты', 'Конверсии, удержание и поведение групп.'],
  ['partnership/referrals', 'Рефералы', 'Партнёрские ссылки, начисления и качество трафика.'],
  ['content/tournaments', 'Турниры', 'Расписание, статусы и промо-блоки турниров.'],
  ['content/promo', 'Промо', 'Акции, баннеры и условия публикации.'],
] as const;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/analytics/kpi" replace />} />
        <Route path="analytics/kpi" element={<KpiDashboard />} />
        {pages.map(([path, title, description]) => (
          <Route
            key={path}
            path={path}
            element={<SectionPage title={title} description={description} />}
          />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/analytics/kpi" replace />} />
    </Routes>
  );
}
