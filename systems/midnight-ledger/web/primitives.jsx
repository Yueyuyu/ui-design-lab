import { CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useId } from "react";
import { joinClassNames, resolveLedgerState } from "./state.js";

export function LedgerButton({ children, variant = "primary", icon: Icon, trailingIcon: TrailingIcon, visualState, loading, error, disabled, className = "", type = "button", ...props }) {
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  const StateIcon = loading ? CircleNotch : error ? WarningCircle : Icon;
  return <button {...props} type={type} className={joinClassNames("ml-button", `ml-button--${variant}`, className)} data-state={state} data-visual-state={visualState} disabled={disabled || loading || visualState === "disabled"}>{StateIcon ? <StateIcon size={16} weight={error ? "fill" : "bold"} className={loading ? "ml-spin" : ""} aria-hidden="true" /> : null}<span>{children}</span>{TrailingIcon ? <TrailingIcon size={16} weight="bold" aria-hidden="true" /> : null}</button>;
}

export function LedgerIconButton({ label, icon: Icon, visualState, loading, error, disabled, className = "", ...props }) {
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  const StateIcon = loading ? CircleNotch : error ? WarningCircle : Icon;
  return <button {...props} type="button" className={joinClassNames("ml-icon-button", className)} aria-label={label} title={label} data-state={state} data-visual-state={visualState} disabled={disabled || loading || visualState === "disabled"}>{StateIcon ? <StateIcon size={17} className={loading ? "ml-spin" : ""} aria-hidden="true" /> : null}</button>;
}

export function LedgerStatusBadge({ children, tone = "neutral", dot = false, visualState, loading, error, disabled }) {
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  return <span className={`ml-status ml-status--${error ? "negative" : tone}`} data-state={state} data-visual-state={visualState}>{loading ? <CircleNotch size={12} className="ml-spin" aria-hidden="true" /> : dot ? <i aria-hidden="true" /> : null}{children}</span>;
}

export function LedgerField({ label, hint, error, loading, visualState, disabled, className = "", ...props }) {
  const id = useId();
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  const messageId = `${id}-message`;
  return <label className={joinClassNames("ml-field", className)} data-state={state} data-visual-state={visualState}><span className="ml-field__label">{label}</span><span className="ml-field__wrap"><input {...props} id={id} className="ml-field__control" disabled={disabled || loading || visualState === "disabled"} aria-invalid={Boolean(error)} aria-describedby={hint || error ? messageId : undefined} />{loading ? <CircleNotch size={15} className="ml-field__icon ml-spin" aria-hidden="true" /> : error ? <WarningCircle size={15} className="ml-field__icon" weight="fill" aria-hidden="true" /> : null}</span>{error || hint ? <small id={messageId} className="ml-field__message">{error || hint}</small> : null}</label>;
}

export function LedgerSelect({ label, options, hint, error, loading, visualState, disabled, className = "", ...props }) {
  const id = useId();
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  return <label className={joinClassNames("ml-field", "ml-select", className)} data-state={state} data-visual-state={visualState}><span className="ml-field__label">{label}</span><span className="ml-field__wrap"><select {...props} id={id} className="ml-field__control ml-select__control" disabled={disabled || loading || visualState === "disabled"} aria-invalid={Boolean(error)}>{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select>{loading ? <CircleNotch size={15} className="ml-field__icon ml-spin" aria-hidden="true" /> : null}</span>{error || hint ? <small className="ml-field__message">{error || hint}</small> : null}</label>;
}

export function LedgerToggle({ checked, onChange, label, description, error, loading, visualState, disabled }) {
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  return <label className="ml-toggle-row" data-state={state} data-visual-state={visualState}><span className="ml-toggle-row__copy"><strong>{label}</strong>{description ? <small>{description}</small> : null}{error ? <small className="ml-toggle-row__error">{error}</small> : null}</span><button type="button" role="switch" aria-label={label} aria-checked={checked} className="ml-toggle" data-on={checked ? "true" : "false"} disabled={disabled || loading || visualState === "disabled"} onClick={() => onChange?.(!checked)}>{loading ? <CircleNotch size={13} className="ml-spin" aria-hidden="true" /> : <span className="ml-toggle__thumb" />}</button></label>;
}

export function LedgerPanel({ title, eyebrow, action, children, tone = "default", visualState, loading, error, disabled, className = "", ...props }) {
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  return <section {...props} className={joinClassNames("ml-panel", `ml-panel--${tone}`, className)} data-state={state} data-visual-state={visualState}>{title || eyebrow || action ? <header className="ml-panel__header"><span>{eyebrow ? <small>{eyebrow}</small> : null}{title ? <h3>{title}</h3> : null}</span>{action}</header> : null}<div className="ml-panel__body">{loading ? <div className="ml-panel__skeleton" aria-label="正在加载" /> : error ? <div className="ml-panel__error"><WarningCircle size={17} weight="fill" aria-hidden="true" />{typeof error === "string" ? error : "面板加载失败"}</div> : children}</div></section>;
}

export function LedgerMetric({ label, value, delta, tone = "neutral", visualState, loading, error, disabled, className = "" }) {
  const state = resolveLedgerState({ visualState, loading, error, disabled });
  return <div className={joinClassNames("ml-metric", className)} data-state={state} data-visual-state={visualState}><span>{label}</span>{loading ? <i className="ml-metric__skeleton" /> : <strong>{error ? "读取失败" : value}</strong>}{delta ? <small data-tone={tone}>{delta}</small> : null}</div>;
}
