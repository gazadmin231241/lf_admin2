import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import App from '../App';

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

/**
 * Acceptance criteria from issue #2:
 * 1. Sidebar on left with 5 navigation groups, content on right
 * 2. Each group is a collapsible/expandable heading
 * 3. CRM and Support are groups with sub-items, expand by click
 * 4. KPI Dashboard is default route (/admin or /admin/kpi)
 * 5. CRM→Пользователи leads to /admin/users?view=crm
 * 6. All sections have routes, show placeholder "Раздел в разработке"
 * 7. All UI text in Russian
 * 8. Navigation works without page reload (SPA)
 */

describe('AC-1: Sidebar with 5 navigation groups', () => {
  it('renders 5 navigation groups in the sidebar', () => {
    renderApp('/admin/kpi');
    const sidebar = screen.getByRole('complementary', { name: /навигация/i });
    expect(sidebar).toBeInTheDocument();

    const groups = within(sidebar).getAllByRole('heading', { level: 2 });
    const groupTitles = groups.map((g) => g.textContent);
    expect(groupTitles).toEqual([
      'УПРАВЛЕНИЕ',
      'КОММУНИКАЦИЯ',
      'АНАЛИТИКА',
      'ПАРТНЁРСТВО',
      'КОНТЕНТ',
    ]);
  });

  it('renders sidebar and main content area', () => {
    renderApp('/admin/kpi');
    const sidebar = screen.getByRole('complementary', { name: /навигация/i });
    const main = screen.getByRole('main');
    expect(sidebar).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });
});

describe('AC-2: Each group is a collapsible heading', () => {
  it('УПРАВЛЕНИЕ group items are visible by default (no expand needed)', () => {
    renderApp('/admin/kpi');
    expect(screen.getByRole('link', { name: /пользователи/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /платежи/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /редакторы/i })).toBeInTheDocument();
  });

  it('АНАЛИТИКА group items are visible', () => {
    renderApp('/admin/kpi');
    expect(screen.getByRole('link', { name: /kpi dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /risk engine/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /воронка и когорты/i })).toBeInTheDocument();
  });
});

describe('AC-3: CRM and Support expand by click', () => {
  it('CRM sub-items are hidden by default and shown after click', async () => {
    const user = userEvent.setup();
    renderApp('/admin/kpi');

    // CRM sub-items should NOT be visible initially
    expect(screen.queryByRole('link', { name: /^дашборд$/i })).not.toBeInTheDocument();

    // Click CRM to expand
    const crmButton = screen.getByRole('button', { name: /crm/i });
    await user.click(crmButton);

    // Now CRM sub-items should be visible
    expect(screen.getByRole('link', { name: /дашборд/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /сегменты/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /кампании/i })).toBeInTheDocument();
  });

  it('Support sub-items are hidden by default and shown after click', async () => {
    const user = userEvent.setup();
    renderApp('/admin/kpi');

    // Support sub-items should NOT be visible initially
    expect(screen.queryByRole('link', { name: /тикеты/i })).not.toBeInTheDocument();

    const supportButton = screen.getByRole('button', { name: /поддержка/i });
    await user.click(supportButton);

    expect(screen.getByRole('link', { name: /тикеты/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /faq/i })).toBeInTheDocument();
  });

  it('CRM expands to show Пользователи link pointing to ?view=crm', async () => {
    const user = userEvent.setup();
    renderApp('/admin/kpi');

    const crmButton = screen.getByRole('button', { name: /crm/i });
    await user.click(crmButton);

    // There are two "Пользователи" links — the CRM nested one should point to ?view=crm
    const usersLinks = screen.getAllByRole('link', { name: /пользователи/i });
    const crmUsersLink = usersLinks.find((link) =>
      link.getAttribute('href')?.includes('?view=crm'),
    );
    expect(crmUsersLink).toBeTruthy();
    expect(crmUsersLink!.getAttribute('href')).toBe('/admin/users?view=crm');
  });

  it('collapsible groups can be toggled closed', async () => {
    const user = userEvent.setup();
    renderApp('/admin/kpi');

    const crmButton = screen.getByRole('button', { name: /crm/i });
    // Expand
    await user.click(crmButton);
    expect(screen.getByRole('link', { name: /дашборд/i })).toBeInTheDocument();

    // Collapse
    await user.click(crmButton);
    expect(screen.queryByRole('link', { name: /дашборд/i })).not.toBeInTheDocument();
  });
});

