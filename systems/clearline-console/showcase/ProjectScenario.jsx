import { useState } from 'react';
import { ClearProjectWorkspace, ClearToggle } from '../web/index.js';

export function ProjectScenario({standalone = false} = {}) {
  const [failNext, setFailNext] = useState(false);
  const save = async (project, { signal }) => {
    const shouldFail = failNext; setFailNext(false);
    await new Promise(resolve => setTimeout(resolve, 350));
    signal.throwIfAborted();
    if (shouldFail) throw new Error('演示保存失败，请重新保存。');
    return { ...project, date: new Date().toISOString().slice(0, 10) };
  };
  return <section className="cc-project-scenario">{!standalone && <><h2>项目运营工作台</h2><p>搜索项目 → 侧开详情 → 修改状态 → 保存回写。保存适配器为本地演示，刷新后恢复示例。</p></>}
    <details><summary>检查失败恢复</summary><ClearToggle label="下次保存模拟失败" checked={failNext} onChange={setFailNext} /></details>
    <ClearProjectWorkspace onSaveProject={save} />
  </section>;
}
