import { useLocation } from 'react-router-dom';

type SectionPageProps = {
  title: string;
  description: string;
};

export function SectionPage({ title, description }: SectionPageProps) {
  const location = useLocation();
  const isCrmAlias = location.pathname === '/management/users' && location.search === '?view=crm';
  const heading = isCrmAlias ? 'CRM / Пользователи' : title;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">{isCrmAlias ? 'КОММУНИКАЦИЯ' : 'РАЗДЕЛ'}</span>
          <h1>{heading}</h1>
        </div>
      </header>

      <section className="panel">
        <div className="panel-head">
          <h2>{heading}</h2>
          <span>{location.pathname}{location.search}</span>
        </div>
        <p className="lead">{isCrmAlias ? 'CRM-представление общей базы пользователей.' : description}</p>
        <div className="stub-grid">
          <div>
            <strong>Очередь</strong>
            <span>24 элемента требуют внимания</span>
          </div>
          <div>
            <strong>Статус</strong>
            <span>Данные готовы к подключению</span>
          </div>
          <div>
            <strong>Ответственный</strong>
            <span>Команда администрирования</span>
          </div>
        </div>
      </section>
    </div>
  );
}
