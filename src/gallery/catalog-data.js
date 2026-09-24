export const suiteStatusLabels = { stable: "稳定版", experimental: "预览版", draft: "开发中", deprecated: "已弃用" };

export function filterSuites(suites, query) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return suites;
  return suites.filter((suite) => [
    suite.id, suite.displayName, suite.localizedName, suite.styleLabel,
    suite.description, suite.selection?.summary, suite.selection?.scenePreview?.title,
    ...(suite.modes ?? []).map(mode => mode === "light" ? "浅色" : "深色"),
    suiteStatusLabels[suite.status], ...(suite.tags ?? []), ...(suite.selection?.suitableFor ?? []),
  ].some((value) => value?.toLocaleLowerCase().includes(normalized)));
}
