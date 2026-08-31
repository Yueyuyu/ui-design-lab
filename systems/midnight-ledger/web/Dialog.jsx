import { X } from "@phosphor-icons/react";
import { useEffect } from "react";

export function LedgerDialog({ open, onOpenChange, title, description, children, actions, loading, error, disabled, visualState }) {
  useEffect(() => { if (!open) return undefined; const close = (event) => event.key === "Escape" && onOpenChange?.(false); window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [open, onOpenChange]);
  if (!open) return null;
  return <div className="ml-dialog-layer" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onOpenChange?.(false)}><section className="ml-dialog" role="dialog" aria-modal="true" aria-labelledby="ml-dialog-title" data-state={error ? "error" : loading ? "loading" : disabled ? "disabled" : "default"} data-visual-state={visualState}><header><span><h2 id="ml-dialog-title">{title}</h2>{description ? <p>{description}</p> : null}</span><button type="button" aria-label="关闭" onClick={() => onOpenChange?.(false)}><X size={17} /></button></header><div className="ml-dialog__body">{children}{error ? <p className="ml-dialog__error">{error}</p> : null}{loading ? <p className="ml-dialog__loading">正在同步交易设置…</p> : null}</div>{actions ? <footer>{actions}</footer> : null}</section></div>;
}
