import {ContentScenario} from "./ContentScenario.jsx";
import bindings from "../foundations/token-bindings.json";
import design from "../DESIGN.md?raw";
import {createShowcase} from "../../../src/gallery/docs/createShowcase.jsx";
import * as Kit from "../web/index.js";
import entries from "./catalog.generated.json";
import {businessExamples as examples} from "./BusinessExamples.jsx";
import "../foundations/tokens.css";
import "../web/components.css";
import manifest from "../suite.json";
import tokens from "../foundations/tokens.json";
import {ui} from "./ui.js";
import {SignalContentBoard} from "../web/ContentBoard.jsx";
import {BusinessGallery} from "../../../src/gallery/workbench/BusinessGallery.jsx";
import {WorkflowGallery} from "../../../src/gallery/workbench/WorkflowGallery.jsx";
import {ThemeEditor} from "../../../src/gallery/workbench/ThemeEditor.jsx";
import {SettingsPlayground} from "../../../src/gallery/SettingsPlayground.jsx";
function Overview(){return <><h1>信号创作间</h1><p>{manifest.description}</p><SignalContentBoard/></>;}
function Business(props){return <BusinessGallery ui={ui} suiteId="signal-studio" {...props}/>;}
function Workflows(props){const kind=new URLSearchParams(location.hash.split("?")[1]).get("kit");return kind==="content"?<ContentScenario/>:<WorkflowGallery ui={ui} suiteId="signal-studio" {...props}/>;}
function Theme(props){return <ThemeEditor ui={ui} suiteId="signal-studio" {...props}/>;}
function Playground(props){return <SettingsPlayground {...ui} suiteId="signal-studio" {...props}/>;}
const base={overview:Overview,playground:Playground};
const tools={controls:Business,workflow:Workflows,theme:Theme};
const standards=import.meta.glob('../standards/*.md',{query:'?raw',import:'default',eager:true});
const showcase=createShowcase({suite:manifest,kit:Kit,entries,examples,standards,foundation:{tokens,bindings,design},base,...tools});
export const navigation=showcase.navigation;
export const pages=showcase.pages;

export const componentEntries=showcase.componentEntries;
export const patternEntries=showcase.patternEntries;

export const scenes = {content: () => <ContentScenario standalone/>};
