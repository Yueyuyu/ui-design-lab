import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, CaretRight, DotsSixVertical, Plus, Trash, TextT, TextH, CheckSquare, CaretDown, ArrowCounterClockwise } from '@phosphor-icons/react';
import { FolioButton } from './Primitives.jsx';
import { folioBlockTypes, folioId } from './model.js';
const icons = { paragraph: TextT, heading: TextH, todo: CheckSquare, toggle: CaretDown };

export function FolioBlockEditor({ blocks, onChange, disabled = false }) {
  const [menu, setMenu] = useState(null);
  const [undo, setUndo] = useState(null);
  const [focusId, setFocusId] = useState(null);
  const menuRef = useRef(null);
  const fields = useRef(new Map());
  const triggerRef = useRef(null);
  useEffect(() => { if (menu) menuRef.current?.querySelector('button:not(:disabled)')?.focus(); }, [menu]);
  useEffect(() => { if (focusId) { fields.current.get(focusId)?.focus(); setFocusId(null); } }, [blocks, focusId]);
  const update = (id, patch) => onChange(blocks.map(block => block.id === id ? { ...block, ...patch } : block));
  function choose(type) {
    if (menu.id) { update(menu.id, { type, ...(type === 'toggle' ? { open: true } : {}) }); setFocusId(menu.id); }
    else { const id = folioId(); onChange([...blocks, { id, type, text: '', ...(type === 'toggle' ? { open: true } : {}) }]); setFocusId(id); }
    setMenu(null);
  }
  function move(id, offset) {
    const index = blocks.findIndex(block => block.id === id);
    if (index + offset < 0 || index + offset >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next); setMenu(null); setFocusId(id);
  }
  function remove(id) {
    const index = blocks.findIndex(block => block.id === id);
    setUndo({ block: blocks[index], index }); onChange(blocks.filter(block => block.id !== id)); setMenu(null);
    setFocusId(blocks[index + 1]?.id ?? blocks[index - 1]?.id);
  }
  const openMenu = (id, target) => { triggerRef.current = target; setMenu({ id }); };
  const closeMenu = () => { setMenu(null); triggerRef.current?.focus(); };
  function keyMenu(event) {
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const items = [...menuRef.current.querySelectorAll('button:not(:disabled)')];
      const index = items.indexOf(document.activeElement);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[next]?.focus();
    }
  }
  const renderMenu = () => <div className="fw-block-menu" ref={menuRef} role="menu" aria-label="块操作" onKeyDown={keyMenu} onPointerDown={event => {
    // WebKit 的按钮点击不自动保留焦点，避免 blur 在 click 执行动作前卸载菜单。
    const button = event.target.closest('button');
    if (button && !button.disabled) { event.preventDefault(); button.focus(); }
  }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenu(null); }}>
    <small>{menu.id ? '转换为' : '添加内容块'}</small>{Object.entries(folioBlockTypes).map(([type, label]) => { const Icon = icons[type]; return <FolioButton role="menuitem" key={type} onClick={() => choose(type)}><Icon size={17} />{label}</FolioButton>; })}
    {menu.id && <><hr /><FolioButton role="menuitem" disabled={blocks[0]?.id === menu.id} onClick={() => move(menu.id, -1)}><ArrowUp size={17} />上移</FolioButton><FolioButton role="menuitem" disabled={blocks.at(-1)?.id === menu.id} onClick={() => move(menu.id, 1)}><ArrowDown size={17} />下移</FolioButton><FolioButton role="menuitem" tone="danger" onClick={() => remove(menu.id)}><Trash size={17} />删除块</FolioButton></>}
  </div>;
  return <section className="fw-block-editor" aria-label="页面内容">
    {blocks.map((block, index) => <div key={block.id} className="fw-block" data-block-id={block.id} data-kind={block.type}>
      <FolioButton className="fw-block-handle" aria-label={`块 ${index + 1} 操作`} aria-haspopup="menu" aria-expanded={menu?.id === block.id} disabled={disabled} onClick={e => menu?.id === block.id ? closeMenu() : openMenu(block.id, e.currentTarget)}><DotsSixVertical size={18} /></FolioButton>
      <div className="fw-block-content">
        <div className="fw-block-line">{block.type === 'todo' && <input type="checkbox" aria-label={`完成 ${block.text || '待办'}`} checked={!!block.checked} disabled={disabled} onChange={e => update(block.id, { checked: e.target.checked })} />}
          {block.type === 'toggle' && <FolioButton aria-label={`${block.open ? '折叠' : '展开'} ${block.text || '内容'}`} aria-expanded={!!block.open} disabled={disabled} onClick={() => update(block.id, { open: !block.open })}><CaretRight size={15} style={{ transform: block.open ? 'rotate(90deg)' : undefined }} /></FolioButton>}
          <textarea ref={node => node ? fields.current.set(block.id, node) : fields.current.delete(block.id)} className={block.checked && block.type === 'todo' ? 'fw-completed' : ''} aria-label={`${folioBlockTypes[block.type]}块 ${index + 1}`} value={block.text} disabled={disabled} rows={Math.max(1, Math.ceil(block.text.length / 48))} placeholder="写点什么，或输入 / 选择块…" onChange={e => update(block.id, { text: e.target.value })} onKeyDown={event => {
            // 中文输入法组合期间的斜杠/确认键属于输入法，不能被块命令截获。
            if (event.key === '/' && !event.nativeEvent.isComposing && event.keyCode !== 229 && !block.text) { event.preventDefault(); openMenu(block.id, event.currentTarget); }
          }} />
        </div>{block.type === 'toggle' && block.open && <textarea className="fw-toggle-content" aria-label={`折叠内容 ${index + 1}`} value={block.detail ?? ''} disabled={disabled} rows={2} placeholder="展开后要显示的内容…" onChange={e => update(block.id, { detail: e.target.value })} />}
      </div>{menu?.id === block.id && renderMenu()}
    </div>)}
    <div className="fw-block-add"><FolioButton disabled={disabled} aria-haspopup="menu" aria-expanded={menu?.id === null} onClick={e => menu?.id === null ? closeMenu() : openMenu(null, e.currentTarget)}><Plus size={16} />添加内容块</FolioButton>{menu?.id === null && renderMenu()}</div>
    {undo && <div className="fw-undo" role="status"><span>已删除一个内容块</span><FolioButton disabled={disabled} onClick={() => { const next = [...blocks]; next.splice(Math.min(undo.index, next.length), 0, undo.block); onChange(next); setFocusId(undo.block.id); setUndo(null); }}><ArrowCounterClockwise size={15} />撤销删除</FolioButton></div>}
  </section>;
}
