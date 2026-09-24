import {useState, version} from 'react';
import {createRoot} from 'react-dom/client';
import {QuietDrawer, QuietDialog} from 'ui-design-lab/quiet-workspace';
import {LedgerDrawer} from 'ui-design-lab/midnight-ledger';
import {ClearDrawer} from 'ui-design-lab/clearline-console';
import {SignalDrawer, SignalContentBoard} from 'ui-design-lab/signal-studio';

import {OrchardDialog} from 'ui-design-lab/orchard-ui';
import {DialogueDialog} from 'ui-design-lab/dialogue-ui';
const dialogs = {orchard: OrchardDialog, dialogue: DialogueDialog, quiet: QuietDrawer, ledger: LedgerDrawer, clear: ClearDrawer, signal: SignalDrawer, dialog: QuietDialog};
function App() {
  const [kind, setKind] = useState('quiet');
  const [open, setOpen] = useState(false);
  const [blocked, setBlocked] = useState(true);
  const Dialog = dialogs[kind];
  return <main><h1>React {version} 消费兼容性</h1>
    <label>浮层类型<select value={kind} onChange={event => setKind(event.target.value)}>{Object.keys(dialogs).map(key => <option key={key}>{key}</option>)}</select></label>
    <label><input type="checkbox" checked={blocked} onChange={event => setBlocked(event.target.checked)}/>加载状态</label>
    <button onClick={() => setOpen(true)}>打开浮层</button>
    <Dialog open={open} onOpenChange={setOpen} title="兼容性详情" loading={blocked} {...{[kind==='orchard'||kind==='dialogue'?'footer':'actions']:<button data-testid="dialog-action">提交</button>}}><input data-testid="dialog-input" aria-label="编辑内容"/></Dialog>
    <section data-ui-system="signal-studio"><SignalContentBoard loading={blocked}/></section>
  </main>;
}
createRoot(document.getElementById('root')).render(<App/>);
