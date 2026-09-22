import choreography from './choreography.json';
import { dealtColor, personaConfig } from './pulse.js';

// 只桥接现成引擎：原始几何/物理/粒子/变形均在本地 vendor 中，未重新画造型或编排动作。
export function mountPulseBot(host, [engineModule,dataModule,catalogModule,templateModule], initial) {
  const { GrokBotEngine }=engineModule, { ORIGINAL_STATE_DATA }=dataModule, { MORPH_BY_STATE }=catalogModule;
  const shadow=host.shadowRoot || host.attachShadow({mode:'open'});
  shadow.innerHTML=templateModule.svgTemplate('pulse-bot');
  const svg=shadow.querySelector('svg');
  let options=initial,state='idle',index=0,nextBeat=0,frame=0,disposed=false,visible=true,lastDraw=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const routine=()=>choreography[options.persona] || choreography.calm;
  const moodKey=()=>({loading:'fetching',offline:'unavailable',happy:'idle',attention:'unavailable'}[options.mood] || options.mood);
  const getConfig=()=>{
    const blink=ORIGINAL_STATE_DATA.BLINK_CADENCE[state];
    return { expressionPool:ORIGINAL_STATE_DATA.EXPRESSION_POOLS[state],expressionWeights:{},
      expressionCadence:ORIGINAL_STATE_DATA.EXPRESSION_CADENCE[state],blinkCadence:blink,
      blinkEnabled:Boolean(blink),blinkMin:blink?.[0]??3000,blinkMax:blink?.[1]??7000,morph:MORPH_BY_STATE[state]||'none',
      headX:0,headY:0,headRotation:0,scaleX:1,scaleY:1,eyeOpen:1,
      ...personaConfig(options.persona,options.mood),color:dealtColor(options.colorIndex??0),eyeColor:'#0f0f0f',material:'solid',
      size:28,shape:options.shape,flipX:false,pointer:false,badgeColor:'#1d9bf0',badgeScale:1,particlesEnabled:true };
  };
  const engine=new GrokBotEngine(svg,getConfig);
  cancelAnimationFrame(engine.frameId);
  const select=()=>{
    const beats=routine()[moodKey()] || routine().idle;
    const beat=beats[index % beats.length];
    state=options.celebrating || options.mood==='happy' ? routine().completion : options.mood==='attention' ? 'alerting' : beat[0];
    engine.setState(state,true);
    nextBeat=engine.clockTime+beat[1]+Math.random()*(beat[2]-beat[1]);
  };
  const draw=now=>{ engine.frame(now); cancelAnimationFrame(engine.frameId); host.dataset.state=state; };
  const active=()=>options.motionEnabled && !reduce.matches && !document.hidden && visible && !disposed;
  const tick=now=>{
    if(!active()) return;
    if(now-lastDraw>=1000/30) {
      if(engine.clockTime>=nextBeat && !options.celebrating && options.mood!=='happy') { index++;select(); }
      draw(now);lastDraw=now;
    }
    frame=requestAnimationFrame(tick);
  };
  const sync=()=>{
    cancelAnimationFrame(frame);cancelAnimationFrame(engine.frameId);
    host.dataset.running=String(active());
    if(active()) { engine.lastTime=performance.now();frame=requestAnimationFrame(tick); }
  };
  const settle=()=>{
    // Pulse 静态快照先模拟 3s，再越过眨眼，防止关闭动效时停在闭眼的第一帧。
    for(let i=0;i<90;i++) draw(engine.lastTime+1000/30);
    for(let i=0;i<30 && engine.eyeOpen.x<.8;i++) draw(engine.lastTime+1000/30);
    engine.lastTime=performance.now();
  };
  // Swift 版 BotMarkMood 在环内强调工作姿态；只改变渲染倍率，不改底层弹簧状态。
  const originalRender=engine.render.bind(engine);
  engine.render=(now,config)=>{
    const rotation=engine.rotation.x,direct=engine.directRotation,squash=engine.scaleY.x;
    const emphasis=options.mood==='working'?2.4:options.mood==='loading'?1.6:1;
    const breathing=options.mood==='working'?3:options.mood==='loading'?2:1;
    engine.rotation.x=rotation*emphasis;engine.directRotation=direct*emphasis;engine.scaleY.x=1+(squash-1)*breathing;
    try{return originalRender(now,config);}finally{engine.rotation.x=rotation;engine.directRotation=direct;engine.scaleY.x=squash;}
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});
  observer.observe(host);
  const visibility=()=>sync();
  const motion=()=>{if(reduce.matches) settle();sync();};
  document.addEventListener('visibilitychange',visibility);reduce.addEventListener('change',motion);
  select();if(!active())settle();else draw(performance.now());sync();host.dataset.runtime='ready';
  return {
    update(next) {
      const changed=next.mood!==options.mood || next.celebrating!==options.celebrating || next.persona!==options.persona;
      const staticChanged=next.shape!==options.shape || next.motionEnabled!==options.motionEnabled;
      options=next;
      if(changed) { index=0;select(); }
      if(!active() && (changed || staticChanged)) settle();
      sync();
    },
    destroy() {disposed=true;cancelAnimationFrame(frame);engine.destroy();observer.disconnect();document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',motion);shadow.replaceChildren();}
  };
}
