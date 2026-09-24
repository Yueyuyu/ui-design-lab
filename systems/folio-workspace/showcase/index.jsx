import bindings from "../foundations/token-bindings.json";
import design from "../DESIGN.md?raw";
import {createShowcase} from "../../../src/gallery/docs/createShowcase.jsx";
import * as Kit from "../web/index.js";
import entries from "./catalog.generated.json";
import {componentExamples as examples} from "./ComponentExamples.jsx";
import "../foundations/tokens.css";
import "../web/components.css";
import './showcase.css';
import { FolioWorkspace } from '../web/index.js';
import tokens from '../foundations/tokens.json';
import manifest from '../suite.json';
function Intro({ title, children, eyebrow = 'FOLIO WORKSPACE / 页集工作台' }) { return <header className="fw-gallery-intro"><span>{eyebrow}</span><h1>{title}</h1><p>{children}</p></header>; }
function Overview() { return <div className="fw-showcase"><Intro title="把想法，放在同一张纸上。">页面树承载层级，内容块记录思考，数据库让发现继续生长。<a href="#/usage/notion"> 查看 Notion 设计研究 ↗</a></Intro><FolioWorkspace /></div>; }
function Playground() { return <div className="fw-showcase"><Intro title="试着写一页，再换一种视图。">此工作区使用独立本地存储。可新建页面与记录，测试中文输入、块菜单、草稿切换和保存恢复。</Intro><FolioWorkspace storageKey="folio-playground-v1" /></div>; }
const base={overview:Overview,playground:Playground};
const tools={};
const standards=import.meta.glob('../standards/*.md',{query:'?raw',import:'default',eager:true});
const showcase=createShowcase({suite:manifest,kit:Kit,entries,examples,standards,foundation:{tokens,bindings,design},base,...tools});
export const navigation=showcase.navigation;
export const pages=showcase.pages;

export const componentEntries=showcase.componentEntries;
export const patternEntries=showcase.patternEntries;

export const scenes = {knowledge: () => <FolioWorkspace storageKey={null}/>};
