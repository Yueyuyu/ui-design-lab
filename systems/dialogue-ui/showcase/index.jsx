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

function Overview(){return <section className="du-showcase"><header className="du-showcase-intro"><span>DIALOGUE UI / CHATGPT INSPIRED</span><h1>让内容，成为对话的中心。</h1><p>克制的工具、清晰的消息与连续输入，组合成可接入自己服务的界面。<a href="#/systems/dialogue-ui/components"> 浏览组件 →</a></p></header><Kit.DialogueChatWorkspace/></section>;}
function Playground(){const [fail,setFail]=useState(false);return <section className="du-showcase"><header className="du-showcase-intro"><h1>输入、停止与失败恢复。</h1><p>这里使用延迟返回的本地适配器，验证切换与取消后不会写入迟到回复。</p></header><Kit.DialogueCheckbox label="模拟回复失败" checked={fail} onChange={setFail}/><Kit.DialogueChatWorkspace onSend={(prompt,{signal})=>new Promise((resolve,reject)=>{const abort=()=>{clearTimeout(timer);reject(new DOMException('已停止','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);fail?reject(new Error('演示回复失败；关闭模拟失败后重试')):resolve(`本地适配器已收到：${prompt}\n\n这是用于验证界面的示例结果。`);},900);signal.addEventListener('abort',abort,{once:true});})}/></section>;}
const standards=import.meta.glob('../standards/*.md',{query:'?raw',import:'default',eager:true});
const showcase=createShowcase({suite:manifest,kit:Kit,entries,examples,standards,foundation:{tokens,bindings,design},base:{overview:Overview,playground:Playground}});
export const navigation=showcase.navigation;
export const pages=showcase.pages;
export const componentEntries=showcase.componentEntries;
export const patternEntries=showcase.patternEntries;
export const scenes={conversation:()=> <Kit.DialogueChatWorkspace/>};
