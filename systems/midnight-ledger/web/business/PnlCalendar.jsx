import { DataPanel } from './DataPanel.jsx';

export function LedgerPnlCalendar({ month, days = [], selectedDate, onSelectDate, ...state }) {
  const valid = /^\d{4}-(0[1-9]|1[0-2])$/.test(month ?? '');
  const date = valid ? new Date(`${month}-01T12:00:00Z`) : null;
  const offset = date ? (date.getUTCDay() + 6) % 7 : 0;
  const count = date ? new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate() : 0;
  const Cell = onSelectDate ? 'button' : 'span';
  return <DataPanel title="盈亏日历" action={month} className="ml-terminal__calendar" empty={!valid} {...state}>
    <div className="ml-calendar-week">{['一','二','三','四','五','六','日'].map(day => <span key={day}>{day}</span>)}</div>
    <div className="ml-calendar-grid">{Array.from({length:offset}, (_,i) => <span key={`offset-${i}`}/>)}{Array.from({length:count}, (_,i) => {
      const key = `${month}-${String(i+1).padStart(2,'0')}`;
      const day = days.find(item => item.date === key);
      const value = Number.isFinite(day?.value) ? day.value : null;
      const summary = value === null ? '无记录' : `${value > 0 ? '+' : ''}${value}`;
      return <Cell key={key} type={onSelectDate ? 'button' : undefined} data-tone={value === null || value === 0 ? 'neutral' : value > 0 ? 'positive' : 'negative'} aria-label={`${key}，${summary}`} aria-pressed={onSelectDate ? selectedDate === key : undefined} onClick={onSelectDate ? () => onSelectDate(key) : undefined}>{i+1}</Cell>;
    })}</div>
  </DataPanel>;
}
