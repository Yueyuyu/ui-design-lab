import { CheckCircle, CircleNotch, Info, WarningCircle, X } from "@phosphor-icons/react";
import { resolveLedgerState } from "./state.js";

const icons = { success: CheckCircle, info: Info, warning: WarningCircle, error: WarningCircle };

export function LedgerNotification({ tone = "info", title, description, actionLabel, onAction, onDismiss, loading, error, disabled, visualState }) {
  const resolvedTone = error ? "error" : tone; const Icon = loading ? CircleNotch : icons[resolvedTone]; const state = resolveLedgerState({ visualState, loading, error, disabled });
  return <article className={`ml-notification ml-notification--${resolvedTone}`} data-state={state} data-visual-state={visualState}><Icon size={18} className={loading ? "ml-spin" : ""} weight={loading ? "regular" : "fill"} aria-hidden="true" /><span><strong>{title}</strong><small>{description}</small></span>{actionLabel ? <button type="button" onClick={onAction} disabled={disabled || loading}>{actionLabel}</button> : null}{onDismiss ? <button type="button" className="ml-notification__dismiss" aria-label="关闭" onClick={onDismiss}><X size={14} /></button> : null}</article>;
}

export function LedgerEmptyState({ icon: Icon, title, description, actionLabel, onAction, visualState, loading, error, disabled }) {
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  return <section className="ml-empty" data-state={state} data-visual-state={visualState}><span className="ml-empty__icon">{loading ? <CircleNotch size={24} className="ml-spin" /> : error ? <WarningCircle size={24} weight="fill" /> : <Icon size={24} />}</span><h3>{error ? "暂时无法读取数据" : title}</h3><p>{error ? "连接中断，现有筛选条件已保留。" : description}</p>{actionLabel ? <button type="button" onClick={onAction} disabled={disabled || loading}>{error ? "重新加载" : actionLabel}</button> : null}</section>;
}
