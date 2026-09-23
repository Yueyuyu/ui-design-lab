import {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {PulseDesktopDock} from '../web/index.js';
import {demoTasks} from '../showcase/demo-data.js';
import '../foundations/tokens.css';
import '../web/components.css';
import './window.css';
import {emptyApplicationState,receiveApplicationSnapshot,expireApplicationState} from './application-state.js';
import {sendHost,useWindowLayout} from './use-window-layout.js';
import openai from '../assets/openai.svg';
import cursor from '../assets/cursor.svg';
import claude from '../assets/claude.svg';
import grok from '../assets/grok.svg';
import kimi from '../assets/kimi.svg';
const brands={codex:openai,cursor,claude,'grok-bot':grok,kimi};
const brandLabels={claude:'Cl','grok-bot':'G',zcode:'Z',kimi:'K','doubao-work':'豆',workbuddy:'W'};

const live=window.__PULSE_HOST_MODE__==='live';
document.title=live?'Pulse · 应用状态':'Pulse Windows · 本地示例';

function DesktopPreview(){
  const [mode,setMode]=useState('compact'),[scale,setScale]=useState(1),[side,setSide]=useState('right');
  const [tasks,setTasks]=useState(live?[]:demoTasks),[pinned,setPinned]=useState(false),[motion,setMotion]=useState(true);
  const [autoDock,setAutoDock]=useState(false);
  const [notice,setNotice]=useState(''),[dataState,setDataState]=useState('ready');
  const [snapshot,setSnapshot]=useState(emptyApplicationState);
  const root=useRef(null);
  useWindowLayout(root,mode,side,scale);
  useEffect(()=>{
    let heartbeat=Date.now();
    let received=emptyApplicationState;
    const receive=({data})=>{
      if(!data||typeof data!=='object')return;
      if(data.type==='mode' && ['compact','expanded','docked'].includes(data.value))setMode(data.value);
      if(data.type==='scale' && [1,1.25,1.5,2].includes(data.value))setScale(data.value);
      if(data.type==='side' && ['left','right'].includes(data.value))setSide(data.value);
      if(data.type==='motion')setMotion(Boolean(data.value));
      if(data.type==='pinned')setPinned(Boolean(data.value));
      if(data.type==='auto-dock'&&typeof data.value==='boolean')setAutoDock(data.value);
      if(data.type==='window-notice'&&typeof data.value==='string')setNotice(data.value.slice(0,200));
      if(data.type==='drag-ended')window.dispatchEvent(new Event('pulse:drag-end'));
      if(data.type==='pointer-inside'&&typeof data.value==='boolean')window.dispatchEvent(new CustomEvent('pulse:host-pointer',{detail:data.value}));
      if(data.type==='window-deactivated')window.dispatchEvent(new Event('blur'));
      if(live&&data.type==='snapshot'){
        const next=receiveApplicationSnapshot(received,data.value);
        if(next!==received){received=next;heartbeat=Date.now();setSnapshot(next);}
      }
      if(!live&&data.type==='error')setDataState(data.value?'error':'ready');
      if(!live&&data.type==='complete')setTasks(current=>current.map((t,i)=>i===0?{...t,state:t.state==='completed'?'running':'completed'}:t));
    };
    window.chrome?.webview?.addEventListener('message',receive);
    sendHost({type:'ready',demo:!live});
    const watchdog=live?setInterval(()=>{if(Date.now()-heartbeat>15000)setSnapshot(expireApplicationState);},5000):null;
    return ()=>{window.chrome?.webview?.removeEventListener('message',receive);clearInterval(watchdog);};
  },[]);
  return <div data-ui-system="pulse-desktop" className="pd-native" data-side={side} data-source={live?'companion-live':'demo'} data-sequence={live?snapshot.sequence:undefined} style={{zoom:scale}} ref={root}>
    {(!live||snapshot.applications.length>0)&&<PulseDesktopDock mode={mode} dockSide={side} remaining={live?null:69} tasks={tasks} pinned={pinned} dataState={dataState} motionEnabled={motion}
      applications={live?snapshot.applications.map(entry=>({...entry,notice:notice||entry.notice,brandIcon:brands[entry.id]??null,brandLabel:brandLabels[entry.id]})):undefined}
      onApplicationAccountAction={live?(applicationId,type)=>sendHost({type,applicationId}):undefined}
      onApplicationIconChange={live?(applicationId,value)=>sendHost({type:'icon-mode',applicationId,value}):undefined}
      onApplicationRefresh={applicationId=>sendHost({type:'refresh',applicationId})}
      onApplicationWatchTask={(applicationId,id)=>sendHost({type:'watch',applicationId,id,watched:!snapshot.applications.find(a=>a.id===applicationId)?.tasks.find(t=>t.id===id)?.watched})}
      onApplicationOpenTask={(applicationId,id)=>sendHost({type:'open-task',applicationId,id})}
      onModeChange={setMode} onPinnedChange={value=>{if(!live)setPinned(value);sendHost({type:'pin',value});}}
      autoDock={autoDock} onAutoDockChange={value=>{if(!live)setAutoDock(value);sendHost({type:'auto-dock',value});}}
      onDragStart={()=>{
        // 先提交解除贴边的布局，避免迟到的 size 消息把原生拖动拉回屏幕边缘。
        requestAnimationFrame(()=>{root.current?.dispatchEvent(new Event('pulse:layout'));sendHost({type:'drag'});});
        return true;
      }} onRetry={()=>live?sendHost({type:'refresh'}):setDataState('ready')}
      onRefresh={live?()=>sendHost({type:'refresh'}):undefined}
      onWatchTask={id=>setTasks(current=>current.map(t=>t.id===id?{...t,watched:!t.watched}:t))}
      onOpenTask={id=>{setNotice('示例任务：'+tasks.find(t=>t.id===id).title);sendHost({type:'demo-open',id});}}/>}
    <span className="pd-native-notice" role="status">{live?'':notice}</span>
  </div>;
}
createRoot(document.getElementById('root')).render(<DesktopPreview/>);
