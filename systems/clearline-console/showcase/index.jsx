import "../foundations/tokens.css";
import "../web/components.css";
import manifest from "../suite.json";
import tokens from "../foundations/tokens.json";
import states from "../foundations/interaction-states.json";
import {ui} from "./ui.js";
import {ClearProjectWorkspace} from "../web/ProjectWorkspace.jsx";
import {BusinessGallery} from "../../../src/gallery/workbench/BusinessGallery.jsx";
import {WorkflowGallery} from "../../../src/gallery/workbench/WorkflowGallery.jsx";
import {ThemeEditor} from "../../../src/gallery/workbench/ThemeEditor.jsx";
import {SettingsPlayground} from "../../../src/gallery/SettingsPlayground.jsx";
import {suiteUsage} from "../../../src/gallery/usage-content.js";
function Overview(){return <><h1>澄明后台</h1><p>{manifest.description}</p><ClearProjectWorkspace/></>;}
function Foundations(){return <><h1>基础规范</h1><p>独立 Token 与作用域；支持 comfortable / compact 密度。</p><div className="business-grid">{Object.entries(tokens.values).map(([key,value])=><ui.Panel key={key} title={key}><code>{value.$value}</code>{value.$type==="color"?<div style={{height:50,background:value.$value,border:"1px solid #8884"}}/>:null}</ui.Panel>)}</div></>;}
function Guidelines(){return <><h1>内容与行为</h1><p>Phosphor 图标、简体中文、原生键盘行为、可恢复错误与局部短动效。所有控件遵循七态合同。</p>{Object.entries(states.components).map(([name,contract])=><details key={name}><summary>{name}</summary><dl>{Object.entries(contract).map(([state,description])=><div key={state}><dt>{state}</dt><dd>{description}</dd></div>)}</dl></details>)}</>;}
function Business(props){return <BusinessGallery ui={ui} suiteId="clearline-console" {...props}/>;}
function Workflows(props){return <WorkflowGallery ui={ui} suiteId="clearline-console" {...props}/>;}
function Theme(props){return <ThemeEditor ui={ui} suiteId="clearline-console" {...props}/>;}
function Playground(props){return <SettingsPlayground {...ui} suiteId="clearline-console" {...props}/>;}
function Usage(){const content=suiteUsage(manifest);return <><h1>使用指南</h1><h2>本地组件包接入</h2><pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{content.install}</pre><h2>开发工具上下文</h2><pre style={{whiteSpace:"pre-wrap",overflowWrap:"anywhere"}}>{content.prompt}</pre></>;}
export const navigation=[{id:"overview",label:"总览",index:"01"},{id:"foundations",label:"基础规范",index:"02"},{id:"components",label:"组件与状态",index:"03"},{id:"guidelines",label:"内容与行为",index:"04"},{id:"patterns",label:"页面模式",index:"05"},{id:"playground",label:"Playground",index:"06"},{id:"usage",label:"使用指南",index:"07"},{id:"components-plus",label:"业务组件",index:"08"},{id:"workflows",label:"完整场景",index:"09"},{id:"theme",label:"主题编辑",index:"10"}];
export const pages={overview:Overview,foundations:Foundations,components:Business,guidelines:Guidelines,patterns:Workflows,playground:Playground,usage:Usage,"components-plus":Business,workflows:Workflows,theme:Theme};