describe('AC-4: KPI Dashboard is default route', () => {
  it('redirects /admin to KPI Dashboard', () => {
    renderApp('/admin');
    expect(screen.getByRole('heading', { level: 1, name: /kpi dashboard/i })).toBeInTheDocument();
  });

  it('renders KPI Dashboard at /admin/kpi', () => {
    renderApp('/admin/kpi');
    expect(screen.getByRole('heading', { level: 1, name: /kpi dashboard/i })).toBeInTheDocument();
  });
});

describe('AC-5: CRM→Пользователи leads to /admin/users?view=crm', () => {
  it('CRM users link points to /admin/users?view=crm', async () => {
    const user = userEvent.setup();
    renderApp('/admin/kpi');

    const crmButton = screen.getByRole('button', { name: /crm/i });
    await user.click(crmButton);

    const usersLinks = screen.getAllByRole('link', { name: /пользователи/i });
    const crmUsersLink = usersLinks.find((link) =>
      link.getAttribute('href')?.includes('?view=crm'),
    );
    expect(crmUsersLink).toBeTruthy();
    expect(crmUsersLink!.getAttribute('href')).toBe('/admin/users?view=crm');
  });
});

describe('AC-6: All sections have routes showing placeholder', () => {
  const sectionRoutes = [
    { path: '/admin/users', title: /пользователи/i },
    { path: '/admin/payments', title: /платежи/i },
    { path: '/admin/editors', title: /редакторы/i },
    { path: '/admin/crm/dashboard', title: /crm/i },
    { path: '/admin/crm/segments', title: /сегменты/i },
    { path: '/admin/crm/campaigns', title: /кампании/i },
    { path: '/admin/support/tickets', title: /тикеты/i },
    { path: '/admin/support/faq', title: /faq/i },
    { path: '/admin/risk', title: /risk engine/i },
    { path: '/admin/funnel', title: /воронка/i },
    { path: '/admin/referrals', title: /рефералы/i },
    { path: '/admin/tournaments', title: /турниры/i },
    { path: '/admin/promo', title: /промо/i },
  ];

  it.each(sectionRoutes)('route $path renders placeholder page', ({ path, title }) => {
    renderApp(path);
    expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(/раздел в разработке/i)).toBeInTheDocument();
  });
});

describe('AC-7: All UI text in Russian', () => {
  it('sidebar brand text is in Russian', () => {
    renderApp('/admin/kpi');
    expect(screen.getByText('Панель управления')).toBeInTheDocument();
  });

  it('navigation group titles are in Russian', () => {
    renderApp('/admin/kpi');
    expect(screen.getByRole('heading', { name: 'УПРАВЛЕНИЕ' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'КОММУНИКАЦИЯ' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'АНАЛИТИКА' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'ПАРТНЁРСТВО' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'КОНТЕНТ' })).toBeInTheDocument();
  });
});

describe('AC-8: Navigation works without page reload (SPA)', () => {
  it('clicking a nav link updates the content area', async () => {
    const user = userEvent.setup();
    renderApp('/admin/kpi');

    // Initially on KPI Dashboard
    expect(screen.getByRole('heading', { level: 1, name: /kpi dashboard/i })).toBeInTheDocument();

    // Click on Платежи
    const paymentsLink = screen.getByRole('link', { name: /платежи/i });
    await user.click(paymentsLink);

    // Content should update to show Платежи page
    expect(screen.getByRole('heading', { level: 1, name: /платежи/i })).toBeInTheDocument();
    // KPI Dashboard should no longer be shown
    expect(screen.queryByRole('heading', { level: 1, name: /kpi dashboard/i })).not.toBeInTheDocument();
  });
});