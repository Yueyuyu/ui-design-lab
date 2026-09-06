import test from "node:test";
import assert from "node:assert/strict";
import { validateFile, runUpload } from "../systems/quiet-workspace/web/upload-adapter.js";

test("选择与拖放共用文件类型和大小约束", () => {
  const file = { name: "notes.TXT", type: "text/plain", size: 12 };
  assert.equal(validateFile(file, { accept: ".txt,image/*" }), "");
  assert.match(validateFile(file, { accept: "image/*" }), /类型/);
  assert.match(validateFile(file, { maxBytes: 10 }), /超过/);
});

test("上传失败可重试，取消拒绝迟到成功，进度拒绝非法值", async () => {
  const controller = new AbortController(), file = { name: "notes.txt" }, values = [];
  let attempts = 0;
  const adapter = async (_, { onProgress }) => {
    if (++attempts === 1) throw new Error("模拟存储失败");
    [NaN, -1, 40, 120].forEach(onProgress);
    return { id: "uploaded" };
  };
  const options = { signal: controller.signal, onProgress: value => values.push(value) };
  await assert.rejects(runUpload(adapter, file, options), /模拟存储失败/);
  assert.deepEqual(await runUpload(adapter, file, options), { id: "uploaded" });
  assert.deepEqual(values, [0, 40, 100]);
  const running = runUpload(() => new Promise(() => {}), file, options);
  controller.abort();
  await assert.rejects(running, /已取消/);
});
