import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { PulseIcon } from './Icons.jsx';
import openai from '../assets/openai.svg';
import { revealPanel } from './upstream/motion.js';
import { bubblePath, berthPath } from './upstream/pulse.js';
import { BotMark } from './BotMark.jsx';
import { botMood, newlyCompleted, quotaTone, quotaValue, taskLabels } from './model.js';
import { useDockDismissal } from './useDockDismissal.js';

export function PulseQuotaRing({ remaining, state = 'ready', botState = state, mood = 'idle', motionEnabled = true, celebrating = false, persona = 'calm', shape = 'blob', useLogo = false, brandIcon = openai, brandLabel, colorIndex = 0 }) {
  const value = state === 'ready' ? quotaValue(remaining) : null;
  return <span className="pd-ring" data-tone={quotaTone(value)} aria-hidden="true">
    <svg className="pd-ring-svg" viewBox="-2 -2 40 40"><circle className="pd-ring-track" cx="18" cy="18" r="18" /><circle className="pd-ring-value" cx="18" cy="18" r="18" pathLength="100" strokeDasharray={`${value ?? 0} 100`} transform="rotate(-90 18 18)" /></svg>
    <BotMark mood={botState === 'error' ? 'offline' : botState === 'loading' ? 'loading' : value===0 && mood==='idle' ? 'spent' : mood} motionEnabled={motionEnabled} celebrating={celebrating} persona={persona} shape={shape} useLogo={useLogo} brandIcon={brandIcon} brandLabel={brandLabel} colorIndex={colorIndex}/>
  </span>;
}

export function PulseTaskRow({ task, onOpen, onWatch, disabled = false, watchDisabled = false }) {
  return <div className="pd-task" data-state={task.state}>
    <button type="button" className="pd-task-open" disabled={disabled || !(task.canOpen ?? task.state !== 'unavailable')} onClick={() => onOpen?.(task.id)} title={task.title}>
      <span className="pd-task-symbol"><PulseIcon name={task.state === 'completed' ? 'check' : task.state} /></span>
      <span className="pd-task-copy"><span className="pd-task-title">{task.title}</span><span className="pd-task-meta">{task.state === 'unavailable' ? taskLabels.unavailable : task.detail || taskLabels[task.state]}</span></span>
      <PulseIcon name="arrow" className="pd-task-arrow" />
    </button>
    <button type="button" className="pd-icon-button pd-watch" disabled={watchDisabled && !task.watched} title={watchDisabled && !task.watched ? '最多关注 5 项' : undefined} data-pd-watch={task.id} aria-label={`${task.watched ? '取消关注' : '关注'}：${task.title}`} aria-pressed={task.watched} onClick={event => {
      const scope = event.currentTarget.closest('.pd-dock') ?? event.currentTarget.parentElement.parentElement;
      onWatch?.(task.id);
      requestAnimationFrame(() => Array.from(scope?.querySelectorAll('[data-pd-watch]') ?? []).find(button => button.dataset.pdWatch === task.id)?.focus({ preventScroll:true }));
    }}><PulseIcon name="star" /></button>
  </div>;
}

