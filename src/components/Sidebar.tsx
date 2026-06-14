import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ExpandIcon, navigationGroups, type NavigationItem } from '../navigation';

function normalize(path = '') {
  return path.split('?')[0];
}

function isItemActive(item: NavigationItem, pathname: string, search: string) {
  if (!item.path) return false;
  const [path, query] = item.path.split('?');

  if (pathname !== path) return false;
  if (query) return search === `?${query}`;

  // For /admin/users without query, only match when there is no ?view=crm
  return pathname !== '/admin/users' || search !== '?view=crm';
}

function hasActiveChild(item: NavigationItem, pathname: string, search: string) {
  return item.children?.some((child) => isItemActive(child, pathname, search)) ?? false;
}

function SidebarItem({ item, nested = false }: { item: NavigationItem; nested?: boolean }) {
  const location = useLocation();
  const shouldStartOpen = hasActiveChild(item, location.pathname, location.search);
  const [open, setOpen] = useState(shouldStartOpen);
  const hasChildren = Boolean(item.children?.length);
  const active = isItemActive(item, location.pathname, location.search);

  const icon = <span className="nav-icon">{item.icon}</span>;

  if (hasChildren) {
    return (
      <div>
        <button
          className={`nav-row ${open ? 'is-open' : ''}`}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
        >
          {icon}
          <span>{item.label}</span>
          <ExpandIcon className="expand-icon" aria-hidden="true" />
        </button>
        {open && (
          <div className="subnav">
            {item.children!.map((child) => (
              <SidebarItem key={child.label} item={child} nested />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      className={`nav-row ${nested ? 'is-nested' : ''} ${active ? 'is-active' : ''}`}
      to={item.path ?? '/'}
      end={normalize(item.path) === '/admin/kpi'}
    >
      {icon}
      <span>{item.label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Главная навигация">
      <div className="brand">
        <div className="brand-mark">L</div>
        <div>
          <strong>LF Admin</strong>
          <span>Панель управления</span>
        </div>
      </div>
      <nav className="nav">
        {navigationGroups.map((group) => (
          <section className="nav-group" key={group.title}>
            <h2>{group.title}</h2>
            {group.items.map((item) => (
              <SidebarItem key={item.label} item={item} />
            ))}
          </section>
        ))}
      </nav>
    </aside>
  );
}