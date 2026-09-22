import {useLayoutEffect, useRef} from 'react';

// “打开方式”不等于固定；临时面板共享一份可取消的离开计时器。
export function useDockDismissal(rootRef, {mode, pinned, attached, onModeChange}) {
  const change = useRef(onModeChange);
  change.current = onModeChange;
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || mode !== 'expanded' || pinned) return;
    let timer = null;
    const cancel = () => {clearTimeout(timer); timer = null;};
    const close = () => {cancel(); change.current?.(attached ? 'docked' : 'compact');};
    const keyboardWithin = () => root.dataset.keyboard === 'true' && root.contains(document.activeElement);
    const leave = () => {
      if (timer !== null || keyboardWithin()) return;
      timer = setTimeout(close, 320);
    };
    const move = event => {
      // 展开容器含有右下方透明空白，不能把整块矩形都视作面板内部。
      if (root.contains(event.target) && event.target.closest?.('.pd-panel,.pd-rail,.pd-edge')) cancel();
      else leave();
    };
    const outside = event => {if (!root.contains(event.target)) close();};
    const focusOut = event => {if (event.relatedTarget && !root.contains(event.relatedTarget)) close();};
    const hostPointer = event => {if (event.detail === true) cancel(); else if (event.detail === false) leave();};
    // 细条展开会替换触发元素；在文档层判定实际移动，避免新元素的迟到 enter 取消离开。
    document.addEventListener('pointermove', move, true);
    document.addEventListener('pointerleave', leave);
    root.addEventListener('focusout', focusOut);
    root.addEventListener('keydown', cancel);
    document.addEventListener('pointerdown', outside, true);
    window.addEventListener('blur', close);
    // Windows 合成窗口可能漏发 DOM leave，由宿主提供只读指针边界补偿。
    window.addEventListener('pulse:host-pointer', hostPointer);
    return () => {
      cancel();
      document.removeEventListener('pointermove', move, true);
      document.removeEventListener('pointerleave', leave);
      root.removeEventListener('focusout', focusOut);
      root.removeEventListener('keydown', cancel);
      document.removeEventListener('pointerdown', outside, true);
      window.removeEventListener('blur', close);
      window.removeEventListener('pulse:host-pointer', hostPointer);
    };
  }, [rootRef, mode, pinned, attached]);
}
