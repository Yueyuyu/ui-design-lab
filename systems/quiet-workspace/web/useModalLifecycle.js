import { useLayoutEffect, useRef } from "react";

// 每套系独立实现；原生 top layer 保证浮层不受祖先 transform 和 overflow 影响。
export function useModalLifecycle(open, onOpenChange) {
  const anchorRef = useRef(null);
  const dialogRef = useRef(null);
  const scopeRef = useRef(null);
  const onChangeRef = useRef(onOpenChange);
  onChangeRef.current = onOpenChange;

  useLayoutEffect(() => {
    if (!open || !dialogRef.current) return undefined;
    const dialog = dialogRef.current;
    const returnTarget = document.activeElement;
    const density = anchorRef.current?.closest("[data-density]")?.dataset.density ?? "comfortable";
    scopeRef.current.dataset.density = density;
    const theme = anchorRef.current?.closest("[data-theme-preview]");
    if (theme) scopeRef.current.style.cssText += ";" + theme.style.cssText;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector("button")?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key !== "Tab") return;
      const controls = [...dialog.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')]
        .filter((element) => !element.disabled && !element.closest("[inert]") && element.tabIndex >= 0 && element.getClientRects().length);
      const first = controls[0];
      const last = controls.at(-1);
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      dialog.removeEventListener("keydown", onKeyDown);
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
    };
  }, [open]);

  return {
    anchorRef, dialogRef, scopeRef,
    close: () => onChangeRef.current?.(false),
  };
}
