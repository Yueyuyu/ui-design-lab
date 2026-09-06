export function validateFile(file, { accept = "", maxBytes = 10 * 1024 * 1024 } = {}) {
  if (file.size > maxBytes) return "文件超过 " + Math.round(maxBytes / 1024 / 1024) + " MB 限制。";
  const rules = accept.split(",").map(rule => rule.trim().toLowerCase()).filter(Boolean);
  const name = file.name.toLowerCase(), type = file.type.toLowerCase();
  if (rules.length && !rules.some(rule => rule.startsWith(".") ? name.endsWith(rule) : rule.endsWith("/*") ? type.startsWith(rule.slice(0, -1)) : type === rule)) return "文件类型不受支持。";
  return "";
}

// 取消由组件保证；即使业务适配器忽略 signal，迟到结果也不能变为上传成功。
export async function runUpload(upload, file, { signal, onProgress }) {
  if (!upload) throw new Error("未配置上传适配器。");
  if (signal.aborted) throw new Error("已取消");
  let abort;
  const cancelled = new Promise((_, reject) => {
    abort = () => reject(new Error("已取消"));
    signal.addEventListener("abort", abort, { once: true });
  });
  try {
    return await Promise.race([cancelled, upload(file, { signal, onProgress: value => {
      if (!signal.aborted && Number.isFinite(value)) onProgress(Math.max(0, Math.min(100, value)));
    } })]);
  } finally {
    signal.removeEventListener("abort", abort);
  }
}
