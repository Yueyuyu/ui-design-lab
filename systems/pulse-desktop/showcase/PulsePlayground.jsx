import { useLayoutEffect, useRef, useState } from 'react';
import { PulseDesktopDock } from '../web/index.js';
import { BotMark } from '../web/BotMark.jsx';
import { clampPosition, dockingSide, modeLabels } from '../web/model.js';
import { personas } from '../web/upstream/pulse.js';
import { demoTasks } from './demo-data.js';
import cursorIcon from '../assets/cursor.svg';

export function PulsePlayground() {
  const [persona,setPersona]=useState('calm');
  const [shape,setShape]=useState('blob');
  const [useLogo,setUseLogo]=useState(false);
  const [multiple,setMultiple]=useState(false),[cursorLogo,setCursorLogo]=useState(true);
  const [cursorTasks,setCursorTasks]=useState([{id:'cursor-demo',title:'Cursor 示例 · 检查页面',state:'attention',watched:false}]);
  const previousLayout=useRef({mode:'compact',side:'right',scale:1});
  const [mode, setMode] = useState('compact');
  const [wallpaper, setWallpaper] = useState('mist');
  const [scale, setScale] = useState(1);
  const [remaining, setRemaining] = useState(69);
  const [dataState, setDataState] = useState('ready');
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [tasks, setTasks] = useState(demoTasks);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState({ x: 260, y: 112 });
  const [side, setSide] = useState('right');
  const [notice, setNotice] = useState('悬停预览、点击展开；黑色轨道空白处可拖动，靠近两侧边缘会吸附。');
  const stage = useRef(null);
  const widget = useRef(null);
  const drag = useRef(null);
  const currentPosition = useRef(position);
  const suppressedClick = useRef(false);
  const geometry = () => ({ bounds: { width: stage.current.clientWidth, height: stage.current.clientHeight }, size: { width: widget.current.getBoundingClientRect().width, height: widget.current.getBoundingClientRect().height } });
  const place = next => { currentPosition.current = next; setPosition(next); };

  useLayoutEffect(() => {
    if (!stage.current || !widget.current) return;
    const fit = () => {
      const { bounds, size } = geometry();
      place(clampPosition({ ...currentPosition.current, ...(mode === 'docked' ? { x: side === 'right' ? bounds.width - size.width : 0 } : {}) }, bounds, size, mode === 'docked' ? 0 : 20));
    };
    const before=previousLayout.current;
    const offset=(m,s,k)=>s==='right' ? (m==='expanded'?278:m==='docked'?-44:0)*k : 0;
    currentPosition.current={...currentPosition.current,x:currentPosition.current.x+offset(before.mode,before.side,before.scale)-offset(mode,side,scale)};
    previousLayout.current={mode,side,scale};
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(stage.current); observer.observe(widget.current);
    return () => observer.disconnect();
  }, [mode, scale, side, tasks]);

  const startDrag = event => {
    if (event.button !== 0 || drag.current) return;
    drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, start: currentPosition.current, moved: false };
    suppressedClick.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = event => {
    const gesture = drag.current;
    if (!gesture || event.pointerId !== gesture.pointer) return;
    const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
    if (Math.hypot(dx, dy) > 5) gesture.moved = true;
    if (!gesture.moved) return;
    const { bounds, size } = geometry();
    place(clampPosition({ x: gesture.start.x + dx, y: gesture.start.y + dy }, bounds, size));
  };
  const endDrag = event => {
    const gesture = drag.current;
    if (!gesture || event.pointerId !== gesture.pointer) return;
    drag.current = null;
    if (event.type === 'pointercancel') return;
    suppressedClick.current = gesture.moved;
    if (!gesture.moved) return;
    const { bounds, size } = geometry();
    const nextSide = dockingSide(currentPosition.current, bounds, size);
    if (nextSide) { setSide(nextSide); setMode('docked'); setNotice(`已吸附${nextSide === 'left' ? '左' : '右'}侧；点击细条展开。`); }
    else if (mode === 'docked') setMode('compact');
  };
  const watch = id => setTasks(current => current.map(task => task.id === id ? { ...task, watched: !task.watched } : task));
  const tryMood = mood => {
    setDataState(mood === 'offline' ? 'error' : 'ready');
    setTasks(mood === 'idle' ? [] : demoTasks.map((task, index) => ({ ...task, state: mood === 'happy' ? 'completed' : mood === 'attention' && index === 0 ? 'attention' : task.state })));
    setNotice('正在预览 Pulse 原版机器人的示例动作，未改变真实任务。环表示额度，表情表示任务状态。');
  };
  const reset = () => { setMultiple(false);setCursorLogo(true);setCursorTasks([{id:'cursor-demo',title:'Cursor 示例 · 检查页面',state:'attention',watched:false}]);setPersona('calm'); setShape('blob'); setUseLogo(false); setMotionEnabled(true); setMode('compact'); setPinned(false); setTasks(demoTasks); setRemaining(69); setDataState('ready'); setScale(1); place({ x: 260, y: 112 }); setNotice('已重置本地样例，真实 Codex 数据未改变。'); };

  return <section className="pd-playground">
    <header className="pd-intro"><span>PULSE DESKTOP / INTERACTIVE PROTOTYPE</span><h1>Pulse 原版，来到 Windows。</h1><p>沿用现成造型、配色与动作；这里只验证 Windows 呈现，不重新设计角色。</p></header>
    <div className="pd-lab-controls">
      <label>应用示例<select value={multiple?'multiple':'single'} onChange={event=>setMultiple(event.target.value==='multiple')}><option value="single">仅 Codex（示例）</option><option value="multiple">Codex + Cursor（示例）</option></select></label>
      <div className="pd-segment" role="group" aria-label="窗口状态">{Object.entries(modeLabels).map(([id, label]) => <button key={id} aria-pressed={mode === id} onClick={() => setMode(id)}>{label}</button>)}</div>
      <label>背景<select value={wallpaper} onChange={event => setWallpaper(event.target.value)}><option value="mist">浅色 · 雾白</option><option value="night">深色 · 夜幕</option><option value="terrain">复杂 · 山色</option></select></label>
      <label>渲染缩放<select value={scale} onChange={event => setScale(Number(event.target.value))}>{[1, 1.25, 1.5, 2].map(value => <option value={value} key={value}>{value * 100}%</option>)}</select></label>
      <button className="pd-lab-button" onClick={reset}>重置</button>
    </div>
    <div className="pd-personality-strip">
      <div className="pd-personality-label"><strong>Pulse Bot</strong><span>原版动作 · 本机资源</span></div>
      <div className="pd-personality-samples" role="group" aria-label="机器人表情示例">
        {Object.entries({working:'工作',idle:'待命',happy:'完成',attention:'需处理',offline:'离线'}).map(([mood,label]) => <button type="button" key={mood} onClick={() => tryMood(mood)} aria-label={`预览${label}表情`}><BotMark mood={mood} motionEnabled={false}/><span>{label}</span></button>)}
      </div>
      <label>人格<select aria-label="机器人人格" value={persona} onChange={e=>setPersona(e.target.value)}>{personas.map(p=><option key={p}>{p}</option>)}</select></label>
      <label>造型<select aria-label="机器人造型" value={shape} onChange={e=>setShape(e.target.value)}>{['blob','pebble','bean','egg','squircle','tablet','capsule','cylinder','hex','gem','crystal','wedge','shield','dome','arch','cloud','teardrop','leaf'].map(p=><option key={p}>{p}</option>)}</select></label>
      <button type="button" className="pd-lab-button" aria-pressed={useLogo} onClick={()=>setUseLogo(v=>!v)}>品牌图标</button>
      <button type="button" className="pd-motion-toggle" aria-pressed={motionEnabled} onClick={() => setMotionEnabled(value => !value)}><span className="pd-toggle-track"><i/></span>灵动表情</button>
    </div>
    <div className="pd-stage-scroll"><div ref={stage} className="pd-stage" data-wallpaper={wallpaper} style={{ minWidth: Math.max(0, 384 * scale), minHeight: Math.max(640, 630 * scale) }} aria-label="桌面模拟画布">
      <div className="pd-wallpaper-caption"><span>DESKTOP STUDY — 01</span><p>少一点打扰。<br/>重要的状态，一直在。</p><small>背景仅用于对比度与透明边缘验证</small></div>
      <div ref={widget} className="pd-positioner" style={{ left: position.x, top: position.y }} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onClickCapture={event => { if (suppressedClick.current) { event.preventDefault(); event.stopPropagation(); suppressedClick.current = false; } }} onKeyDown={event => {
        if (!event.target.classList.contains('pd-drag')) return;
        const directions = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] };
        if (event.key === 'Home') { event.preventDefault(); place({ x: 40, y: 60 }); }
        if (directions[event.key]) { event.preventDefault(); const [x, y] = directions[event.key], { bounds, size } = geometry(); place(clampPosition({ x: position.x + x, y: position.y + y }, bounds, size)); }
      }}>
        <div style={{ zoom: scale }}><PulseDesktopDock mode={mode} applications={[
          {id:'codex',name:'Codex',remaining,tasks:dataState==='error'?tasks.map(task=>({...task,state:'unavailable'})):tasks,quotaState:dataState,taskState:dataState,resetLabel:'示例 · 3 天 8 小时后重置',sourceLabel:'示例数据',iconMode:useLogo?'brand':'robot',persona,shape},
          ...(multiple?[{id:'cursor-demo',name:'Cursor · 示例',brandIcon:cursorIcon,remaining:37,tasks:cursorTasks,quotaState:'ready',taskState:'ready',resetLabel:'示例周期 · 非真实额度',sourceLabel:'未接入 · 示例数据',iconMode:cursorLogo?'brand':'robot',persona:'curious',shape:'pebble'}]:[])
        ]} pinned={pinned} motionEnabled={motionEnabled} dockSide={side} onModeChange={setMode} onPinnedChange={setPinned} onDragStart={startDrag}
          onApplicationIconChange={(id,value)=>id==='codex'?setUseLogo(value==='brand'):setCursorLogo(value==='brand')}
          onApplicationWatchTask={(appId,id)=>appId==='codex'?watch(id):setCursorTasks(current=>current.map(task=>task.id===id?{...task,watched:!task.watched}:task))}
          onApplicationRefresh={()=>{setDataState('ready');setNotice('示例数据已恢复，未读取真实账户。');}}
          onApplicationOpenTask={(appId,id)=>setNotice(`已选择 ${appId} 示例任务「${(appId==='codex'?tasks:cursorTasks).find(task=>task.id===id)?.title}」。没有打开真实对话。`)}/></div>
      </div>
      <div className="pd-stage-badge">本机设计验证 · 示例数据 · 非实时账户</div>
    </div></div>
    <div className="pd-simulation"><label>剩余额度 <input type="range" min="0" max="100" value={remaining} onChange={event => setRemaining(Number(event.target.value))}/><output>{remaining}%</output></label><label>连接<select value={dataState} onChange={event => setDataState(event.target.value)}><option value="ready">正常</option><option value="loading">读取中</option><option value="error">读取失败</option></select></label><button className="pd-lab-button" onClick={() => { setTasks(current => current.map(task => task.id === 'demo-design' ? { ...task, state: task.state === 'completed' ? 'running' : 'completed' } : task)); setNotice('示例状态已切换。关注任务完成后仍保留；没有发送系统通知。'); }}>模拟任务完成 / 继续</button></div>
    <p className="pd-status-message" role="status">{notice}</p>
    <div className="pd-notes"><p><strong>01 / 不占你的工作区</strong><br/>拖动手柄移动；靠近左右边缘收起。键盘聚焦手柄后，可用方向键移动。</p><p><strong>02 / 关注不会消失</strong><br/>星标选择重点任务；固定面板后点击画布也不收起，Escape 仍可关闭。</p><p><strong>03 / 读数不冒充进度</strong><br/>圆环只表示额度。读取失败显示未知，不显示零或绿色健康状态。</p></div>
  </section>;
}
