import { useState } from 'react';
import { SignalContentBoard, SignalToggle } from '../web/index.js';

export function ContentScenario({standalone = false} = {}) {
  const [failNext, setFailNext] = useState(false);
  const save = async (story, { signal }) => {
    const shouldFail = failNext; setFailNext(false);
    await new Promise(resolve => setTimeout(resolve, 350));
    signal.throwIfAborted();
    if (shouldFail) throw new Error('演示保存失败，请重新保存。');
    return { ...story, updatedAt: new Date().toLocaleString('zh-CN') };
  };
  return <section className="ss-content-scenario">{!standalone && <><h2>内容编辑工作台</h2><p>浏览内容 → 编辑草稿 → 保存 → 查看本次修订。仅本地演示，不包含正式发布、上传和云端历史。</p></>}
    <details><summary>检查失败恢复</summary><SignalToggle label="下次保存模拟失败" checked={failNext} onChange={setFailNext} /></details>
    <SignalContentBoard onSaveStory={save} />
  </section>;
}
