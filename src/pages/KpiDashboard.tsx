import { Activity, CircleDollarSign, Filter, RefreshCw, TrendingDown, TrendingUp, Users, WalletCards } from 'lucide-react';

type Metric = {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  accent: string;
  accentSoft: string;
  series: number[];
};

const metrics: Metric[] = [
  {
    label: 'Активные пользователи',
    value: '42 816',
    change: '+12,4%',
    icon: <Users />,
    accent: '#7651d9',
    accentSoft: 'rgba(118, 81, 217, 0.16)',
    series: [30, 42, 38, 50, 55, 68, 72, 80],
  },
  {
    label: 'Выручка за месяц',
    value: '18,7 млн ₽',
    change: '+8,1%',
    icon: <CircleDollarSign />,
    accent: '#2563eb',
    accentSoft: 'rgba(37, 99, 235, 0.14)',
    series: [45, 52, 48, 60, 58, 70, 75, 82],
  },
  {
    label: 'Конверсия оплат',
    value: '7,8%',
    change: '+1,6%',
    icon: <WalletCards />,
    accent: '#1f9d65',
    accentSoft: 'rgba(31, 157, 101, 0.14)',
    series: [55, 58, 54, 62, 60, 65, 68, 74],
  },
  {
    label: 'Risk score',
    value: '3,2%',
    change: '-0,9%',
    icon: <Activity />,
    accent: '#d6811c',
    accentSoft: 'rgba(214, 129, 28, 0.14)',
    series: [80, 75, 70, 62, 55, 48, 42, 38],
  },
];

const rows = [
  { name: 'Онбординг', value: '64%', change: '+5,1%', status: 'В норме', statusType: 'good', progress: 64 },
  { name: 'Платёжная воронка', value: '7,8%', change: '+1,6%', status: 'В норме', statusType: 'good', progress: 78 },
  { name: 'Повторные покупки', value: '22%', change: '-2,4%', status: 'Нужен фокус', statusType: 'warn', progress: 22 },
  { name: 'Обращения в поддержку', value: '318', change: '+14%', status: 'Рост нагрузки', statusType: 'warn', progress: 73 },
];

function MiniSparkline({ data, color, fill }: { data: number[]; color: string; fill: string }) {
  const width = 100;
  const height = 36;
  const padding = 2;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);

  const points = data.map((value, index) => {
    const x = index * step;
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPoints = `${points[0].split(',')[0]},${height} ${points.join(' ')} ${points[points.length - 1].split(',')[0]},${height}`;

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polygon points={areaPoints} fill={fill} />
      <polyline
        fill="none"
        points={points.join(' ')}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  const isPositive = metric.change.startsWith('+');
  return (
    <article
      className="metric-card"
      key={metric.label}
      style={{ '--metric-accent': metric.accent, '--metric-accent-soft': metric.accentSoft } as React.CSSProperties}
    >
      <div className="metric-card-top">
        <div className="metric-icon">{metric.icon}</div>
        <MiniSparkline data={metric.series} color={metric.accent} fill={metric.accentSoft} />
      </div>
      <div className="metric-card-body">
        <span>{metric.label}</span>
        <strong>{metric.value}</strong>
      </div>
      <div className={`metric-change ${isPositive ? 'is-positive' : 'is-negative'}`}>
        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{metric.change}</span>
        <span className="metric-change-label">vs прошлый месяц</span>
      </div>
    </article>
  );
}

export function KpiDashboard() {
  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-left">
          <span className="eyebrow">Аналитика</span>
          <h1>KPI Dashboard</h1>
        </div>
        <div className="page-header-actions">
          <button className="icon-button" type="button" aria-label="Фильтры">
            <Filter size={18} />
          </button>
          <button className="primary-button" type="button">
            <RefreshCw size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Обновить данные
          </button>
        </div>
      </header>

      <section className="metric-grid" aria-label="Ключевые показатели">
        {metrics.map((metric) => (
          <MetricCard metric={metric} key={metric.label} />
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <div className="panel-head-left">
            <h2>Состояние продукта</h2>
            <span className="panel-subtitle">Текущие тренды и зоны внимания</span>
          </div>
          <span className="panel-badge">Q2 2026</span>
        </div>
        <div className="table">
          {rows.map(({ name, value, change, status, statusType, progress }) => (
            <div className="table-row" key={name}>
              <div className="table-cell table-cell-name">
                <strong>{name}</strong>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progress}%`,
                      '--progress-color': statusType === 'good' ? 'var(--green)' : 'var(--orange)',
                    } as React.CSSProperties}
                  />
                </div>
              </div>
              <span className="table-cell-value">{value}</span>
              <span className={`table-cell-change ${change.startsWith('+') ? 'good' : 'warn'}`}>{change}</span>
              <span className={`status-badge status-${statusType}`}>{status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
