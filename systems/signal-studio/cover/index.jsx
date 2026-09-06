import { ui as U } from "../showcase/ui.js";
import "../foundations/tokens.css";
import "../web/components.css";
export default function Cover() { return <U.Shell brand="Studio / 工作台" navigation={[{id:"overview",label:"项目概览"},{id:"tasks",label:"任务与资料"},{id:"settings",label:"设置"}]} activeId="overview" title="项目概览" actions={<U.Button>新建项目</U.Button>}><section><h3 style={{fontSize:16,margin:"0 0 12px"}}>本周进行中 · 12 个项目</h3><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}><U.Chart title="处理进度" unit="项" data={[{label:"周一",value:8},{label:"周二",value:12},{label:"周三",value:10},{label:"周四",value:16}]}/><div><U.Field label="项目名称" value="产品研究" readOnly/><U.Progress label="本周目标" value={72}/><U.Button variant="secondary">查看全部项目</U.Button></div></div></section></U.Shell>; }
