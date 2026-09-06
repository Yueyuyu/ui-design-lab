import { CircleNotch, WarningCircle, X } from "@phosphor-icons/react";
import { useId } from "react";
import { createPortal } from "react-dom";
import { useModalLifecycle } from "./useModalLifecycle.js";

export function LedgerDialog({
  open, onOpenChange, title, description, children, actions,
  loading = false, error, disabled = false, visualState,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const { anchorRef, dialogRef, scopeRef, close } = useModalLifecycle(open, onOpenChange);
  const state = visualState ?? (error ? "error" : loading ? "loading" : disabled ? "disabled" : "default");
  return <>
    <span ref={anchorRef} hidden />
    {open && typeof document !== "undefined" ? createPortal(
      <div ref={scopeRef} data-ui-system="midnight-ledger" style={{ display: "contents" }}>
        <dialog ref={dialogRef} className="ml-dialog-layer"
          aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}
          aria-busy={loading || undefined} tabIndex={-1}
          onCancel={(event) => { event.preventDefault(); close(); }}
          onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
          <section className="ml-dialog" data-state={state} data-visual-state={visualState}>
            <header>
              <span><h2 id={titleId}>{title}</h2>{description ? <p id={descriptionId}>{description}</p> : null}</span>
              <button type="button" className="ml-dialog__close" aria-label="关闭对话框" onClick={close}><X size={17} aria-hidden="true" /></button>
            </header>
            <div className="ml-dialog__body">
              {loading ? <div className="ml-dialog__loading" role="status"><CircleNotch size={18} className="ml-spin" aria-hidden="true" />正在处理，请稍候…</div> : null}
              {error ? <div className="ml-dialog__error" role="alert"><WarningCircle size={18} aria-hidden="true" />{typeof error === "string" ? error : "处理失败，请检查后重试。"}</div> : null}
              <div inert={disabled || loading ? true : undefined}>{children}</div>
            </div>
            {actions ? <footer><div inert={disabled || loading ? true : undefined}>{actions}</div></footer> : null}
          </section>
        </dialog>
      </div>, document.body,
    ) : null}
  </>;
}
