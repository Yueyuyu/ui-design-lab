import { PulseDesktopDock } from '../web/index.js';
import { demoTasks } from '../showcase/demo-data.js';
import '../foundations/tokens.css';
import '../web/components.css';
import '../showcase/showcase.css';
export default function Cover(){return <div className="pd-cover"><div><h2>重要的状态，<br/>一直在。</h2><p>Pulse-inspired 桌面伴侣<br/>独立浮条 · 关注面板 · 边缘停靠</p><PulseDesktopDock remaining={69} tasks={demoTasks}/><p style={{fontSize:14,marginTop:40}}>0.1.0 / 设计验证版<br/>示例数据 · Pulse 黑色原版</p><PulseDesktopDock mode="docked" remaining={69}/></div><PulseDesktopDock mode="expanded" remaining={69} tasks={demoTasks} pinned/></div>;}
