import { Activity, CircleDollarSign, Users, WalletCards } from 'lucide-react';

const metrics = [
  { label: 'Активные пользователи', value: '42 816', change: '+12,4%', icon: <Users /> },
  { label: 'Выручка за месяц', value: '18,7 млн ₽', change: '+8,1%', icon: <CircleDollarSign /> },
  { label: 'Конверсия оплат', value: '7,8%', change: '+1,6%', icon: <WalletCards /> },
  { label: 'Risk score', value: '3,2%', change: '-0,9%', icon: <Activity /> },
];

const rows = [
  ['Онбординг', '64%', '+5,1%', 'В норме'],
  ['Платёжная воронка', '7,8%', '+1,6%', 'В норме'],
  ['Повторные покупки', '22%', '-2,4%', 'Нужен фокус'],
  ['Обращения в поддержку', '318', '+14%', 'Рост нагрузки'],
];

export function KpiDashboard() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">АНАЛИТИКА</span>
          <h1>KPI Dashboard</h1>
        </div>
        <button className="primary-button" type="button">Обновить данные</button>
      </header>

      <section className="metric-grid" aria-label="Ключевые показатели">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <div className="metric-icon">{metric.icon}</div>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <em>{metric.change}</em>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Состояние продукта</h2>
          <span>Q2 2026</span>
        </div>
        <div className="table">
          {rows.map(([name, value, change, status]) => (
            <div className="table-row" key={name}>
              <strong>{name}</strong>
              <span>{value}</span>
              <span className={change.startsWith('+') ? 'good' : 'warn'}>{change}</span>
              <span>{status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
