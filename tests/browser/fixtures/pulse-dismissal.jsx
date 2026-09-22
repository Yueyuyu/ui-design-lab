import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {PulseDesktopDock} from '../../../systems/pulse-desktop/web/index.js';
import '../../../systems/pulse-desktop/foundations/tokens.css';
import '../../../systems/pulse-desktop/web/components.css';
const tasks=[{id:'task-1',title:'交互验证任务',state:'running',watched:true}];
function Fixture(){
  const [mode,setMode]=useState('compact'),[pinned,setPinned]=useState(false),[opened,setOpened]=useState(''),[watched,setWatched]=useState(true);
  return <main style={{minHeight:'90vh',background:'#c1d6e1'}}>
    <button onClick={()=>setMode('expanded')}>宿主展开</button><button>外部操作</button><output aria-label="打开记录">{opened}</output>
    <div data-ui-system="pulse-desktop" style={{position:'absolute',right:40,top:80}}><PulseDesktopDock useLogo motionEnabled={false} mode={mode} pinned={pinned} remaining={69} tasks={tasks.map(t=>({...t,watched}))} onModeChange={setMode} onPinnedChange={setPinned} onWatchTask={()=>setWatched(v=>!v)} onOpenTask={setOpened}/></div>
  </main>;
}
createRoot(document.getElementById('root')).render(<Fixture/>);
