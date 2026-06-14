import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

function TopBar() {
  const now = new Date();
  const date = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const weekday = now.toLocaleDateString('ru-RU', { weekday: 'long' });

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <span className="top-bar-date">{date}</span>
        <span className="top-bar-weekday">{weekday}</span>
      </div>
      <div className="top-bar-right">
        <div className="top-bar-user">
          <div className="avatar">АМ</div>
          <div className="top-bar-user-info">
            <strong>Админ М.</strong>
            <span>Администратор</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Layout() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
}
