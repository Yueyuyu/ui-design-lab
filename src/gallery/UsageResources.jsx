import {AdoptionFeedback} from './AdoptionFeedback.jsx';
import {useState} from 'react';
import {ArrowUpRight,BookOpen,DownloadSimple,ChatCircleText} from '@phosphor-icons/react';
import {downloadText} from './workbench/demo-data.js';
import {readEvents} from './telemetry.js';

export function UsageResources({suite}) {
 const [opt,setOpt]=useState(()=>{try{return localStorage.getItem('ui-lab-metrics-opt-in')==='true';}catch{return false;}});
 const [message,setMessage]=useState('');
 return <section className="usage-resources"><a className="usage-resource" href="#/usage/notion"><BookOpen size={21}/><span><strong>Notion 产品界面研究</strong><small>从设计观察到页集工作台的实现</small></span><ArrowUpRight size={17}/></a><details className="usage-feedback"><summary><ChatCircleText size={21}/><span>试用反馈与本机记录<small>下载反馈表，或管理本机使用记录</small></span></summary><div><p>记录仅保存在此浏览器，不发送到服务器。默认关闭，可自行导出后检查内容。</p><label><input type="checkbox" checked={opt} onChange={event=>{try{localStorage.setItem('ui-lab-metrics-opt-in',String(event.target.checked));setOpt(event.target.checked);}catch{setMessage('当前浏览器不允许本地存储');}}}/>在本机记录使用事件</label><AdoptionFeedback suite={suite}/><div className="public-actions"><button className="public-button" type="button" onClick={()=>downloadText('local-events.json',JSON.stringify(readEvents(),null,2),'application/json')}><DownloadSimple size={15}/>导出本机事件</button><button className="public-button" type="button" onClick={()=>downloadText('feedback.md','# 试用反馈\n\n项目类型：\n使用套系：\n实际安装成功：是/否\n遇到的步骤与错误：\n缺少的组件：\n真实接入情况：\n愿意付费解决的问题：\n同意公开匿名案例：默认否\n')}>下载反馈表</button></div><p role="status">{message}</p></div></details></section>;
}
