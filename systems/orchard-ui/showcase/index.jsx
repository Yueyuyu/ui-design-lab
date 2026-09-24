import {useState} from 'react';
import {createShowcase} from '../../../src/gallery/docs/createShowcase.jsx';
import * as Kit from '../web/index.js';
import manifest from '../suite.json';
import tokens from '../foundations/tokens.json';
import bindings from '../foundations/token-bindings.json';
import design from '../DESIGN.md?raw';
import entries from './catalog.generated.json';
import {componentExamples as examples} from './ComponentExamples.jsx';
import '../foundations/tokens.css';
import '../web/components.css';
import {OrchardCollection} from './ComponentCollection.jsx';

function Overview(){return <section className="ou-showcase"><header className="ou-showcase-intro"><span>ORCHARD UI / COMPONENT COLLECTION</span><h1>从一个图标，到一次顺手的操作。</h1><p>选择图标、查找应用、调整控件。这里的每个组件，都可以独立接入你的项目。<a href="#/systems/orchard-ui/components"> 浏览全部组件 →</a></p></header><OrchardCollection/></section>;}
function Playground(){const [fail,setFail]=useState(false);return <section className="ou-showcase"><header className="ou-showcase-intro"><h1>保存、取消，再试一次。</h1><p>使用本地适配器测试失败与恢复；不会写入远程服务。</p></header><Kit.OrchardCheckbox label="模拟保存失败" checked={fail} onChange={setFail}/><Kit.OrchardSettingsWorkspace onSave={(values,{signal})=>new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(new DOMException('已取消','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);fail?reject(new Error('演示保存失败；关闭模拟失败后重试')):resolve(values);},700);signal.addEventListener('abort',abort,{once:true});})}/></section>;}
const standards=import.meta.glob('../standards/*.md',{query:'?raw',import:'default',eager:true});
const showcase=createShowcase({suite:manifest,kit:Kit,entries,examples,standards,foundation:{tokens,bindings,design},base:{overview:Overview,playground:Playground}});
export const navigation=showcase.navigation;
export const pages=showcase.pages;
export const componentEntries=showcase.componentEntries;
export const patternEntries=showcase.patternEntries;
export const scenes={preferences:()=> <Kit.OrchardSettingsWorkspace/>};
