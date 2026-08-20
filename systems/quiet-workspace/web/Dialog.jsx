import { CircleNotch, WarningCircle, X } from "@phosphor-icons/react";
import { useEffect, useId, useRef } from "react";
import { QuietIconButton } from "./primitives.jsx";
import { resolveComponentState } from "./state.js";

export function QuietDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  actions,
  loading = false,
  error,
  disabled = false,
  visualState,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const returnFocusRef = useRef(null);
  const state = resolveComponentState({ visualState, loading, error, disabled });

  useEffect(() => {
    if (!open) return undefined;

    returnFocusRef.current = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => closeButtonRef.current?.querySelector("button")?.focus());
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onOpenChange?.(false);
      if (event.key === "Tab") {
        const focusable = [...dialogRef.current?.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ) || []];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      returnFocusRef.current?.focus?.();
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="qw-dialog-layer"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange?.(false);
      }}
    >
      <section
        ref={dialogRef}
        className="qw-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        aria-busy={loading || undefined}
        aria-disabled={disabled || undefined}
        data-state={state}
        data-visual-state={visualState}
      >
        <header className="qw-dialog__header">
          <span>
            <h2 id={titleId}>{title}</h2>
            {description ? <p id={descriptionId}>{description}</p> : null}
          </span>
          <span ref={closeButtonRef}>
            <QuietIconButton icon={X} label="关闭对话框" onClick={() => onOpenChange?.(false)} />
          </span>
        </header>
        <div className="qw-dialog__body">
          {loading ? (
            <div className="qw-dialog__status" role="status">
              <CircleNotch className="qw-spin" size={18} aria-hidden="true" />
              正在处理，请稍候…
            </div>
          ) : null}
          {error ? (
            <div className="qw-dialog__status qw-dialog__status--error" role="alert">
              <WarningCircle size={18} weight="bold" aria-hidden="true" />
              {error}
            </div>
          ) : null}
          {children}
        </div>
        {actions ? <footer className="qw-dialog__footer">{actions}</footer> : null}
      </section>
    </div>
  );
}
