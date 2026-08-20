import {
  CheckCircle,
  CircleNotch,
  FolderOpen,
  Info,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { QuietButton, QuietIconButton } from "./primitives.jsx";
import { resolveComponentState } from "./state.js";

const toneIcons = {
  info: Info,
  success: CheckCircle,
  warning: Warning,
  error: WarningCircle,
};

export function QuietNotification({
  tone = "info",
  title,
  description,
  actionLabel,
  onAction,
  onDismiss,
  loading = false,
  error = false,
  disabled = false,
  visualState,
}) {
  const resolvedTone = error ? "error" : tone;
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const Icon = loading ? CircleNotch : toneIcons[resolvedTone];

  return (
    <section
      className={`qw-notification qw-notification--${resolvedTone}`}
      role={resolvedTone === "error" ? "alert" : "status"}
      data-state={state}
      data-visual-state={visualState}
      aria-busy={loading || undefined}
    >
      <Icon className={loading ? "qw-notification__icon qw-spin" : "qw-notification__icon"} size={19} weight="bold" aria-hidden="true" />
      <span className="qw-notification__copy">
        <strong>{title}</strong>
        <span>{description}</span>
        {actionLabel ? (
          <button className="qw-notification__action" type="button" disabled={disabled || loading} onClick={onAction}>
            {actionLabel}
          </button>
        ) : null}
      </span>
      {onDismiss ? <QuietIconButton icon={X} label="关闭通知" disabled={disabled} onClick={onDismiss} /> : null}
    </section>
  );
}

export function QuietEmptyState({
  icon: Icon = FolderOpen,
  title = "这里还没有内容",
  description = "创建第一项内容后，它会显示在这里。",
  actionLabel,
  onAction,
  loading = false,
  error = false,
  disabled = false,
  visualState,
}) {
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const StateIcon = error ? WarningCircle : loading ? CircleNotch : Icon;

  return (
    <section className="qw-empty-state" data-state={state} data-visual-state={visualState} aria-busy={loading || undefined}>
      <span className="qw-empty-state__icon">
        <StateIcon className={loading ? "qw-spin" : undefined} size={24} weight="bold" aria-hidden="true" />
      </span>
      <h3>{error ? "内容加载失败" : loading ? "正在加载内容" : title}</h3>
      <p>{error ? "请检查连接后重新加载。" : loading ? "完成后会自动显示在这里。" : description}</p>
      {actionLabel ? (
        <QuietButton
          variant={error ? "secondary" : "primary"}
          disabled={disabled}
          loading={loading}
          error={error}
          onClick={onAction}
        >
          {error ? "重新加载" : actionLabel}
        </QuietButton>
      ) : null}
    </section>
  );
}
