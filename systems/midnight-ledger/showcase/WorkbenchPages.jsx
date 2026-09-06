import { ui } from "./ui.js";
import { BusinessGallery } from "../../../src/gallery/workbench/BusinessGallery.jsx";
import { WorkflowGallery } from "../../../src/gallery/workbench/WorkflowGallery.jsx";
import { ThemeEditor } from "../../../src/gallery/workbench/ThemeEditor.jsx";
export function BusinessPage(props){return <BusinessGallery ui={ui} suiteId="midnight-ledger" {...props}/>;}
export function WorkflowPage(props){return <WorkflowGallery ui={ui} suiteId="midnight-ledger" {...props}/>;}
export function ThemePage(props){return <ThemeEditor ui={ui} suiteId="midnight-ledger" {...props}/>;}
