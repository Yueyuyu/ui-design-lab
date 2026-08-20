export const quietInteractionStates = [
  "default",
  "hover",
  "pressed",
  "focus",
  "disabled",
  "loading",
  "error",
];

export function resolveComponentState({ visualState, loading, error, disabled }) {
  if (error) return "error";
  if (loading) return "loading";
  if (disabled || visualState === "disabled") return "disabled";
  return visualState || "default";
}

export function joinClassNames(...names) {
  return names.filter(Boolean).join(" ");
}
