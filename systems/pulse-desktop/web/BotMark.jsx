import { useEffect, useRef, useState } from 'react';
import openai from '../assets/openai.svg';
import { mountPulseBot } from './upstream/runtime-adapter.js';
import './bot-mark.css';

const localRoot = import.meta.env.DEV ? '/__pulse-local__/' : import.meta.env.MODE === 'pulse-local' ? '/pulse-local/' : null;
let modules;
function loadRuntime() {
  if (!localRoot) return Promise.reject(new Error('机器人仅限本机预览'));
  if (!modules) modules = Promise.all(['grok-bot-engine.js','original-data.js','catalog.js','template.js'].map(file => import(/* @vite-ignore */ localRoot + file))).catch(error => { modules=null; throw error; });
  return modules;
}

export function BotMark({ mood='idle', motionEnabled=true, celebrating=false, persona='calm', shape='blob', brandLabel='?', useLogo=false, brandIcon=openai, colorIndex=0 }) {
  const host=useRef(null), controller=useRef(null), latest=useRef(null);
  const [loaded,setLoaded]=useState(false);
  latest.current={mood,motionEnabled,celebrating,persona,shape,colorIndex};
  useEffect(()=>{
    let disposed=false;
    setLoaded(false);
    if(!useLogo) loadRuntime().then(parts=>{
      if(disposed) return;
      controller.current=mountPulseBot(host.current,parts,latest.current);
      setLoaded(true);
    }).catch(()=>{ if(!disposed) host.current.dataset.runtime='unavailable'; });
    return ()=>{disposed=true;controller.current?.destroy();controller.current=null;};
  },[useLogo]);
  useEffect(()=>{controller.current?.update(latest.current);},[mood,motionEnabled,celebrating,persona,shape,colorIndex]);
  return <span className="pd-bot" data-mood={mood} data-source={loaded?'pulse-upstream':'pulse-brand'} aria-hidden="true">
    <span ref={host} className="pd-bot-host" hidden={!loaded}/>
    {!loaded && (brandIcon?<img className="pd-brand" src={brandIcon} alt=""/>:<span className="pd-brand-label">{brandLabel}</span>)}
  </span>;
}
