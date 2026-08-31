export const ledgerInteractionStates = ["default", "hover", "pressed", "focus", "disabled", "loading", "error"];

export function joinClassNames(...values) {
  return values.filter(Boolean).join(" ");
}

export function resolveLedgerState({ visualState, disabled, loading, error } = {}) {
  if (error) return "error";
  if (loading) return "loading";
  if (disabled || visualState === "disabled") return "disabled";
  return visualState || "default";
}
