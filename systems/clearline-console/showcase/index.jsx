import {ProjectScenario} from "./ProjectScenario.jsx";
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
import {ClearProjectWorkspace} from "../web/ProjectWorkspace.jsx";
import {BusinessGallery} from "../../../src/gallery/workbench/BusinessGallery.jsx";
import {WorkflowGallery} from "../../../src/gallery/workbench/WorkflowGallery.jsx";
import {ThemeEditor} from "../../../src/gallery/workbench/ThemeEditor.jsx";
import {SettingsPlayground} from "../../../src/gallery/SettingsPlayground.jsx";
function Overview(){return <><h1>澄明后台</h1><p>{manifest.description}</p><ClearProjectWorkspace/></>;}
function Business(props){return <BusinessGallery ui={ui} suiteId="clearline-console" {...props}/>;}
function Workflows(props){const kind=new URLSearchParams(location.hash.split("?")[1]).get("kit");return kind==="projects"?<ProjectScenario/>:<WorkflowGallery ui={ui} suiteId="clearline-console" {...props}/>;}
function Theme(props){return <ThemeEditor ui={ui} suiteId="clearline-console" {...props}/>;}
function Playground(props){return <SettingsPlayground {...ui} suiteId="clearline-console" {...props}/>;}
const base={overview:Overview,playground:Playground};
const tools={controls:Business,workflow:Workflows,theme:Theme};
const standards=import.meta.glob('../standards/*.md',{query:'?raw',import:'default',eager:true});
const showcase=createShowcase({suite:manifest,kit:Kit,entries,examples,standards,foundation:{tokens,bindings,design},base,...tools});
export const navigation=showcase.navigation;
export const pages=showcase.pages;

export const componentEntries=showcase.componentEntries;
export const patternEntries=showcase.patternEntries;

export const scenes = {projects: () => <ProjectScenario standalone/>};
