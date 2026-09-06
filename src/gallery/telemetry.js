const allowed = new Set(["catalog_view", "suite_open", "kit_view", "onboarding_start", "instruction_copy", "theme_export"]);
export function recordEvent(name, properties = {}) {
  try {
    if (localStorage.getItem("ui-lab-metrics-opt-in") !== "true" || !allowed.has(name)) return;
    const clean = Object.fromEntries(Object.entries(properties).filter(([key, value]) => ["suiteId", "kitId", "path"].includes(key) && typeof value === "string" && /^[a-z0-9-]+$/.test(value)));
    const items = JSON.parse(localStorage.getItem("ui-lab-events") || "[]");
    localStorage.setItem("ui-lab-events", JSON.stringify([...items, {
      id: crypto.randomUUID(),
      name,
      at: new Date().toISOString(),
      properties: clean
    }].slice(-500)));
  } catch {/* 统计失败不能阻断使用。 */}
}
export function readEvents() {
  try {
    const items = JSON.parse(localStorage.getItem("ui-lab-events") || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}
