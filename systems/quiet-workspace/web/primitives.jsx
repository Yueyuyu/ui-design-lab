import { Check, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useId } from "react";
import { joinClassNames, resolveComponentState } from "./state.js";

export function QuietButton({
  children,
  variant = "primary",
  size = "medium",
  icon: Icon,
  trailingIcon: TrailingIcon,
  loading = false,
  error = false,
  visualState,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const isDisabled = disabled || loading || visualState === "disabled";
  const StateIcon = error ? WarningCircle : loading ? CircleNotch : Icon;

  return (
    <button
      className={joinClassNames("qw-button", `qw-button--${variant}`, `qw-button--${size}`, className)}
      type={type}
      data-state={state}
      data-visual-state={visualState}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {StateIcon ? (
        <StateIcon
          className={loading ? "qw-spin" : undefined}
          size={16}
          weight="bold"
          aria-hidden="true"
        />
      ) : null}
      <span>{children}</span>
      {TrailingIcon && !loading && !error ? (
        <TrailingIcon size={15} weight="bold" aria-hidden="true" />
      ) : null}
    </button>
  );
}

export function QuietIconButton({
  icon: Icon,
  label,
  loading = false,
  error = false,
  visualState,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) {
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const isDisabled = disabled || loading || visualState === "disabled";
  const StateIcon = error ? WarningCircle : loading ? CircleNotch : Icon;

  return (
    <button
      className={joinClassNames("qw-icon-button", className)}
      type={type}
      aria-label={label}
      aria-busy={loading || undefined}
      data-state={state}
      data-visual-state={visualState}
      disabled={isDisabled}
      {...props}
    >
      {StateIcon ? <StateIcon className={loading ? "qw-spin" : undefined} size={17} aria-hidden="true" /> : null}
    </button>
  );
}

export function QuietStatusChip({ children, tone = "neutral", dot = false, state = "default" }) {
  return (
    <span className={`qw-status-chip qw-status-chip--${tone}`} data-state={state}>
      {dot ? <span className="qw-status-chip__dot" aria-hidden="true" /> : null}
      {state === "loading" ? <CircleNotch className="qw-spin" size={13} aria-hidden="true" /> : null}
      {state === "error" ? <WarningCircle size={13} weight="bold" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

export function QuietField({
  label,
  hint,
  error,
  loading = false,
  visualState,
  disabled = false,
  className = "",
  id,
  ...inputProps
}) {
  const generatedId = useId();
  const controlId = id || `qw-field-${generatedId}`;
  const messageId = `${controlId}-message`;
  const message = error || (loading ? "正在检查…" : hint);
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const isDisabled = disabled || visualState === "disabled";

  return (
    <label className={joinClassNames("qw-field", className)} data-state={state} data-visual-state={visualState} htmlFor={controlId}>
      <span className="qw-field__label">{label}</span>
      <span className="qw-field__control-wrap">
        <input
          className="qw-field__control"
          id={controlId}
          disabled={isDisabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={message ? messageId : undefined}
          aria-busy={loading || undefined}
          {...inputProps}
        />
        {loading ? <CircleNotch className="qw-field__state-icon qw-spin" size={16} aria-hidden="true" /> : null}
        {error ? <WarningCircle className="qw-field__state-icon" size={16} weight="bold" aria-hidden="true" /> : null}
      </span>
      {message ? <span className="qw-field__message" id={messageId}>{message}</span> : null}
    </label>
  );
}

export function QuietToggle({
  checked,
  onChange,
  label,
  description,
  error,
  loading = false,
  visualState,
  disabled = false,
}) {
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const isDisabled = disabled || loading || visualState === "disabled";

  return (
    <div className="qw-toggle-row" data-state={state} data-visual-state={visualState}>
      <span className="qw-toggle-row__copy">
        <span className="qw-toggle-row__label">{label}</span>
        {error ? <span className="qw-toggle-row__error">{error}</span> : null}
        {!error && description ? <span className="qw-toggle-row__description">{description}</span> : null}
      </span>
      <button
        type="button"
        className="qw-toggle"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        aria-busy={loading || undefined}
        data-on={checked ? "true" : "false"}
        data-state={state}
        disabled={isDisabled}
        onClick={() => onChange?.(!checked)}
      >
        <span className="qw-toggle__thumb">
          {loading ? <CircleNotch className="qw-spin" size={10} aria-hidden="true" /> : null}
          {!loading && checked ? <Check size={10} weight="bold" aria-hidden="true" /> : null}
        </span>
      </button>
    </div>
  );
}

export function QuietCard({
  title,
  eyebrow,
  action,
  children,
  className = "",
  state = "default",
}) {
  return (
    <section className={joinClassNames("qw-card", className)} data-state={state} aria-busy={state === "loading" || undefined}>
      {title || eyebrow || action ? (
        <header className="qw-card__header">
          <span>
            {eyebrow ? <span className="qw-card__eyebrow">{eyebrow}</span> : null}
            {title ? <h3 className="qw-card__title">{title}</h3> : null}
          </span>
          {action}
        </header>
      ) : null}
      <div className="qw-card__body">{children}</div>
    </section>
  );
}
