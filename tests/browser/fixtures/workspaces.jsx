import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ClearProjectWorkspace } from 'ui-design-lab/clearline-console';
import { SignalContentBoard } from 'ui-design-lab/signal-studio';
import 'ui-design-lab/clearline-console/tokens.css';
import 'ui-design-lab/clearline-console/components.css';
import 'ui-design-lab/signal-studio/tokens.css';
import 'ui-design-lab/signal-studio/components.css';

function Fixture() {
  const query = new URLSearchParams(location.search);
  const signalSuite = query.get('suite') === 'signal-studio';
  const [rows, setRows] = useState(signalSuite
    ? [{ id:'external', title:'外部内容', description:'业务提供的内容', status:'Draft', owner:'编辑', image:'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="240"%3E%3Crect width="400" height="240" fill="%236335cf"/%3E%3C/svg%3E' }]
    : [{ id:'external', name:'外部项目', owner:'业务负责人', status:'Planning', date:'2026-09-18' }]);
  const save = async (record, { signal }) => {
    const response = await fetch('/__workspace-save', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(record), signal:query.has('ignore-cancel') ? undefined : signal });
    if (!response.ok) throw new Error('服务拒绝保存');
    return response.json();
  };
  return <main data-ui-system={signalSuite ? 'signal-studio' : 'clearline-console'}>
    {signalSuite ? <SignalContentBoard stories={rows} onStoriesChange={setRows} onSaveStory={save} readOnly={query.has('readonly')} />
      : <ClearProjectWorkspace rows={rows} onRowsChange={setRows} onSaveProject={save} readOnly={query.has('readonly')} />}
    <output aria-label="业务集合">{JSON.stringify(rows)}</output>
  </main>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
