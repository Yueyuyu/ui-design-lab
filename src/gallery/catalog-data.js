export const suiteStatusLabels = { stable: "稳定", experimental: "实验", draft: "草稿", deprecated: "已弃用" };

export function filterSuites(suites, query) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return suites;
  return suites.filter((suite) => [
    suite.id, suite.displayName, suite.localizedName, suite.styleLabel,
    suiteStatusLabels[suite.status], ...(suite.tags ?? []), ...(suite.selection?.suitableFor ?? []),
  ].some((value) => value?.toLocaleLowerCase().includes(normalized)));
}
