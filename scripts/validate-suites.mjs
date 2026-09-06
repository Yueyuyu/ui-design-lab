import { access, readFile, readdir } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { resolveWithin, validateTokenBindings, validateSuiteSources } from "./lib/suite-integrity.mjs";

const root = process.cwd();
const systemsDir = resolve(root, "systems");
const requiredStates = ["default", "hover", "pressed", "focus", "disabled", "loading", "error"];
const allowedStatuses = new Set(["draft", "experimental", "stable", "deprecated"]);
const idPattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const prefixPattern = /^[a-z][a-z0-9]{1,5}$/;
const manifestSchema = JSON.parse(await readFile(resolve(root, "schemas/suite.schema.json"), "utf8"));
const validateManifest = new Ajv2020({ allErrors: true, strict: false }).compile(manifestSchema);

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function resolveManifestPath(suiteDir, value) {
  return resolveWithin(suiteDir, value);
}

async function loadSuites() {
  const entries = await readdir(systemsDir, { withFileTypes: true });
  const suites = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const suiteDir = resolve(systemsDir, entry.name);
    const manifestPath = resolve(suiteDir, "suite.json");
    if (!(await exists(manifestPath))) {
      continue;
    }
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    suites.push({ suiteDir, manifestPath, folderName: entry.name, manifest });
  }
  return suites;
}

function assertUnique(suites, field) {
  const seen = new Map();
  for (const suite of suites) {
    const value = suite.manifest[field];
    if (seen.has(value)) {
      throw new Error(`${field} 重复：${value} 同时用于 ${seen.get(value)} 和 ${suite.folderName}`);
    }
    seen.set(value, suite.folderName);
  }
}

async function validateSuite(suite) {
  const { folderName, manifest, suiteDir } = suite;
  if (!validateManifest(manifest)) throw new Error(folderName + ": manifest schema 校验失败 " + JSON.stringify(validateManifest.errors));
  if (manifest.scope !== `[data-ui-system="${manifest.id}"]`) throw new Error(folderName + ": scope 与 id 不一致");
  if (manifest.id !== folderName || !idPattern.test(manifest.id)) {
    throw new Error(`${folderName}: id 必须与目录同名并使用 kebab-case`);
  }
  if (!prefixPattern.test(manifest.prefix)) {
    throw new Error(`${manifest.id}: prefix 不符合 2-6 位小写标识约定`);
  }
  if (!allowedStatuses.has(manifest.status)) {
    throw new Error(`${manifest.id}: 未知状态 ${manifest.status}`);
  }
  if (!Number.isInteger(manifest.order) || manifest.order < 1) {
    throw new Error(`${manifest.id}: order 必须是正整数`);
  }

  const requiredFiles = ["designDocument", "tokens", "tokensCss", "components", "showcase", "tokenBindings"];
  for (const field of requiredFiles) {
    if (!manifest[field] || !(await exists(resolveManifestPath(suiteDir, manifest[field])))) {
      throw new Error(`${manifest.id}: ${field} 指向的文件不存在`);
    }
  }

  const tokensPath = resolveManifestPath(suiteDir, manifest.tokens);
  const tokensCssPath = resolveManifestPath(suiteDir, manifest.tokensCss);
  const statesPath = resolve(suiteDir, "foundations/interaction-states.json");
  const designPath = resolveManifestPath(suiteDir, manifest.designDocument);
  const tokens = JSON.parse(await readFile(tokensPath, "utf8"));
  const tokenCss = await readFile(tokensCssPath, "utf8");
  const designDocument = await readFile(designPath, "utf8");
  const interactionStates = JSON.parse(await readFile(statesPath, "utf8"));
  const bindings = JSON.parse(await readFile(resolveManifestPath(suiteDir, manifest.tokenBindings), "utf8"));
  validateTokenBindings(tokens, tokenCss, bindings);
  await validateSuiteSources(suiteDir, suites.map((item) => item.manifest));
  if (manifest.status !== "draft") {
    if (!manifest.referenceImage || !(await exists(resolveWithin(root, manifest.referenceImage)))) throw new Error(manifest.id + ": 缺少视觉来源");
    if (!manifest.selection?.thumbnail || !(await exists(resolveWithin(root, manifest.selection.thumbnail)))) throw new Error(manifest.id + ": 缺少选型缩略图");
    if (Object.keys(interactionStates.components).length === 0) throw new Error(manifest.id + ": 正式套系不能缺少组件状态");
  }
  if (manifest.comparison && !(await exists(resolveManifestPath(suiteDir, manifest.comparison.entry)))) throw new Error(manifest.id + ": 比较适配器不存在");

  if (tokens.id !== manifest.id || tokens.prefix !== manifest.prefix || tokens.version !== manifest.version) {
    throw new Error(`${manifest.id}: suite.json 与 tokens.json 的 id、prefix 或 version 不一致`);
  }
  if (!tokenCss.includes(`[data-ui-system="${manifest.id}"]`)) {
    throw new Error(`${manifest.id}: Token CSS 缺少独立 data-ui-system 作用域`);
  }
  const customProperties = [...tokenCss.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]);
  const invalidProperties = customProperties.filter((property) => !property.startsWith(`--${manifest.prefix}-`));
  if (invalidProperties.length > 0) {
    throw new Error(`${manifest.id}: 发现未隔离 Token：${invalidProperties.join(", ")}`);
  }

  if (JSON.stringify(interactionStates.requiredStates) !== JSON.stringify(requiredStates)) {
    throw new Error(`${manifest.id}: requiredStates 必须完整并保持标准顺序`);
  }
  for (const [component, states] of Object.entries(interactionStates.components)) {
    const missingStates = requiredStates.filter((state) => !states[state]);
    if (missingStates.length > 0) {
      throw new Error(`${manifest.id}: ${component} 缺少状态 ${missingStates.join(", ")}`);
    }
  }

  if (!designDocument.startsWith("---\n") || !designDocument.includes("## Overview") || !designDocument.includes("## Agent Usage")) {
    throw new Error(`${manifest.id}: DESIGN.md 缺少标准 front matter、Overview 或 Agent Usage`);
  }

  let suiteSpecificSummary = "通用合同通过";
  if (manifest.validation) {
    const validatorPath = resolveManifestPath(suiteDir, manifest.validation);
    const validator = await import(pathToFileURL(validatorPath).href);
    suiteSpecificSummary = await validator.validateSuite({ root, suiteDir, manifest, tokens, tokenCss, interactionStates });
  }

  return `${manifest.displayName}: ${customProperties.length} 个 Token；${Object.keys(interactionStates.components).length} 个状态组件；${suiteSpecificSummary}`;
}

const suites = await loadSuites();
try {
if (suites.length === 0) {
  throw new Error("未发现任何包含 suite.json 的设计套系");
}

for (const field of ["id", "order", "prefix", "shortCode"]) {
  assertUnique(suites, field);
}

const summaries = [];
for (const suite of suites) {
  summaries.push(await validateSuite(suite));
}

console.log(`设计套系校验通过（${suites.length} 套）：`);
for (const summary of summaries) {
  console.log(`- ${summary}`);
}

} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
