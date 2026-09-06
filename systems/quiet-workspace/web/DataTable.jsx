import { useMemo, useState } from "react";
import { QuietPagination } from "./Navigation.jsx";
export function QuietDataTable({
  rows,
  columns,
  caption = "数据列表",
  pageSize = 5,
  selection,
  onSelectionChange,
  onRowActivate,
  onBulkAction,
  loading = false,
  disabled = false,
  error,
  onRetry
}) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState(null),
    [page, setPage] = useState(1),
    [hidden, setHidden] = useState([]),
    [localSelection, setLocalSelection] = useState([]);
  const selected = (selection ?? localSelection).filter(id => rows.some(r => r.id === id && !r.disabled)),
    inert = loading || disabled;
  const select = ids => {
    setLocalSelection(ids);
    onSelectionChange?.(ids);
  };
  const filtered = useMemo(() => {
    const list = rows.filter(row => columns.some(c => String(row[c.key] ?? "").toLocaleLowerCase().includes(query.toLocaleLowerCase())));
    if (sort) list.sort((a, b) => {
      const x = a[sort.key],
        y = b[sort.key];
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), "zh-CN", {
        numeric: true
      })) * sort.direction;
    });
    return list;
  }, [rows, columns, query, sort]);
  const size = Math.max(1, Math.floor(Number.isFinite(pageSize) ? pageSize : 5));
  const count = Math.max(1, Math.ceil(filtered.length / size)),
    current = Math.min(page, count),
    visible = filtered.slice((current - 1) * size, current * size),
    eligible = visible.filter(r => !r.disabled).map(r => r.id);
  const shown = columns.filter(c => !hidden.includes(c.key));
  return <section className="qw-data-table" aria-busy={loading || undefined}><div className="qw-table-toolbar"><label>筛选 <input type="search" aria-label={"筛选" + caption} value={query} onChange={e => {
          setQuery(e.target.value);
          setPage(1);
        }} disabled={inert} /></label><details><summary>显示列</summary>{columns.map(c => <label key={c.key}><input type="checkbox" checked={!hidden.includes(c.key)} disabled={inert || shown.length === 1 && !hidden.includes(c.key)} onChange={() => setHidden(v => v.includes(c.key) ? v.filter(x => x !== c.key) : [...v, c.key])} />{c.label}</label>)}</details></div>
 <p role="status">{loading ? "正在加载数据…" : "匹配 " + filtered.length + " 条；已选择 " + selected.length + " 条（跨页保留）"}</p>
 {error ? <div role="alert">{error}{onRetry ? <button type="button" onClick={onRetry} disabled={inert}>重新加载</button> : null}</div> : <div className="qw-table-scroll"><table><caption>{caption}</caption><thead><tr><th><input type="checkbox" aria-label="选择本页全部" disabled={inert || !eligible.length} checked={!!eligible.length && eligible.every(id => selected.includes(id))} onChange={e => select(e.target.checked ? [...new Set([...selected, ...eligible])] : selected.filter(id => !eligible.includes(id)))} /></th>{shown.map(c => <th key={c.key} aria-sort={sort?.key === c.key ? sort.direction === 1 ? "ascending" : "descending" : "none"}><button type="button" disabled={inert || c.sortable === false} onClick={() => {
                setSort({
                  key: c.key,
                  direction: sort?.key === c.key ? -sort.direction : 1
                });
                setPage(1);
              }}>{c.label}{sort?.key === c.key ? sort.direction === 1 ? " ↑" : " ↓" : ""}</button></th>)}{onRowActivate ? <th>详情</th> : null}</tr></thead><tbody>{visible.map(row => <tr key={row.id} data-selected={selected.includes(row.id)}><td><input type="checkbox" aria-label={"选择 " + String(row[columns[0].key])} disabled={inert || row.disabled} checked={selected.includes(row.id)} onChange={e => select(e.target.checked ? [...selected, row.id] : selected.filter(id => id !== row.id))} /></td>{shown.map(c => <td key={c.key}>{c.render ? c.render(row[c.key], row) : String(row[c.key] ?? "—")}</td>)}{onRowActivate ? <td><button type="button" disabled={inert || row.disabled} onClick={() => onRowActivate(row)}>查看 {String(row[columns[0].key])}</button></td> : null}</tr>)}</tbody></table>{!visible.length ? <p>当前筛选条件下暂无数据。</p> : null}</div>}
 <div className="qw-inline">{onBulkAction ? <button type="button" disabled={inert || !selected.length} onClick={() => onBulkAction(selected)}>批量处理（{selected.length}）</button> : null}<button type="button" disabled={inert || !selected.length} onClick={() => select([])}>清除选择</button><QuietPagination page={current} pageCount={count} onChange={setPage} disabled={inert} /></div></section>;
}
