import {useEffect, useId, useLayoutEffect, useRef, useState} from 'react';
import {CaretDown, Check} from '@phosphor-icons/react';

export function AgentSuitePicker({suite, suites, onChange}) {
  const id = useId();
  const triggerRef = useRef(null);
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const optionRefs = useRef([]);
  const searchRef = useRef({text:'', time:0});
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(suite.id);
  const [placement, setPlacement] = useState({side:'below', maxHeight:384});
  const available = suites.filter(item => item.status !== 'draft');
  const optionId = suiteId => `${id}-${suiteId}`;

  useEffect(() => {setOpen(false); setActiveId(suite.id);}, [suite.id]);
  useEffect(() => {
    if (!open) return;
    const dismiss = event => {if (!rootRef.current?.contains(event.target)) setOpen(false);};
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    // 面板仍锚定选择器，空间不足时向上展开；滚动与缩放后重新计算可用高度。
    const position = () => {
      const rect = triggerRef.current.getBoundingClientRect();
      const below = Math.max(0, window.innerHeight - rect.bottom - 20);
      const above = Math.max(0, rect.top - 20);
      const side = below >= Math.min(384, above) ? 'below' : 'above';
      setPlacement({side, offset:rect.height + 8, maxHeight:Math.min(384, side === 'below' ? below : above)});
    };
    position();
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, {capture:true, passive:true});
    return () => {
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
    };
  }, [open]);
  useLayoutEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const option = optionRefs.current[suites.findIndex(item => item.id === activeId)];
    if (!option) return;
    // 只滚动选项列表，避免键盘移动把整页拉走。
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop;
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight;
    }
  }, [open, activeId, suites, placement.maxHeight]);

  function choose(suiteId) {
    if (!available.some(item => item.id === suiteId)) return;
    onChange(suiteId);
    setOpen(false);
    triggerRef.current.focus({preventScroll:true});
  }
  function toggle() {
    setActiveId(suite.id);
    searchRef.current = {text:'', time:0};
    setOpen(value => !value);
  }
  function onKeyDown(event) {
    if (event.key === 'Escape') {
      if (open) {event.preventDefault(); event.stopPropagation(); setOpen(false);}
      return;
    }
    if (event.key === 'Tab') {setOpen(false); return;}
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      let index = Math.max(0, available.findIndex(item => item.id === (open ? activeId : suite.id)));
      if (event.key === 'Home') index = 0;
      else if (event.key === 'End') index = available.length - 1;
      else if (open) index = Math.max(0, Math.min(available.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
      setActiveId(available[index]?.id ?? suite.id);
      setOpen(true);
    } else if (open && ['Enter', ' '].includes(event.key)) {
      event.preventDefault();
      choose(activeId);
    } else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey && !event.isComposing) {
      const now = Date.now();
      const text = (now - searchRef.current.time < 700 ? searchRef.current.text : '') + event.key.toLocaleLowerCase();
      searchRef.current = {text, time:now};
      const match = available.find(item => [item.displayName, item.localizedName].some(name => name.toLocaleLowerCase().startsWith(text)));
      if (match) {event.preventDefault(); setActiveId(match.id); setOpen(true);}
    }
  }

  return <div className="agent-suite-picker" ref={rootRef} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);}}>
    <label className="agent-suite-label" id={`${id}-label`} htmlFor={`${id}-trigger`}>选择设计套系</label>
    <button id={`${id}-trigger`} className="agent-suite-select" ref={triggerRef} type="button" role="combobox"
      aria-labelledby={`${id}-label`} aria-expanded={open} aria-haspopup="listbox" aria-controls={`${id}-list`}
      aria-activedescendant={open ? optionId(activeId) : undefined} onClick={toggle} onKeyDown={onKeyDown}>
      <img src={suite.scenePreviewUrl ?? suite.thumbnailUrl} alt=""/>
      <span><strong>{suite.displayName}</strong><span>{suite.localizedName}</span></span>
      <CaretDown size={24} aria-hidden="true"/>
    </button>
    <ul id={`${id}-list`} className="agent-suite-options" role="listbox" aria-labelledby={`${id}-label`} hidden={!open}
      data-side={placement.side} style={{maxHeight:placement.maxHeight, bottom:placement.side === 'above' ? placement.offset : undefined}} ref={listRef}>
      {suites.map((item, index) => <li key={item.id} id={optionId(item.id)} role="option"
        ref={node => {optionRefs.current[index] = node;}} aria-selected={suite.id === item.id} aria-disabled={item.status === 'draft'}
        data-active={activeId === item.id} onMouseDown={event => event.preventDefault()}
        onPointerMove={() => {if (item.status !== 'draft') setActiveId(item.id);}} onClick={() => choose(item.id)}>
        <img src={item.scenePreviewUrl ?? item.thumbnailUrl} alt=""/>
        <span className="agent-suite-option-name"><strong>{item.displayName}</strong><span>{item.localizedName}</span></span>
        {item.status === 'draft' ? <span className="agent-suite-option-status">开发中</span> : suite.id === item.id ? <Check size={21} weight="bold" aria-hidden="true"/> : null}
      </li>)}
    </ul>
  </div>;
}
