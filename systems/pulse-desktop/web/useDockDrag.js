import {useEffect, useRef, useState} from 'react';

export const DRAG_THRESHOLD = 6;

// 阈值以前保留原按钮的点击目标；跨过阈值才把整条胶囊交给宿主移动。
export function useDockDrag(rootRef, onDragStart) {
  const gesture = useRef(null), suppressClick = useRef(false);
  const [pressed, setPressed] = useState(false);
  const finish = () => {
    const current = gesture.current;
    gesture.current = null;
    if (current?.capture?.hasPointerCapture(current.id)) current.capture.releasePointerCapture(current.id);
    setPressed(false);
  };
  useEffect(() => {
    const end = () => finish();
    const blur = () => {if (!gesture.current?.native) finish();};
    window.addEventListener('pulse:drag-end', end);
    window.addEventListener('blur', blur);
    return () => {window.removeEventListener('pulse:drag-end', end);window.removeEventListener('blur', blur);};
  }, []);
  return {
    pressed,
    isPressed: () => !!gesture.current,
    handlers: {
      onPointerDownCapture(event) {
        if (event.button !== 0 || !event.isPrimary || gesture.current || !onDragStart) return;
        suppressClick.current = false;
        if (!event.target.closest('.pd-rail,.pd-edge')) return;
        const capture = event.target.closest('button') ?? event.target.closest('.pd-rail');
        gesture.current = {id:event.pointerId, x:event.clientX, y:event.clientY, capture, moved:false, native:false};
        capture.setPointerCapture(event.pointerId);
        setPressed(true);
      },
      onPointerMoveCapture(event) {
        const current = gesture.current;
        if (!current || event.pointerId !== current.id || current.moved) return;
        if (!(event.buttons & 1)) {finish();return;}
        if (Math.hypot(event.clientX-current.x, event.clientY-current.y) <= DRAG_THRESHOLD) return;
        current.moved = true;suppressClick.current = true;
        current.capture = rootRef.current;
        current.capture.setPointerCapture(event.pointerId);
        // 返回 true 表示原生拖动循环接管；它结束后必须发送 pulse:drag-end。
        current.native = onDragStart(event) === true;
      },
      onPointerUpCapture(event) {if (event.pointerId === gesture.current?.id && !gesture.current.native) finish();},
      onPointerCancelCapture(event) {if (event.pointerId === gesture.current?.id && !gesture.current.native) finish();},
      onLostPointerCapture(event) {
        const current = gesture.current;
        if (current && event.pointerId === current.id && !current.native && !current.capture.hasPointerCapture(current.id)) finish();
      },
      onClickCapture(event) {
        if (suppressClick.current && event.detail !== 0) {event.preventDefault();event.stopPropagation();}
      },
    },
  };
}
