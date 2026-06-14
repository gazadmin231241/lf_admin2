# Design QA

final result: passed

Проверено:

- Дефолтный маршрут открывает `KPI Dashboard`.
- `CRM` раскрывается по клику и показывает `Дашборд`, `Пользователи`, `Сегменты`, `Кампании`.
- `CRM → Пользователи` ведёт на `/management/users?view=crm` и отображает заголовок `CRM / Пользователи`.
- `Поддержка` раскрывается по клику и показывает `Тикеты`, `FAQ`.
- Headless Chromium screenshot: `/tmp/lf-admin2-kpi.png`.
