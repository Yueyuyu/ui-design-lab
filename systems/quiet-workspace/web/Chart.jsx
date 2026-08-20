import { ArrowClockwise, ChartBar, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { QuietButton } from "./primitives.jsx";

export function QuietBarChart({
  title,
  description,
  data,
  unit = "",
  state = "default",
  disabled = false,
  onRetry,
}) {
  const max = Math.max(...data.map((item) => item.value), 1);
  const isLoading = state === "loading";
  const isError = state === "error";
  const isEmpty = state === "empty" || (!isLoading && !isError && data.length === 0);

  return (
    <figure className="qw-chart" data-state={disabled ? "disabled" : state} aria-busy={isLoading || undefined}>
      <figcaption>
        <span>
          <strong>{title}</strong>
          {description ? <small>{description}</small> : null}
        </span>
        <ChartBar size={18} aria-hidden="true" />
      </figcaption>
      {isError || isEmpty ? (
        <div className="qw-chart__message" role={isError ? "alert" : "status"}>
          {isError ? <WarningCircle size={21} weight="bold" aria-hidden="true" /> : <ChartBar size={21} aria-hidden="true" />}
          <span>{isError ? "图表加载失败。请稍后重试。" : "当前筛选条件下暂无数据。"}</span>
          {isError && onRetry ? <QuietButton variant="secondary" size="small" icon={ArrowClockwise} onClick={onRetry}>重新加载</QuietButton> : null}
        </div>
      ) : (
        <div className="qw-chart__plot" role="group" aria-label={`${title}，单位${unit || "无"}`}>
          {(isLoading ? Array.from({ length: 6 }, (_, index) => ({ label: `加载项 ${index + 1}`, value: 35 + index * 8 })) : data).map((item, index) => (
            <button
              className="qw-chart__item"
              type="button"
              key={`${item.label}-${index}`}
              style={{ "--qw-chart-value": `${(item.value / max) * 100}%`, "--qw-chart-index": index }}
              aria-label={isLoading ? "正在加载" : `${item.label}：${item.value}${unit}`}
              disabled={disabled || isLoading}
            >
              <span className="qw-chart__value">{isLoading ? <CircleNotch className="qw-spin" size={12} aria-hidden="true" /> : `${item.value}${unit}`}</span>
              <span className="qw-chart__bar" aria-hidden="true" />
              <span className="qw-chart__label">{isLoading ? "—" : item.label}</span>
            </button>
          ))}
        </div>
      )}
    </figure>
  );
}
