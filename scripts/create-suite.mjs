import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const suiteId = args.find((arg) => !arg.startsWith("--"));
const readOption = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const displayName = readOption("name");
const localizedName = readOption("zh");
const prefix = readOption("prefix");

if (!suiteId || !displayName || !localizedName || !prefix) {
  throw new Error('用法：npm run suite:new -- <suite-id> --name="Display Name" --zh="中文名" --prefix=xx');
}
if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(suiteId)) {
  throw new Error("suite-id 必须使用 kebab-case");
}
if (!/^[a-z][a-z0-9]{1,5}$/.test(prefix)) {
  throw new Error("prefix 必须是 2-6 位小写字母或数字");
}

const root = process.cwd();
const systemsDir = resolve(root, "systems");
const suiteDir = resolve(systemsDir, suiteId);
const entries = await readdir(systemsDir, { withFileTypes: true });
const manifests = [];
for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  try {
    manifests.push(JSON.parse(await readFile(resolve(systemsDir, entry.name, "suite.json"), "utf8")));
  } catch {
    // 非套系目录无需参与编号。
  }
}
if (manifests.some((manifest) => manifest.id === suiteId || manifest.prefix === prefix)) {
  throw new Error("suite-id 或 prefix 已存在");
}

const order = Math.max(0, ...manifests.map((manifest) => manifest.order)) + 1;
const shortCode = suiteId.split("-").map((part) => part[0]).join("").slice(0, 4).toUpperCase();
await mkdir(suiteDir);
await mkdir(resolve(suiteDir, "foundations"));
await mkdir(resolve(suiteDir, "standards"));
await mkdir(resolve(suiteDir, "web"));
await mkdir(resolve(suiteDir, "showcase"));

const manifest = {
  $schema: "../../schemas/suite.schema.json",
  id: suiteId,
  order,
  displayName,
  localizedName,
  shortCode,
  prefix,
  version: "0.1.0",
  status: "draft",
  description: `${displayName} 的独立 UI 设计套系。`,
  styleLabel: "Unspecified",
  platforms: ["web"],
  modes: ["light"],
  densities: ["comfortable"],
  tags: ["draft"],
  swatches: ["#FFFFFF", "#5B625E", "#D8DDD9"],
  scope: `[data-ui-system="${suiteId}"]`,
  designDocument: "./DESIGN.md",
  tokens: "./foundations/tokens.json",
  tokensCss: "./foundations/tokens.css",
  components: "./web/index.js",
  showcase: "./showcase/index.jsx",
  capabilities: { foundations: [], components: [], patterns: [], standards: [] }
};

const tokens = {
  $schema: "https://design-tokens.github.io/community-group/format/",
  name: displayName,
  id: suiteId,
  version: "0.1.0",
  prefix,
  color: {
    surface: { canvas: { $type: "color", $value: "#FFFFFF" } },
    text: { primary: { $type: "color", $value: "#202421" } },
    brand: { default: { $type: "color", $value: "#5B625E" } }
  }
};

const states = {
  version: "0.1.0",
  requiredStates: ["default", "hover", "pressed", "focus", "disabled", "loading", "error"],
  components: {}
};

await writeFile(resolve(suiteDir, "suite.json"), `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(resolve(suiteDir, "foundations/tokens.json"), `${JSON.stringify(tokens, null, 2)}\n`);
await writeFile(resolve(suiteDir, "foundations/interaction-states.json"), `${JSON.stringify(states, null, 2)}\n`);
await writeFile(resolve(suiteDir, "foundations/tokens.css"), `[data-ui-system="${suiteId}"] {\n  --${prefix}-color-canvas: #ffffff;\n  --${prefix}-color-text: #202421;\n  --${prefix}-color-brand: #5b625e;\n}\n`);
await writeFile(resolve(suiteDir, "web/components.css"), `[data-ui-system="${suiteId}"] { color: var(--${prefix}-color-text); background: var(--${prefix}-color-canvas); }\n`);
await writeFile(resolve(suiteDir, "web/index.js"), `export const suiteId = "${suiteId}";\n`);
await writeFile(resolve(suiteDir, "standards/README.md"), `# ${displayName} Standards\n\n在视觉方案选定后记录可访问性、状态、图标、动效、文案和专项规则。\n`);
await writeFile(resolve(suiteDir, "README.md"), `# ${displayName} / ${localizedName}\n\n状态：draft。视觉来源和使用边界确认后再进入组件实现。\n`);
await writeFile(resolve(suiteDir, "DESIGN.md"), `---\nversion: alpha\nname: ${displayName}\ndescription: "${manifest.description}"\ncolors:\n  canvas: "#FFFFFF"\n  ink: "#202421"\n  primary: "#5B625E"\n---\n\n## Overview\n\n${displayName} 当前处于 draft。\n\n## Colors\n\n颜色待视觉来源确认。\n\n## Typography\n\n字体待视觉来源确认。\n\n## Layout\n\n布局待视觉来源确认。\n\n## Elevation & Depth\n\n层级待视觉来源确认。\n\n## Shapes\n\n形状待视觉来源确认。\n\n## Components\n\n组件待视觉来源确认。\n\n## Do's and Don'ts\n\n不得混入其他套系。\n\n## Agent Usage\n\n视觉来源确认前不得将此 draft 用于正式产品。\n`);
await writeFile(resolve(suiteDir, "showcase/index.jsx"), `import "../foundations/tokens.css";\nimport "../web/components.css";\nexport const navigation = [];\nexport const pages = {};\n`);

console.log(`已创建 Suite ${String(order).padStart(2, "0")}：${suiteId}。下一步先确认视觉来源，再补充设计与组件。`);
