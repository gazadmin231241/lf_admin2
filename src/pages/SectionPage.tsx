import { useLocation } from 'react-router-dom';
import { ArrowLeft, Database, Filter, MousePointerClick } from 'lucide-react';

type SectionPageProps = {
  title: string;
  description: string;
};

const stubs = [
  { icon: <Database size={22} />, label: 'Данные раздела' },
  { icon: <Filter size={22} />, label: 'Фильтры и поиск' },
  { icon: <MousePointerClick size={22} />, label: 'Действия' },
];

export function SectionPage({ title, description }: SectionPageProps) {
  const location = useLocation();
  const isCrmAlias = location.pathname === '/admin/users' && location.search === '?view=crm';
  const heading = isCrmAlias ? 'CRM / Пользователи' : title;

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-left">
          <span className="eyebrow">{isCrmAlias ? 'Коммуникация' : 'Раздел'}</span>
          <h1>{heading}</h1>
          <div className="page-header-meta">
            <ArrowLeft size={14} />
            <span>{location.pathname}{location.search}</span>
          </div>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h2>{heading}</h2>
          <span className="panel-badge">В разработке</span>
        </div>
        <p className="lead">{isCrmAlias ? 'CRM-представление общей базы пользователей.' : description}</p>
        <div className="stub-grid">
          {stubs.map(({ icon, label }) => (
            <div key={label}>
              <div className="stub-icon">{icon}</div>
              <strong>—</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="under-development">Раздел в разработке. Скоро здесь появится полный функционал.</p>
      </section>
    </div>
  );
}
