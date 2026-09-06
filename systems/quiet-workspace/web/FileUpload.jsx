import { validateFile, runUpload } from "./upload-adapter.js";
import { useEffect, useRef, useState } from "react";
export function QuietFileUpload({
  upload,
  accept,
  multiple = true,
  maxBytes = 10 * 1024 * 1024,
  onComplete,
  disabled = false
}) {
  const [files, setFiles] = useState([]),
    jobs = useRef(new Map()),
    alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      jobs.current.forEach(controller => controller.abort());
    };
  }, []);
  const update = (id, patch) => {
    if (alive.current) setFiles(items => items.map(item => item.id === id ? {
      ...item,
      ...patch
    } : item));
  };
  const run = async item => {
    const controller = new AbortController();
    jobs.current.set(item.id, controller);
    update(item.id, {
      status: "uploading",
      progress: 0,
      error: ""
    });
    try {
      const invalid = validateFile(item.file, {
        accept,
        maxBytes
      });
      if (invalid) throw new Error(invalid);
      const result = await runUpload(upload, item.file, {
        signal: controller.signal,
        onProgress: value => {
          if (!controller.signal.aborted) update(item.id, {
            progress: Math.min(100, Math.max(0, value))
          });
        }
      });
      if (controller.signal.aborted || !alive.current) return;
      update(item.id, {
        status: "done",
        progress: 100,
        result
      });
      onComplete?.(result, item.file);
    } catch (error) {
      update(item.id, {
        status: controller.signal.aborted ? "cancelled" : "error",
        error: controller.signal.aborted ? "已取消" : error.message
      });
    } finally {
      jobs.current.delete(item.id);
    }
  };
  const add = list => {
    const entries = Array.from(list).slice(0, multiple ? 50 : 1).map(file => ({
      id: crypto.randomUUID(),
      file,
      status: "queued",
      progress: 0,
      error: ""
    }));
    setFiles(items => [...items, ...entries]);
    entries.forEach(item => {
      const error = validateFile(item.file, {
        accept,
        maxBytes
      });
      if (error) update(item.id, {
        status: "error",
        error
      });else run(item);
    });
  };
  return <section className="qw-control"><label className="qw-upload-drop" onDragOver={e => e.preventDefault()} onDrop={e => {
      e.preventDefault();
      if (!disabled) add(e.dataTransfer.files);
    }}>选择或拖入文件<input aria-label="上传文件" type="file" accept={accept} multiple={multiple} disabled={disabled} onChange={e => {
        add(e.target.files);
        e.target.value = "";
      }} /></label><small>每个文件上限 {Math.round(maxBytes / 1024 / 1024)} MB；存储由 upload 适配器提供。</small><ul>{files.map(item => <li key={item.id}><strong>{item.file.name}</strong><span role="status"> · {item.status === "done" ? "已完成" : item.status === "uploading" ? "上传中 " + item.progress + "%" : item.error || "等待上传"}</span>{item.status === "uploading" ? <><progress value={item.progress} max="100" /><button type="button" onClick={() => jobs.current.get(item.id)?.abort()}>取消上传</button></> : ["error", "cancelled"].includes(item.status) && !validateFile(item.file, {
          accept,
          maxBytes
        }) ? <button type="button" onClick={() => run(item)}>重试上传</button> : null}</li>)}</ul></section>;
}
