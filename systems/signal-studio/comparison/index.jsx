import {ui as U} from "../showcase/ui.js";
import "../foundations/tokens.css";
import "../web/components.css";
export function Status({suite}) {return <span>实验 · v{suite.version}</span>;}
function Metrics({data}) {return <div className="comparison-metrics">{data.metrics.map(m=><U.Panel key={m.id} title={m.label}><strong>{m.value}</strong><p>{m.delta}</p></U.Panel>)}</div>;}
function Chart({data,visualState,onRetry}){return <U.Chart title="近六月收入" data={data.revenue} unit="万" state={visualState} onRetry={onRetry}/>;}
function Form(p){return <U.Panel title="复盘名称"><U.Field label="复盘名称" value={p.formName} onChange={e=>p.onFormNameChange(e.target.value)} disabled={p.visualState==="loading"}/><U.Button onClick={p.onCopy}>复制指令</U.Button></U.Panel>;}
function Settings(p){return <U.Panel title="复盘设置"><U.Field label="负责人" value={p.settings.owner} onChange={e=>p.onSettingsChange("owner",e.target.value)} disabled={p.visualState==="loading"}/><U.Field label="抄送邮箱" value={p.settings.email} onChange={e=>p.onSettingsChange("email",e.target.value)}/><U.Toggle label="自动保存草稿" checked={p.settings.autoSave} onChange={v=>p.onSettingsChange("autoSave",v)}/><U.Toggle label="完成后发送通知" checked={p.settings.notify} onChange={v=>p.onSettingsChange("notify",v)}/></U.Panel>;}
export function Scene({scenarioId,...p}) {
 if(p.visualState==="error")return <U.Panel title="数据暂时不可用"><p role="alert">本地输入仍保留。</p><U.Button onClick={p.onRetry}>重新加载</U.Button></U.Panel>;
 if(p.visualState==="loading")return <U.Skeleton label="正在加载比较场景…"/>;
 if(scenarioId==="monthly-review")return <><Metrics {...p}/><Chart {...p}/><Form {...p}/></>;
 if(scenarioId==="data-table")return <U.DataTable caption="客户收入明细" rows={p.data.tableRows} columns={[{key:"customer",label:"客户"},{key:"amount",label:"本月收入"},{key:"owner",label:"负责人"},{key:"status",label:"状态"}]} onRowActivate={r=>p.onNotify("示例客户："+r.customer)}/>;
 if(scenarioId==="settings-form")return <Settings {...p}/>;
 if(scenarioId==="detail-page")return <><U.Panel title={p.formName}><p>负责人：{p.settings.owner}</p><p>抄送邮箱：{p.settings.email}</p><p>自动保存：{p.settings.autoSave?"开启":"关闭"}</p></U.Panel><Chart {...p}/></>;
 return <U.Panel title="还没有复盘记录"><p>创建后可查看趋势与任务。</p><U.Button onClick={p.onRetry}>创建月度复盘</U.Button></U.Panel>;
}
export function Module({moduleId,...p}){return moduleId==="metrics"?<Metrics {...p}/>:moduleId==="chart"?<Chart {...p}/>:moduleId==="form"?<Form {...p}/>:<div className="workbench-actions"><U.Button onClick={p.onCopy}>确认复盘</U.Button><U.Button variant="secondary" onClick={p.onCopy}>复制指令</U.Button><U.Button loading>正在处理</U.Button><U.Button disabled>暂不可用</U.Button></div>;}
