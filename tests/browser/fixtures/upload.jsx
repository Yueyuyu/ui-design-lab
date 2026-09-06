import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { QuietFileUpload } from "../../../systems/quiet-workspace/web/FileUpload.jsx";
import "../../../systems/quiet-workspace/foundations/tokens.css";
import "../../../systems/quiet-workspace/web/components.css";

function UploadFixture() {
  const [failOnce, setFailOnce] = useState(false);
  const [ignoreAbort, setIgnoreAbort] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [completed, setCompleted] = useState([]);
  const attempts = useRef(new Map());
  const upload = (file, { signal, onProgress }) => new Promise((resolve, reject) => {
    const attempt = (attempts.current.get(file.name) ?? 0) + 1;
    attempts.current.set(file.name, attempt);
    let progress = 0;
    const timer = setInterval(() => {
      onProgress(progress += 25);
      if (progress < 100) return;
      clearInterval(timer);
      if (failOnce && attempt === 1) reject(new Error("模拟存储失败"));
      else resolve({ id: file.name });
    }, 200);
    if (!ignoreAbort) signal.addEventListener("abort", () => { clearInterval(timer); reject(new Error("已取消")); }, { once: true });
  });
  return <main data-ui-system="quiet-workspace"><h1>上传组件回归</h1>
    <label><input type="checkbox" checked={failOnce} onChange={e => setFailOnce(e.target.checked)} />首次失败</label>
    <label><input type="checkbox" checked={ignoreAbort} onChange={e => setIgnoreAbort(e.target.checked)} />忽略取消信号</label>
    <label><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />禁用上传</label>
    <QuietFileUpload accept=".txt,text/plain" maxBytes={1024 * 1024} disabled={disabled} upload={upload} onComplete={(_, file) => setCompleted(v => [...v, file.name])} />
    <p aria-label="完成次数">{completed.length}</p><output>{completed.join("、")}</output>
  </main>;
}
createRoot(document.getElementById("root")).render(<UploadFixture />);
