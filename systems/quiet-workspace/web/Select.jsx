import { CaretDown, CircleNotch, WarningCircle } from "@phosphor-icons/react";
import { useId } from "react";
import { resolveComponentState } from "./state.js";

export function QuietSelect({
  label,
  options,
  hint,
  error,
  loading = false,
  visualState,
  disabled = false,
  id,
  ...selectProps
}) {
  const generatedId = useId();
  const controlId = id || `qw-select-${generatedId}`;
  const messageId = `${controlId}-message`;
  const message = error || (loading ? "正在加载选项…" : hint);
  const state = resolveComponentState({ visualState, loading, error, disabled });
  const isDisabled = disabled || loading || visualState === "disabled";

  return (
    <label className="qw-field qw-select" data-state={state} data-visual-state={visualState} htmlFor={controlId}>
      <span className="qw-field__label">{label}</span>
      <span className="qw-field__control-wrap">
        <select
          className="qw-field__control qw-select__control"
          id={controlId}
          disabled={isDisabled}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={message ? messageId : undefined}
          aria-busy={loading || undefined}
          {...selectProps}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>
          ))}
        </select>
        {loading ? <CircleNotch className="qw-field__state-icon qw-spin" size={16} aria-hidden="true" /> : null}
        {error ? <WarningCircle className="qw-field__state-icon" size={16} weight="bold" aria-hidden="true" /> : null}
        {!loading && !error ? <CaretDown className="qw-field__state-icon" size={16} aria-hidden="true" /> : null}
      </span>
      {message ? <span className="qw-field__message" id={messageId}>{message}</span> : null}
    </label>
  );
}
