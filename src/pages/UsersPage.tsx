import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  Filter,
  MessageSquarePlus,
  Megaphone,
  MoreHorizontal,
  Search,
  Tag,
} from 'lucide-react';

const segmentOptions = ['Все', 'Новички', 'Активные', 'VIP', 'Спящие', 'Риск'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const funnelStatusValues = ['signup', 'purchase', 'pass', 'funded', 'withdraw'] as const;
export type FunnelStatus = (typeof funnelStatusValues)[number];

const funnelStatusLabels: Record<FunnelStatus, string> = {
  signup: 'Регистрация',
  purchase: 'Покупка',
  pass: 'Пассивный',
  funded: 'Пополнил',
  withdraw: 'Вывод',
};

const funnelStatusColor: Record<FunnelStatus, string> = {
  signup: '#6e56cf',
  purchase: '#16a36b',
  pass: '#d97706',
  funded: '#2563eb',
  withdraw: '#dc3d3d',
};

type User = {
  id: string;
  name: string;
  email: string;
  segment: string;
  status: FunnelStatus;
  ltv: string;
  lastContact: string;
  note: string;
  initials: string;
  avatarColor: string;
};

const mockUsers: User[] = [
  {
    id: 'u-1001',
    name: 'Алексей Козлов',
    email: 'a.kozlov@example.com',
    segment: 'VIP',
    status: 'funded',
    ltv: '1 240 000 ₽',
    lastContact: 'сегодня, 10:42',
    note: 'Интересуется новой серией. Подготовить персональное предложение.',
    initials: 'АК',
    avatarColor: '#6e56cf',
  },
  {
    id: 'u-1002',
    name: 'Марина Волкова',
    email: 'marina.v@example.com',
    segment: 'Активные',
    status: 'purchase',
    ltv: '86 500 ₽',
    lastContact: 'вчера, 18:20',
    note: '',
    initials: 'МВ',
    avatarColor: '#2563eb',
  },
  {
    id: 'u-1003',
    name: 'Дмитрий Соколов',
    email: 'd.sokolov@example.com',
    segment: 'Спящие',
    status: 'pass',
    ltv: '12 300 ₽',
    lastContact: '3 дня назад',
    note: 'Не заходил 14 дней. Отправить реактивационную рассылку.',
    initials: 'ДС',
    avatarColor: '#d97706',
  },
  {
    id: 'u-1004',
    name: 'Елена Петрова',
    email: 'elena.p@example.com',
    segment: 'Новички',
    status: 'signup',
    ltv: '0 ₽',
    lastContact: 'сегодня, 09:15',
    note: 'Прошла онбординг, нужно дозвониться для встречи.',
    initials: 'ЕП',
    avatarColor: '#16a36b',
  },
  {
    id: 'u-1005',
    name: 'Игорь Белов',
    email: 'i.belov@example.com',
    segment: 'Риск',
    status: 'withdraw',
    ltv: '45 000 ₽',
    lastContact: 'неделю назад',
    note: 'Запросил вывод крупной суммы. Проверить документы.',
    initials: 'ИБ',
    avatarColor: '#dc3d3d',
  },
  {
    id: 'u-1006',
    name: 'Ольга Смирнова',
    email: 'o.smirnova@example.com',
    segment: 'Активные',
    status: 'purchase',
    ltv: '324 000 ₽',
    lastContact: 'сегодня, 11:03',
    note: 'Постоянная участница закрытых раундов.',
    initials: 'ОС',
    avatarColor: '#2563eb',
  },
  {
    id: 'u-1007',
    name: 'Роман Кузнецов',
    email: 'roman.k@example.com',
    segment: 'Спящие',
    status: 'pass',
    ltv: '8 100 ₽',
    lastContact: '2 недели назад',
    note: '',
    initials: 'РК',
    avatarColor: '#d97706',
  },
];

const operationalColumns = ['Пользователь', 'Email', 'Сегмент', 'Статус'];
const crmColumns = ['Имя', 'Email', 'Сегмент', 'Воронка', 'LTV', 'Последний контакт', 'Заметки менеджера'];

function useViewParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') === 'crm' ? 'crm' : 'operational';
  const setView = (value: 'operational' | 'crm') => {
    if (value === 'crm') {
      setSearchParams({ view: 'crm' }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };
  return { view, setView };
}

function Avatar({ user }: { user: User }) {
  return (
    <div className="avatar avatar-sm" style={{ background: user.avatarColor }}>
      {user.initials}
    </div>
  );
}

function FunnelBadge({ status }: { status: FunnelStatus }) {
  return (
    <span
      className="funnel-badge"
      style={{
        color: funnelStatusColor[status],
        background: `${funnelStatusColor[status]}16`,
      }}
    >
      <span className="funnel-dot" style={{ background: funnelStatusColor[status] }} />
      {funnelStatusLabels[status]}
    </span>
  );
}

function SegmentSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="segment-select">
      <button className="segment-select-trigger" type="button" onClick={() => setOpen((v) => !v)}>
        <span>{value}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="segment-select-menu">
          {segmentOptions
            .filter((opt) => opt !== 'Все')
            .map((opt) => (
              <button
                key={opt}
                type="button"
                className={`segment-select-option ${opt === value ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                {opt === value && <Check size={14} />}
                {opt}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function InlineNote({
  value,
  onSave,
}: {
  value: string;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (editing) {
    return (
      <div className="inline-note-editor">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onSave(draft);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSave(draft);
              setEditing(false);
            }
          }}
          autoFocus
          placeholder="Добавить заметку..."
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="inline-note"
      onClick={() => setEditing(true)}
      title="Нажмите для редактирования"
    >
      {value ? (
        <span className="inline-note-text">{value}</span>
      ) : (
        <span className="inline-note-placeholder">Добавить заметку...</span>
      )}
      <MessageSquarePlus size={14} />
    </button>
  );
}

export function UsersPage() {
  const { view, setView } = useViewParam();
  const navigate = useNavigate();
  const [users, setUsers] = useState(mockUsers);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.segment.toLowerCase().includes(q) ||
        funnelStatusLabels[u.status].toLowerCase().includes(q),
    );
  }, [users, search]);

  const selectedSegment = useMemo(() => {
    if (selected.size === 0) return null;
    const first = users.find((u) => selected.has(u.id));
    return first?.segment ?? null;
  }, [selected, users]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSegmentChange = (userId: string, segment: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, segment } : u)));
  };

  const handleNoteSave = (userId: string, note: string) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, note } : u)));
  };

  const handleCreateCampaign = () => {
    const segment = selectedSegment || 'Активные';
    navigate(`/admin/crm/campaigns?segment=${encodeURIComponent(segment)}&source=users`);
  };

  const isCrm = view === 'crm';

  return (
    <div className="page">
      <header className="page-header">
        <div className="page-header-left">
          <span className="eyebrow">{isCrm ? 'Коммуникация' : 'Управление'}</span>
          <h1>{isCrm ? 'CRM / Пользователи' : 'Пользователи'}</h1>
        </div>
        <div className="page-header-actions">
          <div className="view-toggle" role="tablist" aria-label="Вид таблицы пользователей">
            <button
              type="button"
              role="tab"
              aria-selected={!isCrm}
              className={!isCrm ? 'is-active' : ''}
              onClick={() => setView('operational')}
            >
              Операционный
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isCrm}
              className={isCrm ? 'is-active' : ''}
              onClick={() => setView('crm')}
            >
              CRM
            </button>
          </div>
          <div className="search-input-wrap">
            <Search size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск пользователей..."
              className="search-input"
            />
          </div>
          <button className="icon-button" type="button" aria-label="Фильтры">
            <Filter size={18} />
          </button>
          <button className="icon-button" type="button" aria-label="Действия">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {isCrm && selected.size > 0 && (
        <div className="crm-bulk-bar">
          <span className="crm-bulk-count">
            Выбрано: <strong>{selected.size}</strong>
          </span>
          <div className="crm-bulk-actions">
            <button className="secondary-button" type="button">
              <Tag size={16} />
              Добавить в сегмент
            </button>
            <button className="primary-button" type="button" onClick={handleCreateCampaign}>
              <Megaphone size={16} />
              Создать кампанию
            </button>
          </div>
        </div>
      )}

      <section className="panel">
        <div className="table crm-table">
          <div className="table-head">
            {isCrm ? (
              <>
                <label className="table-head-cell checkbox-cell">
                  <input
                    type="checkbox"
                    checked={selected.size > 0 && selected.size === filteredUsers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(new Set(filteredUsers.map((u) => u.id)));
                      } else {
                        setSelected(new Set());
                      }
                    }}
                  />
                </label>
                {crmColumns.map((col) => (
                  <div key={col} className="table-head-cell">
                    {col}
                  </div>
                ))}
              </>
            ) : (
              operationalColumns.map((col) => (
                <div key={col} className="table-head-cell">
                  {col}
                </div>
              )))
            }
          </div>
          <div className="table-body">
            {filteredUsers.map((user) =>
              isCrm ? (
                <div className="table-row crm-row" key={user.id}>
                  <label className="table-cell checkbox-cell">
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </label>
                  <div className="table-cell user-cell">
                    <Avatar user={user} />
                    <div>
                      <strong>{user.name}</strong>
                      <span>ID {user.id}</span>
                    </div>
                  </div>
                  <div className="table-cell email-cell">{user.email}</div>
                  <div className="table-cell segment-cell">
                    <SegmentSelect value={user.segment} onChange={(v) => handleSegmentChange(user.id, v)} />
                  </div>
                  <div className="table-cell funnel-cell">
                    <FunnelBadge status={user.status} />
                  </div>
                  <div className="table-cell ltv-cell">{user.ltv}</div>
                  <div className="table-cell contact-cell">{user.lastContact}</div>
                  <div className="table-cell note-cell">
                    <InlineNote value={user.note} onSave={(v) => handleNoteSave(user.id, v)} />
                  </div>
                </div>
              ) : (
                <div className="table-row operational-row" key={user.id}>
                  <div className="table-cell user-cell">
                    <Avatar user={user} />
                    <div>
                      <strong>{user.name}</strong>
                      <span>ID {user.id}</span>
                    </div>
                  </div>
                  <div className="table-cell email-cell">{user.email}</div>
                  <div className="table-cell segment-cell">
                    <span className="segment-pill">{user.segment}</span>
                  </div>
                  <div className="table-cell status-cell">
                    <FunnelBadge status={user.status} />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
