import { X } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useModalLifecycle } from "./useModalLifecycle.js";
export function ClearDrawer({
  open,
  onOpenChange,
  title,
  children,
  actions,
  loading,
  disabled,
  error
}) {
  const id = useId(),
    {
      anchorRef,
      dialogRef,
      scopeRef,
      close
    } = useModalLifecycle(open, onOpenChange);
  return <><span ref={anchorRef} hidden />{open ? createPortal(<div data-ui-system="clearline-console" ref={scopeRef} style={{
      display: "contents"
    }}><dialog ref={dialogRef} className="cc-drawer" aria-labelledby={id} aria-busy={loading || undefined} onCancel={e => {
        e.preventDefault();
        close();
      }}><header><h2 id={id}>{title}</h2><button type="button" onClick={close} aria-label="关闭详情"><X size={18} aria-hidden="true" /></button></header>{loading ? <p role="status">正在加载详情…</p> : null}{error ? <p role="alert">{error}</p> : null}<div inert={loading || disabled ? true : undefined}>{children}<footer>{actions}</footer></div></dialog></div>, document.body) : null}</>;
}
export function ClearDropdownMenu({
  label = "更多操作",
  items,
  disabled = false
}) {
  const [open, setOpen] = useState(false),
    root = useRef(null),
    trigger = useRef(null),
    id = useId();
  const position = usePopupPosition(root, open);
  const close = (focus = true) => {
    setOpen(false);
    if (focus) trigger.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    const away = e => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    root.current?.querySelector('[role="menuitem"]:not(:disabled)')?.focus();
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);
  const keys = e => {
    const all = [...root.current.querySelectorAll('[role="menuitem"]:not(:disabled)')],
      i = all.indexOf(document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") setOpen(false);else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      all[e.key === "Home" ? 0 : e.key === "End" ? all.length - 1 : (i + (e.key === "ArrowDown" ? 1 : -1) + all.length) % all.length]?.focus();
    }
  };
  return <span className="cc-popover-anchor" ref={root}><button type="button" ref={trigger} aria-haspopup="menu" aria-controls={id} aria-expanded={open} disabled={disabled} onClick={() => setOpen(!open)} onKeyDown={e => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
    }}>{label}</button>{open ? <div role="menu" id={id} popover="manual" style={position} className="cc-popup" onKeyDown={keys}>{items.map(item => <button type="button" role="menuitem" key={item.id} disabled={item.disabled} data-danger={item.danger} onClick={() => {
        close();
        item.onSelect?.();
      }}>{item.label}</button>)}</div> : null}</span>;
}
export function ClearPopover({
  label,
  children,
  disabled = false
}) {
  const [open, setOpen] = useState(false),
    ref = useRef(null),
    button = useRef(null),
    id = useId();
  const position = usePopupPosition(ref, open);
  useEffect(() => {
    if (!open) return;
    const listener = e => {
      if (e.type === "keydown" && e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      } else if (e.type === "pointerdown" && !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", listener);
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("pointerdown", listener);
      document.removeEventListener("keydown", listener);
    };
  }, [open]);
  return <span className="cc-popover-anchor" ref={ref}><button type="button" ref={button} disabled={disabled} aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>{label}</button>{open ? <section id={id} popover="manual" style={position} className="cc-popup" aria-label={label}>{children}<button type="button" onClick={() => {
        setOpen(false);
        button.current?.focus();
      }}>关闭</button></section> : null}</span>;
}
export function ClearTooltip({
  label,
  children
}) {
  const id = useId(),
    [open, setOpen] = useState(false),
    ref = useRef(null);
  const position = usePopupPosition(ref, open);
  return <span ref={ref} className="cc-popover-anchor" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}><button type="button" aria-describedby={open ? id : undefined} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={e => {
      if (e.key === "Escape") setOpen(false);
    }} onClick={() => setOpen(!open)}>{label}</button>{open ? <span role="tooltip" id={id} popover="manual" style={position} className="cc-popup">{children}</span> : null}</span>;
}

// 使用浏览器 top layer，避免宿主页面的 transform / overflow 截断浮层。
function usePopupPosition(ref, open) {
  const [position, setPosition] = useState({});
  useEffect(() => {
    if (!open) return;
    const popup = ref.current?.querySelector('[popover]');
    popup?.showPopover();
    const update = () => {
      const r = ref.current?.getBoundingClientRect();
      if (!r || !popup) return;
      const box = popup.getBoundingClientRect();
      const left = Math.max(8, Math.min(r.left, innerWidth - box.width - 8));
      const top = Math.max(8, Math.min(r.bottom + 8, innerHeight - box.height - 8));
      setPosition({
        position: "fixed",
        margin: 0,
        inset: "auto",
        left,
        top,
        maxHeight: "calc(100dvh - 16px)",
        overflow: "auto"
      });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
      if (popup?.matches(":popover-open")) popup.hidePopover();
    };
  }, [open]);
  return position;
}
