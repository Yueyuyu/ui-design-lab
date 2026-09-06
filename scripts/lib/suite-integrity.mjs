import { readFile, readdir } from "node:fs/promises";
import { resolve, relative } from "node:path";
import postcss from "postcss";
import { parse } from "@babel/parser";

function tokenValue(tokens, path) {
  const token = path.split(".").reduce((value, key) => value?.[key], tokens);
  if (!token || !("$value" in token)) throw new Error("绑定指向不存在的 Token：" + path);
  return Array.isArray(token.$value) ? "cubic-bezier(" + token.$value.join(",") + ")" : String(token.$value);
}
const normalize = (value) => value.toLowerCase().replace(/\s+/g, "").replace(/(?<!\d)0\./g, ".");

export function validateTokenBindings(tokens, css, bindings) {
  const declarations = { base: {}, compact: {}, comfortable: {}, reducedMotion: {} };
  postcss.parse(css).walkDecls((decl) => {
    if (!decl.prop.startsWith("--")) return;
    const selector = decl.parent.selector ?? "";
    const media = decl.parent.parent;
    const group = media.type === "atrule" && media.params === "(prefers-reduced-motion: reduce)" ? "reducedMotion" : selector.includes('data-density="compact"') ? "compact" : selector.includes('data-density="comfortable"') ? "comfortable" : "base";
    if (decl.prop in declarations[group]) throw new Error("重复 Token 声明：" + decl.prop);
    declarations[group][decl.prop] = decl.value;
  });
  for (const [group, values] of Object.entries(declarations)) {
    for (const [name, value] of Object.entries(values)) {
      const path = bindings[group]?.[name];
      if (!path) throw new Error("CSS Token 未绑定到 JSON：" + name);
      if (normalize(value) !== normalize(tokenValue(tokens, path))) throw new Error("CSS 与 JSON Token 不一致：" + name + " / " + path);
    }
  }
  const boundPaths = new Set();
  for (const [group, values] of Object.entries(bindings)) {
    for (const [name, path] of Object.entries(values)) {
      if (!(name in declarations[group])) throw new Error("Token 缺少 CSS 实现：" + name);
      boundPaths.add(path);
    }
  }
  function walk(value, path = "") {
    for (const [key, child] of Object.entries(value)) {
      if (!child || typeof child !== "object" || key.startsWith("$")) continue;
      const current = path ? path + "." + key : key;
      if ("$value" in child && !boundPaths.has(current)) throw new Error("JSON Token 未导出到 CSS：" + current);
      if (!("$value" in child)) walk(child, current);
    }
  }
  walk(tokens);
}

export function validateSourceIsolation(source, filename, suiteDir, manifests) {
  const current = manifests.find((suite) => resolve(suiteDir).endsWith(suite.id));
  const others = manifests.filter((suite) => suite.id !== current.id);
  const checkReference = (value) => {
    if (others.some((suite) => value.includes(suite.id) || value.includes("--" + suite.prefix + "-"))) throw new Error("跨套系引用：" + filename + " → " + value);
    if (value.startsWith(".")) {
      const target = resolve(filename, "..", value);
      if (others.some((suite) => target.startsWith(resolve(suiteDir, "..", suite.id) + "/") || target.startsWith(resolve(suiteDir, "..", suite.id) + "\\"))) throw new Error("跨套系相对路径：" + filename);
    }
  };
  if (filename.endsWith(".css")) {
    const sheet = postcss.parse(source);
    sheet.walkDecls((decl) => {
      for (const suite of others) if (decl.prop.startsWith("--" + suite.prefix + "-") || decl.value.includes("--" + suite.prefix + "-")) throw new Error("跨套系 CSS Token：" + filename);
    });
    sheet.walkAtRules("import", (rule) => checkReference(rule.params.replace(/['"]/g, "")));
    sheet.walkRules((rule) => {
      if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
      for (const selector of rule.selectors) if (!selector.includes('[data-ui-system="' + current.id + '"]')) throw new Error("CSS 选择器缺少套系作用域：" + filename + " " + selector);
    });
    return;
  }
  const ast = parse(source, { sourceType: "module", plugins: ["jsx", "typescript"] });
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (["ImportDeclaration", "ExportNamedDeclaration", "ExportAllDeclaration"].includes(node.type) && node.source) checkReference(node.source.value);
    if (node.type === "CallExpression" && (node.callee.type === "Import" || node.callee.name === "require") && node.arguments[0]?.type === "StringLiteral") checkReference(node.arguments[0].value);
    if (node.type === "StringLiteral" && others.some((suite) => node.value.includes("--" + suite.prefix + "-"))) checkReference(node.value);
    for (const child of Object.values(node)) if (child && typeof child === "object") Array.isArray(child) ? child.forEach(visit) : visit(child);
  }
  visit(ast.program);
}

export async function validateSuiteSources(suiteDir, manifests) {
  async function walk(dir) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (/\.(jsx?|css)$/.test(entry.name)) validateSourceIsolation(await readFile(path, "utf8"), path, suiteDir, manifests);
    }
  }
  await walk(suiteDir);
}

export function resolveWithin(directory, path) {
  const target = resolve(directory, path);
  const inside = relative(directory, target);
  if (inside.startsWith("..") || /^[A-Za-z]:/.test(inside)) throw new Error("路径越出目录：" + path);
  return target;
}
