import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DotsThree, X } from '@phosphor-icons/react';
import { DialogueIconButton } from './Controls.jsx';

let modalCount=0,previousOverflow='';
export function DialogueDialog({open,onOpenChange,title,children,footer,loading,disabled,error}) {
  const ref=useRef(null),id=useId(),change=useRef(onOpenChange);change.current=onOpenChange;
  useEffect(()=>{
    if(!open)return;
    const element=ref.current,trigger=document.activeElement;
    if(modalCount++===0){previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';}
    element.showModal();
    return ()=>{element.close();if(--modalCount===0)document.body.style.overflow=previousOverflow;if(trigger?.isConnected)trigger.focus();};
  },[open]);
  function containFocus(event) {
    if(event.key!=='Tab')return;
    const controls=[...ref.current.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')].filter(element=>element.tabIndex>=0&&!element.disabled&&!element.closest('[inert]')&&element.getClientRects().length);
    const first=controls[0],last=controls.at(-1),active=document.activeElement;
    if(!first){event.preventDefault();ref.current.focus();return;}
    if(event.shiftKey&&(active===first||!controls.includes(active))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(active===last||!controls.includes(active))){event.preventDefault();first.focus();}
  }
  if(!open || typeof document==='undefined')return null;
  // 原生 modal 约束焦点；使用 DOM inert 属性兼容 React 18 与 19。
  return createPortal(<div data-ui-system="dialogue-ui"><dialog className="du-dialog" ref={ref} aria-labelledby={id} onKeyDown={containFocus} onCancel={event=>{event.preventDefault();change.current?.(false);}}><header><h2 id={id}>{title}</h2><DialogueIconButton label="关闭对话框" icon={X} onClick={()=>onOpenChange?.(false)}/></header>{loading && <p role="status">正在处理，请稍候…</p>}{error && <p role="alert" className="du-error">{error}</p>}<div className="du-dialog-body" ref={el=>{if(el)el.inert=!!(loading || disabled);}}>{children}</div>{footer && <footer ref={el=>{if(el)el.inert=!!(loading || disabled);}}>{footer}</footer>}</dialog></div>,document.body);
}
export function DialogueDropdownMenu({label='更多操作',items,disabled}) {
  const [open,setOpen]=useState(false),root=useRef(null),trigger=useRef(null),menu=useRef(null),id=useId();
  function close(focus=false){setOpen(false);if(focus)trigger.current?.focus();}
  useEffect(()=>{if(!open)return;const outside=event=>{if(!root.current?.contains(event.target))setOpen(false);};document.addEventListener('pointerdown',outside);menu.current?.querySelector('button:not(:disabled)')?.focus();return()=>document.removeEventListener('pointerdown',outside);},[open]);
  useEffect(()=>{if(disabled)setOpen(false);},[disabled]);
  return <div ref={root} className="du-menu" onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))close();}}><button ref={trigger} type="button" className="du-button du-button--secondary" disabled={disabled} aria-haspopup="menu" aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>setOpen(!open)} onKeyDown={event=>{if(event.key==='ArrowDown'){event.preventDefault();setOpen(true);}}}><DotsThree size={20} aria-hidden="true"/>{label}</button>{open && <div ref={menu} role="menu" aria-label={label} id={id} onKeyDown={event=>{const buttons=[...menu.current.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(document.activeElement);if(event.key==='Escape'){event.preventDefault();close(true);}else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){event.preventDefault();buttons[event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}}}>{items.map(item=><button type="button" role="menuitem" key={item.id} disabled={item.disabled} onClick={()=>{close(true);item.onSelect?.();}}>{item.label}</button>)}</div>}</div>;
}
