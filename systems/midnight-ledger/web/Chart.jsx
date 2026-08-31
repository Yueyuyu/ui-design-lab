import { ArrowClockwise, CircleNotch, WarningCircle } from "@phosphor-icons/react";

function chartPoints(values, width = 640, height = 220) {
  const min = Math.min(...values); const max = Math.max(...values); const range = Math.max(1, max - min);
  return values.map((value, index) => `${(index / (values.length - 1)) * width},${height - ((value - min) / range) * (height - 24) - 12}`).join(" ");
}

export function LedgerLineChart({
  title = "累计收益",
  value = "+31.8%",
  data = [8, 12, 14, 18, 17, 21, 19, 24, 29, 27, 33, 35, 41],
  state = "default",
  onRetry
}) {
  const points = chartPoints(data);
  const lastY = points.split(" ").at(-1).split(",")[1];
  const displayValue = state === "error" ? "—" : state === "loading" ? "同步中" : value;

  return (
    <figure
      className="ml-line-chart"
      data-state={state}
      tabIndex={state === "disabled" ? -1 : 0}
      aria-busy={state === "loading" ? "true" : undefined}
    >
      <figcaption>
        <span><strong>{title}</strong><small>30D · 收盘价口径</small></span>
        <b>{displayValue}</b>
      </figcaption>
      <div className="ml-line-chart__plot">
        {state === "loading" ? (
          <div className="ml-line-chart__loading" role="status">
            <span className="ml-line-chart__skeleton" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            <span><strong>正在同步行情</strong><small>正在获取最新收盘数据…</small></span>
          </div>
        ) : state === "error" ? (
          <div className="ml-line-chart__error" role="alert">
            <WarningCircle size={24} weight="fill" aria-hidden="true" />
            <span><strong>行情暂不可用</strong><small>图表已暂停更新，请稍后重试。</small></span>
            {onRetry ? (
              <button type="button" onClick={onRetry}>
                <ArrowClockwise size={14} weight="bold" aria-hidden="true" />
                重新加载
              </button>
            ) : null}
          </div>
        ) : (
          <svg viewBox="0 0 640 220" role="img" aria-label={`${title} ${value}`} preserveAspectRatio="none">
            <line x1="0" y1="208" x2="640" y2="208" />
            <polyline points={points} />
            <circle cx="640" cy={lastY} r="5" />
          </svg>
        )}
      </div>
    </figure>
  );
}

export function LedgerBarChart({
  values = [3.2, -1.4, 6.8, 4.5, 7.5, 7.1],
  data,
  title = "月度收益",
  unit = "%",
  state = "default",
  onRetry,
}) {
  const source = data ?? values.map((value, index) => ({ label: `${index + 2}月`, value }));
  const max = Math.max(...source.map((item) => Math.abs(item.value)), 1);
  const displayData = state === "loading"
    ? source.map((item, index) => ({ ...item, value: 30 + index * 7 }))
    : source;

  return (
    <figure className="ml-bar-chart" data-state={state} aria-busy={state === "loading" || undefined}>
      <figcaption>{title}</figcaption>
      {state === "error" ? (
        <div className="ml-bar-chart__message" role="alert">
          <WarningCircle size={22} weight="fill" aria-hidden="true" />
          <span><strong>图表加载失败</strong><small>收入数据暂不可用，请稍后重试。</small></span>
          {onRetry ? <button type="button" onClick={onRetry}><ArrowClockwise size={14} weight="bold" aria-hidden="true" />重新加载</button> : null}
        </div>
      ) : (
        <div>
          {displayData.map((item, index) => (
            <span
              key={`${item.label}-${index}`}
              data-negative={item.value < 0 ? "true" : "false"}
              data-loading={state === "loading" ? "true" : "false"}
              style={{ "--ml-bar-height": `${Math.max(20, (Math.abs(item.value) / max) * 118)}px` }}
            >
              <b>{state === "loading" ? <CircleNotch size={12} className="ml-spin" aria-hidden="true" /> : `${item.value > 0 && unit === "%" ? "+" : ""}${item.value}${unit}`}</b>
              <i />
              <small>{state === "loading" ? "—" : item.label}</small>
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}
