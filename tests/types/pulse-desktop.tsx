import {PulseDesktopDock,PulseQuotaRing,PulseTaskRow,type PulseTask} from '../../systems/pulse-desktop/web/index.js';
const task:PulseTask={id:'example',title:'示例任务',state:'running',watched:true};
export const pulseContract=<><PulseQuotaRing remaining={null} mood="offline" motionEnabled={false}/><PulseTaskRow task={task} onWatch={(id:string)=>void id}/><PulseDesktopDock mode="expanded" remaining={69} tasks={[task]} dataState="ready" motionEnabled onModeChange={mode=>void mode}/></>;
// @ts-expect-error 禁止把任意任务进度对象传作额度百分比。
export const invalidQuota=<PulseQuotaRing remaining={{progress:69}}/>;
// @ts-expect-error 表情必须使用本套约定，不能传入任意任务进度。
export const invalidMood=<PulseQuotaRing remaining={69} mood="almost-done"/>;
