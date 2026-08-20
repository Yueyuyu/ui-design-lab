import { ArrowClockwise, WarningCircle } from "@phosphor-icons/react";
import { QuietButton } from "./primitives.jsx";

function TableMessage({ colSpan, state, message, onRetry }) {
  return (
    <tr>
      <td className="qw-table__message" colSpan={colSpan}>
        {state === "error" ? <WarningCircle size={20} weight="bold" aria-hidden="true" /> : null}
        <span>{message}</span>
        {state === "error" && onRetry ? (
          <QuietButton size="small" variant="secondary" icon={ArrowClockwise} onClick={onRetry}>重新加载</QuietButton>
        ) : null}
      </td>
    </tr>
  );
}

export function QuietTable({
  caption,
  columns,
  rows,
  state = "default",
  error = "数据加载失败。请稍后重试。",
  empty = "暂无数据。调整筛选条件后再试。",
  onRetry,
  onRowActivate,
}) {
  const isLoading = state === "loading";
  const isError = state === "error";
  const isEmpty = state === "empty" || (!isLoading && !isError && rows.length === 0);

  return (
    <div className="qw-table-frame" data-state={state} aria-busy={isLoading || undefined}>
      <table className="qw-table">
        {caption ? <caption>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" data-align={column.align || "start"}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? Array.from({ length: 3 }, (_, rowIndex) => (
            <tr className="qw-table__skeleton-row" key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td key={column.key}><span style={{ width: `${58 + ((rowIndex + columnIndex) % 3) * 12}%` }} /></td>
              ))}
            </tr>
          )) : null}
          {isError ? <TableMessage colSpan={columns.length} state="error" message={error} onRetry={onRetry} /> : null}
          {isEmpty ? <TableMessage colSpan={columns.length} state="empty" message={empty} /> : null}
          {!isLoading && !isError && !isEmpty ? rows.map((row) => (
            <tr
              key={row.id}
              tabIndex={row.disabled ? -1 : 0}
              aria-disabled={row.disabled || undefined}
              data-state={row.disabled ? "disabled" : row.visualState || "default"}
              onClick={() => !row.disabled && onRowActivate?.(row)}
              onKeyDown={(event) => {
                if (!row.disabled && (event.key === "Enter" || event.key === " ")) {
                  event.preventDefault();
                  onRowActivate?.(row);
                }
              }}
            >
              {columns.map((column) => (
                <td key={column.key} data-align={column.align || "start"}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          )) : null}
        </tbody>
      </table>
    </div>
  );
}
