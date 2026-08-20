import { ArrowClockwise, Power } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { resolveComponentState } from "./state.js";

function resolveQuotaValue(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function resolveQuotaTone(value, state) {
  if (state === "disabled" || state === "loading" || value === null) {
    return "neutral";
  }

  if (state === "error" || value <= 20) {
    return "critical";
  }

  if (value <= 40) {
    return "caution";
  }

  return "healthy";
}

export function QuietQuotaPill({
  remainingPercent = 76,
  resetText = "重置时间暂不可用",
  defaultOpen = false,
  loading = false,
  error,
  disabled = false,
  visualState,
  panelAlign = "start",
  onRefresh,
  onExit,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const titleId = `${panelId}-title`;
  const value = resolveQuotaValue(remainingPercent);
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const isDisabled = disabled || visualState === "disabled";
  const tone = resolveQuotaTone(value, state);
  const displayValue = loading ? "…" : error || value === null ? "--" : `${value}%`;
  const statusText = error
    ? error
    : loading
      ? "正在读取重置时间"
      : resetText;
  const accessibleLabel = error
    ? "本周额度读取失败，点击查看详情"
    : loading
      ? "正在读取本周额度"
      : isDisabled
        ? `本周剩余额度${displayValue}，额度显示已停用`
        : `本周剩余额度${displayValue}，点击查看重置时间和操作`;

  const runAction = (action) => {
    action?.();
    setOpen(false);
  };

  return (
    <div
      className="qw-quota-pill"
      data-density="compact"
      data-state={state}
      data-tone={tone}
      data-open={open ? "true" : "false"}
      data-panel-align={panelAlign}
    >
      <button
        type="button"
        className="qw-quota-pill__trigger"
        aria-label={accessibleLabel}
        aria-controls={panelId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-busy={loading || undefined}
        data-visual-state={visualState}
        disabled={isDisabled}
        onClick={() => setOpen((valueOpen) => !valueOpen)}
      >
        <span aria-hidden="true">{displayValue}</span>
      </button>

      <section
        className="qw-quota-panel"
        id={panelId}
        role="dialog"
        aria-labelledby={titleId}
        aria-hidden={!open}
        data-open={open ? "true" : "false"}
      >
        <header className="qw-quota-panel__header">
          <span className="qw-quota-panel__copy">
            <strong id={titleId}>本周额度</strong>
            <small>{statusText}</small>
          </span>
          <strong className="qw-quota-panel__value">{displayValue}</strong>
        </header>
        <div className="qw-quota-panel__actions">
          <button
            type="button"
            className="qw-quota-panel__action"
            tabIndex={open ? 0 : -1}
            onClick={() => runAction(onRefresh)}
          >
            <ArrowClockwise size={15} aria-hidden="true" />
            立即刷新
          </button>
          <button
            type="button"
            className="qw-quota-panel__action qw-quota-panel__action--danger"
            tabIndex={open ? 0 : -1}
            onClick={() => runAction(onExit)}
          >
            <Power size={15} aria-hidden="true" />
            退出额度显示
          </button>
        </div>
      </section>
    </div>
  );
}
