import bindings from "../foundations/token-bindings.json";
import design from "../DESIGN.md?raw";
import tokens from "../foundations/tokens.json";
import {createShowcase} from "../../../src/gallery/docs/createShowcase.jsx";
import * as Kit from "../web/index.js";
import entries from "./catalog.generated.json";
import manifest from "../suite.json";
const examples={};
import { BusinessPage, WorkflowPage, ThemePage } from "./WorkbenchPages.jsx";
import "../foundations/tokens.css";
import "../web/components.css";
import { ComponentsGallery } from "./ComponentsGallery.jsx";
import { OverviewGallery } from "./OverviewGallery.jsx";
import { PlaygroundGallery } from "./PlaygroundGallery.jsx";

const base={overview:OverviewGallery,playground:PlaygroundGallery};
const tools={controls:BusinessPage,workflow:WorkflowPage,theme:ThemePage,states:ComponentsGallery};
const standards=import.meta.glob('../standards/*.md',{query:'?raw',import:'default',eager:true});
const showcase=createShowcase({suite:manifest,kit:Kit,entries,examples,standards,foundation:{tokens,bindings,design},base,...tools});
export const navigation=showcase.navigation;
export const pages=showcase.pages;

export const componentEntries=showcase.componentEntries;
export const patternEntries=showcase.patternEntries;

import {ui as sceneUi} from "./ui.js";
import {WorkflowDemo} from "../../../src/gallery/workbench/WorkflowDemo.jsx";
export const scenes = {tasks: () => <WorkflowDemo ui={sceneUi} suiteId="quiet-workspace" kind="tasks" standalone/>,research: () => <WorkflowDemo ui={sceneUi} suiteId="quiet-workspace" kind="research" standalone/>};
