import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const entries = await readdir(resolve(root, "systems"), { withFileTypes: true });
const suites = [];

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }
  try {
    const manifest = JSON.parse(await readFile(resolve(root, "systems", entry.name, "suite.json"), "utf8"));
    suites.push(manifest);
  } catch {
    // 没有 suite.json 的目录不是可注册套系。
  }
}

suites.sort((left, right) => left.order - right.order);
for (const suite of suites) {
  console.log(`${String(suite.order).padStart(2, "0")}  ${suite.id.padEnd(24)} ${suite.status.padEnd(12)} v${suite.version}  ${suite.displayName} / ${suite.localizedName}`);
}