export function PulseDesktopDock({ applications, onApplicationAccountAction, onApplicationIconChange, onApplicationOpenTask, onApplicationWatchTask, onApplicationRefresh, mode = 'compact', remaining = null, tasks = [], pinned = false, dataState = 'ready', quotaState = dataState, taskState = dataState, resetLabel = '示例 · 3 天 8 小时后重置', sourceLabel = '示例数据', notice = '', disabled = false, motionEnabled = true, onModeChange, onPinnedChange, onOpenTask, onWatchTask, onRetry, onRefresh, onDragStart, dockSide = 'right', persona = 'calm', shape = 'blob', useLogo = false }) {
  const entries = applications?.length ? applications : [{id:'codex',name:'Codex',remaining,tasks,quotaState,taskState,resetLabel,sourceLabel,notice,iconMode:useLogo?'brand':'robot',persona,shape}];
  const [selectedId,setSelectedId]=useState(entries[0].id);
  const selectedIndex=Math.max(0,entries.findIndex(entry=>entry.id===selectedId));
  const selected=entries[selectedIndex];
  // 当前应用关闭后落到仍打开的第一项；它再次打开时不抢回用户的选择。
  if(selectedId!==selected.id)setSelectedId(selected.id);
  const page=Math.floor(selectedIndex/3),pageCount=Math.ceil(entries.length/3);
  const visibleEntries=entries.slice(page*3,page*3+3);
  const quotaLabel=selected.quotaLabel??'周剩余额度';
  const quotaMessage={error:'读取失败，不能确认最新额度',loading:'正在自动读取额度…','signed-out':'未找到有效登录，请先检查原应用',authorizing:'等待官方页面授权…',unsupported:'此产品额度尚未接入',unavailable:selected.readMode==='off'?'已停止读取':'此账户暂无可用额度数据','rate-limited':'服务限流，稍后重试'};
  // 额度、任务和操作都来自同一个选中应用，不把列表切换变成业务数据复制。
  ({remaining=null,tasks=[],quotaState='loading',taskState='loading',resetLabel='',sourceLabel='',notice=''}=selected);
  if(applications){
    onOpenTask=id=>onApplicationOpenTask?.(selected.id,id);
    onWatchTask=id=>onApplicationWatchTask?.(selected.id,id);
    onRetry=()=>onApplicationRefresh?.(selected.id);
    onRefresh=onApplicationRefresh?()=>onApplicationRefresh(selected.id):undefined;
  }
  const [attached,setAttached]=useState(mode==='docked');
  const railHeight=(attached?150:102)+(Math.min(entries.length,3)-1)*76+(pageCount>1?32:0);
  const panelOffset=(selectedIndex%3)*76;
  useLayoutEffect(()=>{if(mode==='docked') setAttached(true);},[mode]);
  const startDrag=event=>{setAttached(false);onDragStart?.(event);};
  const hover=()=>{
    if(mode!=='expanded' && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      if(rootRef.current)rootRef.current.dataset.keyboard='false';
      onModeChange?.('expanded');
    }
  };
  const panelId = useId();
  const panelRef = useRef(null);
  const [panelHeight,setPanelHeight]=useState(400);
  useLayoutEffect(()=>{
    if(!panelRef.current) return;
    const observer=new ResizeObserver(([entry])=>setPanelHeight(entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height));
    observer.observe(panelRef.current);return ()=>observer.disconnect();
  },[mode]);
  const rootRef = useRef(null);
  useLayoutEffect(()=>{rootRef.current?.dispatchEvent(new Event('pulse:layout',{bubbles:true}));},[selected.id,railHeight,panelHeight,mode]);
  useDockDismissal(rootRef,{mode,pinned,attached,onModeChange});
  useEffect(()=>{
    if(mode!=='expanded' || rootRef.current?.dataset.keyboard==='true') return;
    const animation=revealPanel(panelRef.current,dockSide);
    return ()=>animation?.cancel();
  },[mode,dockSide]);
  const previous = useRef({ tasks, taskState, applicationId:selected.id });
  const completionTimer = useRef(null);
  const [celebrating, setCelebrating] = useState(false);
  useEffect(() => {
    // 初次读取、离线恢复、取消关注不会补播完成庆祝；只有相邻有效快照中的执行→完成。
    if (selected.id===previous.current.applicationId && taskState === 'ready' && previous.current.taskState === 'ready' && newlyCompleted(previous.current.tasks, tasks)) {
      setCelebrating(true);
      clearTimeout(completionTimer.current);
      completionTimer.current = setTimeout(() => setCelebrating(false), 2600);
    }
    if (taskState !== 'ready' || selected.id!==previous.current.applicationId) {setCelebrating(false);clearTimeout(completionTimer.current);}
    previous.current = { tasks, taskState, applicationId:selected.id };
  }, [tasks, taskState, selected.id]);
  useEffect(() => () => clearTimeout(completionTimer.current), []);
  const value = quotaState === 'ready' ? quotaValue(remaining) : null;
  const running = tasks.filter(task => task.state === 'running').length;
  const attention = tasks.filter(task => task.state === 'attention').length;
  const status = taskState === 'unsupported' ? '任务尚未接入' : taskState === 'error' ? '连接中断' : taskState === 'loading' ? '读取中' : attention ? `${attention} 项需处理` : running ? `${running} 项执行中` : '暂无执行任务';
  const watched = tasks.filter(task => task.watched);
  const others = tasks.filter(task => !task.watched);
  const changeMode = (next, keyboard = false) => {
    if (rootRef.current) rootRef.current.dataset.keyboard = String(keyboard);
    onModeChange?.(next);
    // 切换后回到可见控件，不把焦点留在卸载的按钮上。
    requestAnimationFrame(() => rootRef.current?.querySelector('[data-pd-primary]')?.focus({ preventScroll: true }));
  };
  const collapsedMode=attached?'docked':'compact';
  const openTask=id=>{onOpenTask?.(id);if(!pinned)onModeChange?.(collapsedMode);};
  return <div ref={rootRef} className="pd-dock" data-mode={mode} data-side={dockSide} data-tone={quotaTone(value)} data-attached={attached} onPointerDown={()=>{if(rootRef.current)rootRef.current.dataset.keyboard='false';}} onKeyDown={event => {
    if(rootRef.current)rootRef.current.dataset.keyboard='true';
    if (event.key === 'Escape' && mode === 'expanded') { event.stopPropagation(); changeMode(collapsedMode, true); }
  }}>
    {mode === 'docked' ? <button type="button" className="pd-edge" onPointerEnter={hover} data-pd-primary aria-label={`展开桌面伴侣，${quotaLabel} ${value === null ? '未知' : `${value}%`}，${status}`} onClick={event => changeMode('expanded', event.detail === 0)} onPointerDown={startDrag}><svg width="6" height="96" viewBox="0 0 6 96" aria-hidden="true"><path d={berthPath(6,96,0)}/></svg></button> : <>
      <div className="pd-rail" style={{height:railHeight}}>
        {attached && <svg className="pd-rail-shape" style={{height:railHeight}} viewBox={`0 0 64 ${railHeight}`} aria-hidden="true"><path d={berthPath(64,railHeight)}/></svg>}
        <button type="button" className="pd-drag" aria-label="拖动浮条；方向键移动，Home 复位" onPointerDown={startDrag}><span className="pd-grab-mark"/></button>
        {visibleEntries.map((entry,index)=>{
          const entryValue=entry.quotaState==='ready'?quotaValue(entry.remaining):null;
          const active=entry.id===selected.id,entryMood=botMood(entry.tasks??[],entry.taskState);
          return <button key={entry.id} type="button" className="pd-summary" data-application={entry.id} data-tone={quotaTone(entryValue)} style={{top:(attached?46:22)+index*76}} onPointerEnter={()=>{setSelectedId(entry.id);hover();}} data-pd-primary={active?true:undefined} aria-expanded={active&&mode==='expanded'} aria-controls={active&&mode==='expanded'?panelId:undefined} aria-label={`${entry.name}，${entry.quotaLabel??'周剩余额度'} ${entryValue===null?'未知':`${entryValue}%`}，${active?status:'查看状态'}，${active&&mode==='expanded'?'收起':'展开'}详情`} onClick={event=>{setSelectedId(entry.id);changeMode(active&&mode==='expanded'?collapsedMode:'expanded',event.detail===0);}}>
            <PulseQuotaRing remaining={entryValue} state={entry.quotaState} botState={entry.taskState} mood={active&&celebrating&&entryMood!=='attention'?'happy':entryMood} celebrating={active&&celebrating&&entryMood!=='attention'} motionEnabled={motionEnabled&&!disabled} persona={entry.persona??persona} shape={entry.shape??shape} useLogo={entry.iconMode==='brand'} brandIcon={entry.brandIcon===undefined?openai:entry.brandIcon} brandLabel={entry.brandLabel} colorIndex={page*3+index}/><span className="pd-value">{entryValue===null?'—':`${entryValue}%`}</span>
          </button>;
        })}
        {pageCount>1&&<div className="pd-pages" aria-label="应用分页"><button type="button" aria-label="上一组应用" onClick={()=>setSelectedId(entries[((page-1+pageCount)%pageCount)*3].id)}>‹</button><span>{page+1}/{pageCount}</span><button type="button" aria-label="下一组应用" onClick={()=>setSelectedId(entries[((page+1)%pageCount)*3].id)}>›</button></div>}
      </div>
      {mode === 'expanded' && <section ref={panelRef} id={panelId} className="pd-panel" style={{marginTop:panelOffset}} data-application={selected.id} aria-label="桌面伴侣详情" aria-busy={quotaState === 'loading' || taskState === 'loading'}>
        <svg className="pd-panel-shape" viewBox={`0 0 270 ${panelHeight}`} preserveAspectRatio="none" aria-hidden="true"><path d={bubblePath(270,panelHeight,dockSide,attached?64:40)}/></svg>
        <header className="pd-panel-header"><div className="pd-service-title">{selected.brandIcon===null?<span aria-hidden="true" className="pd-brand-label">{selected.brandLabel}</span>:<img src={selected.brandIcon??openai} alt=""/>}<h2>{selected.name}</h2></div><div className="pd-actions"><button type="button" data-pd-primary className="pd-icon-button" aria-label={pinned ? '取消固定面板' : '固定面板'} aria-pressed={pinned} onClick={() => onPinnedChange?.(!pinned)}><PulseIcon name="pin"/></button><button type="button" className="pd-icon-button" aria-label="收起面板" onClick={event => changeMode(collapsedMode, event.detail === 0)}><PulseIcon name="close"/></button></div></header>
        <div className="pd-panel-content">
        {onApplicationIconChange&&<div className="pd-icon-choice" role="group" aria-label={`${selected.name}图标样式`}>{[['brand','品牌图标'],['robot','机器人']].map(([value,label])=><button type="button" key={value} disabled={disabled} aria-pressed={selected.iconMode===value} onClick={()=>onApplicationIconChange(selected.id,value)}>{label}</button>)}</div>}
        <div className="pd-quota-card" data-tone={quotaTone(value)}><div><span>{quotaLabel}</span><strong>{value === null ? '—' : `${value}%`}</strong></div><div className="pd-quota-track"><span style={{ width: `${value ?? 0}%` }}/></div><p>{quotaMessage[quotaState]??resetLabel}</p>{quotaState === 'error' && (!selected.canAuthorize||selected.authState==='connected') && <button type="button" className="pd-text-button" onClick={onRetry}>重新读取</button>}</div>
        {selected.quotaWindows?.slice(1).map((window,index)=><div className="pd-quota-card pd-quota-extra" key={`${window.label}-${index}`} data-tone={quotaTone(window.remaining)}><div><span>{window.label}</span><strong>{quotaValue(window.remaining)}%</strong></div><div className="pd-quota-track"><span style={{width:`${window.remaining}%`}}/></div><p>{window.resetLabel}</p></div>)}
        {selected.canAuthorize&&onApplicationAccountAction&&<div className="pd-account" aria-label={`${selected.name}账户授权`}>
          <p className="pd-empty">{selected.readMode==='off'?'已暂停，不会在重启后自动连接。':selected.readMode==='web'?'正在使用备用网页账户；它可能与桌面账号不同。':'优先读取本机有效额度，再只读复用桌面登录，无需重复登录。'}</p>
          {selected.authState!=='connected'&&quotaState!=='loading'&&quotaState!=='authorizing'&&<p className="pd-empty">备用方式：{selected.id==='claude'?'官方 Claude 授权仅 user:profile，页面可能显示 Claude Code。':selected.id==='grok-bot'?'Grok Bot 使用 Cursor 官方账户体系。':'在 Cursor 官方页面登录。'}密码只在官网输入。</p>}
          <div className="pd-account-actions">{selected.authState==='authorizing'?<button type="button" className="pd-account-button" onClick={()=>onApplicationAccountAction(selected.id,'cancel-authorization')}>取消登录</button>:<>
            {selected.readMode&&selected.readMode!=='auto'&&<button type="button" className="pd-account-button" disabled={disabled} onClick={()=>onApplicationAccountAction(selected.id,'resume-auto')}>{selected.readMode==='off'?'恢复自动读取':'改用桌面读取'}</button>}
            {quotaState!=='ready'&&quotaState!=='loading'&&quotaState!=='rate-limited'&&<button type="button" className="pd-text-button" disabled={disabled||selected.authorizationBlocked} onClick={()=>onApplicationAccountAction(selected.id,'authorize')}>备用网页登录</button>}
            {selected.canDisconnect&&<button type="button" className="pd-text-button" onClick={()=>onApplicationAccountAction(selected.id,'disconnect-account')}>停止读取</button>}
          </>}</div>
        </div>}
        {taskState !== 'ready' && <p className="pd-empty" role="status">{taskState === 'unsupported' ? '任务状态、关注和完成通知尚未接入。' : taskState === 'loading' ? '正在读取任务…' : '任务连接中断，保留关注'}{taskState === 'error' && <button type="button" className="pd-text-button" onClick={onRetry}>重试</button>}</p>}
        {notice && <p className="pd-empty" role="status">{notice}</p>}
        {taskState!=='unsupported'&&<div className="pd-task-list">
          <div className="pd-group-title"><span>重点关注</span><span>{watched.length}</span></div>
          {watched.length ? watched.map(task => <PulseTaskRow key={task.id} task={task} watchDisabled={watched.length>=5} onOpen={openTask} onWatch={id => { if (watched.length < 5 || tasks.find(t => t.id === id)?.watched) onWatchTask?.(id); }} disabled={disabled || taskState === 'loading'}/>) : <p className="pd-empty">点击任务旁的星标，让它留在这里。</p>}
          {!!others.length && <><div className="pd-group-title pd-other-title"><span>其他任务</span><span>{others.length}</span></div>{others.map(task => <PulseTaskRow key={task.id} task={task} watchDisabled={watched.length>=5} onOpen={openTask} onWatch={id => { if (watched.length < 5 || tasks.find(t => t.id === id)?.watched) onWatchTask?.(id); }} disabled={disabled || taskState === 'loading'}/>)}</>}
        </div>}
        </div>
        <footer className="pd-panel-footer"><span>{sourceLabel}</span>{onRefresh && selected.readMode!=='off' && quotaState!=='unsupported' && <button type="button" className="pd-text-button" disabled={quotaState==='rate-limited'||quotaState==='loading'||quotaState==='authorizing'} onClick={onRefresh}>刷新</button>}<button type="button" className="pd-text-button" onClick={event => changeMode('docked', event.detail === 0)}><PulseIcon name="dock"/>贴边收起</button></footer>
      </section>}
    </>}
  </div>;
}
