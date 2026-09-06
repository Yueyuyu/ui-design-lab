import {useState} from "react";
import {createRoot} from "react-dom/client";
import {WorkflowDemo} from "./workbench/WorkflowDemo.jsx";
import "./style.css";
import * as Kit0 from "ui-design-lab/clearline-console";
import "ui-design-lab/clearline-console/tokens.css";
import "ui-design-lab/clearline-console/components.css";
import * as Kit1 from "ui-design-lab/midnight-ledger";
import "ui-design-lab/midnight-ledger/tokens.css";
import "ui-design-lab/midnight-ledger/components.css";
import * as Kit2 from "ui-design-lab/quiet-workspace";
import "ui-design-lab/quiet-workspace/tokens.css";
import "ui-design-lab/quiet-workspace/components.css";
import * as Kit3 from "ui-design-lab/signal-studio";
import "ui-design-lab/signal-studio/tokens.css";
import "ui-design-lab/signal-studio/components.css";
const systems=[{id:"clearline-console",name:"Clearline Console",ui:{Button:Kit0.ClearButton,Field:Kit0.ClearField,Select:Kit0.ClearSelect,Toggle:Kit0.ClearToggle,Textarea:Kit0.ClearTextarea,Checkbox:Kit0.ClearCheckbox,DateRange:Kit0.ClearDateRange,Shell:Kit0.ClearShell,DataTable:Kit0.ClearDataTable,Drawer:Kit0.ClearDrawer,Popover:Kit0.ClearPopover,Progress:Kit0.ClearProgress,Panel:Kit0.ClearPanel,Chart:Kit0.ClearBarChart}},{id:"midnight-ledger",name:"Midnight Ledger",ui:{Button:Kit1.LedgerButton,Field:Kit1.LedgerField,Select:Kit1.LedgerSelect,Toggle:Kit1.LedgerToggle,Textarea:Kit1.LedgerTextarea,Checkbox:Kit1.LedgerCheckbox,DateRange:Kit1.LedgerDateRange,Shell:Kit1.LedgerShell,DataTable:Kit1.LedgerDataTable,Drawer:Kit1.LedgerDrawer,Popover:Kit1.LedgerPopover,Progress:Kit1.LedgerProgress,Panel:Kit1.LedgerPanel,Chart:Kit1.LedgerBarChart,format:Kit1.ledgerFormat}},{id:"quiet-workspace",name:"Quiet Workspace",ui:{Button:Kit2.QuietButton,Field:Kit2.QuietField,Select:Kit2.QuietSelect,Toggle:Kit2.QuietToggle,Textarea:Kit2.QuietTextarea,Checkbox:Kit2.QuietCheckbox,DateRange:Kit2.QuietDateRange,Shell:Kit2.QuietShell,DataTable:Kit2.QuietDataTable,Drawer:Kit2.QuietDrawer,Popover:Kit2.QuietPopover,Progress:Kit2.QuietProgress,Panel:Kit2.QuietCard,Chart:Kit2.QuietBarChart,Quota:Kit2.QuietQuotaPill,TaskLight:Kit2.QuietTaskLight,FileUpload:Kit2.QuietFileUpload,Tree:Kit2.QuietTree}},{id:"signal-studio",name:"Signal Studio",ui:{Button:Kit3.SignalButton,Field:Kit3.SignalField,Select:Kit3.SignalSelect,Toggle:Kit3.SignalToggle,Textarea:Kit3.SignalTextarea,Checkbox:Kit3.SignalCheckbox,DateRange:Kit3.SignalDateRange,Shell:Kit3.SignalShell,DataTable:Kit3.SignalDataTable,Drawer:Kit3.SignalDrawer,Popover:Kit3.SignalPopover,Progress:Kit3.SignalProgress,Panel:Kit3.SignalPanel,Chart:Kit3.SignalBarChart}}];
function App(){const [id,setId]=useState(systems[0].id),[kind,setKind]=useState("tasks");const suite=systems.find(s=>s.id===id);return <main><h1>独立项目工作台</h1><p>安装的 ESM 组件包 · 无 Gallery 依赖 · 明确的本地模拟接口</p><label>设计套系<select value={id} onChange={e=>setId(e.target.value)}>{systems.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>业务场景<select value={kind} onChange={e=>setKind(e.target.value)}><option value="tasks">任务与用量</option><option value="research">研究与内容</option><option value="reports">运营报表</option></select></label><section data-ui-system={id} data-density="comfortable"><WorkflowDemo key={id+kind} ui={suite.ui} suiteId={id} kind={kind}/></section></main>;}
createRoot(document.getElementById("root")).render(<App/>);
