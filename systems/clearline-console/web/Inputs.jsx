import { useId, useState } from "react";
function Hint({
  id,
  error,
  hint
}) {
  return error || hint ? <small id={id} role={error ? "alert" : undefined}>{error || hint}</small> : null;
}
export function ClearTextarea({
  label,
  hint,
  error,
  loading,
  disabled,
  ...props
}) {
  const id = useId();
  return <label className="cc-control">{label}<textarea {...props} aria-describedby={id} aria-invalid={!!error} disabled={disabled || loading} /><Hint id={id} error={error} hint={loading ? "正在加载…" : hint} /></label>;
}
export function ClearCheckbox({
  label,
  checked,
  onChange,
  disabled,
  loading,
  error,
  hint
}) {
  const id = useId();
  return <label className="cc-check"><input type="checkbox" checked={checked} onChange={e => onChange?.(e.target.checked)} disabled={disabled || loading} aria-invalid={!!error} aria-describedby={id} /><span>{label}<Hint id={id} error={error} hint={loading ? "正在加载…" : hint} /></span></label>;
}
export function ClearRadioGroup({
  label,
  options,
  value,
  onChange,
  disabled,
  loading,
  error
}) {
  const name = useId();
  return <fieldset className="cc-control" disabled={disabled || loading}><legend>{label}</legend>{options.map(o => <label className="cc-check" key={o.value}><input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange?.(o.value)} disabled={o.disabled} />{o.label}</label>)}<Hint error={error} hint={loading ? "正在加载…" : ""} /></fieldset>;
}
export function ClearCombobox({
  label,
  options,
  value,
  onChange,
  disabled,
  loading,
  error
}) {
  const [query, setQuery] = useState("");
  const filtered = options.filter(o => o.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <fieldset className="cc-control" disabled={disabled || loading}><legend>{label}</legend><input aria-label={"搜索" + label} type="search" value={query} onChange={e => setQuery(e.target.value)} /><select aria-label={label} value={value} onChange={e => onChange?.(e.target.value)}><option value="">请选择</option>{options.filter(o => filtered.includes(o) || o.value === value).map(o => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}</select><Hint error={error} hint={loading ? "正在加载选项…" : filtered.length ? "输入关键词筛选，方向键选择。" : "没有匹配的选项。当前选择已保留。"} /></fieldset>;
}
export function ClearMultiSelect({
  label,
  options,
  value = [],
  onChange,
  disabled,
  loading,
  error
}) {
  const [query, setQuery] = useState("");
  const matches = options.filter(o => o.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const toggle = v => onChange?.(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
  return <fieldset className="cc-control" disabled={disabled || loading}><legend>{label}</legend><input type="search" aria-label={"搜索" + label} value={query} onChange={e => setQuery(e.target.value)} /><div className="cc-chips">{value.map(v => <button type="button" key={v} onClick={() => toggle(v)} aria-label={"移除" + (options.find(o => o.value === v)?.label ?? v)}>{options.find(o => o.value === v)?.label ?? v} ×</button>)}</div><div className="cc-options">{matches.map(o => <ClearCheckbox key={o.value} label={o.label} checked={value.includes(o.value)} onChange={() => toggle(o.value)} disabled={o.disabled} />)}</div><Hint error={error} hint={loading ? "正在加载选项…" : matches.length ? "已选 " + value.length + " 项" : "没有匹配的选项。"} /></fieldset>;
}
export function ClearDatePicker({
  label,
  value = "",
  onChange,
  min,
  max,
  disabled,
  loading,
  error
}) {
  return <label className="cc-control">{label}<input type="date" value={value} min={min} max={max} disabled={disabled || loading} onChange={e => onChange?.(e.target.value)} aria-invalid={!!error} /><Hint error={error} hint={loading ? "正在加载…" : "日期按本地日历解释，不转换为 UTC。"} /></label>;
}
export function ClearDateRange({
  label = "日期范围",
  value = {
    start: "",
    end: ""
  },
  onChange,
  min,
  max,
  disabled,
  loading,
  error
}) {
  const [draft, setDraft] = useState(null);
  const current = draft ?? value;
  const invalid = current.start && current.end && current.start > current.end || [current.start, current.end].some(date => date && (min && date < min || max && date > max));
  const preset = days => {
    const end = new Date(),
      start = new Date();
    start.setDate(end.getDate() - days + 1);
    const fmt = d => [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
    setDraft({
      start: fmt(start),
      end: fmt(end)
    });
  };
  return <fieldset className="cc-control" disabled={disabled || loading}><legend>{label}</legend><div className="cc-inline"><ClearDatePicker label="开始日期" value={current.start} onChange={start => setDraft({
        ...current,
        start
      })} min={min} max={max} /><ClearDatePicker label="结束日期" value={current.end} onChange={end => setDraft({
        ...current,
        end
      })} min={min} max={max} /></div><div className="cc-inline"><button type="button" onClick={() => preset(7)}>最近7天</button><button type="button" onClick={() => preset(30)}>最近30天</button><button type="button" disabled={!!invalid} onClick={() => {
        onChange?.(current);
        setDraft(null);
      }}>应用日期</button><button type="button" onClick={() => setDraft(null)}>取消日期修改</button><button type="button" onClick={() => {
        onChange?.({
          start: "",
          end: ""
        });
        setDraft(null);
      }}>清空日期</button></div><Hint error={invalid ? "请检查起止顺序及允许的日期范围。" : error} hint={loading ? "正在加载…" : ""} /></fieldset>;
}
