export type FocusTrapTarget = "first" | "last" | null;

type FocusTrapInput = {
  focusIsWithinDialog: boolean;
  focusIsFirst: boolean;
  focusIsLast: boolean;
  shiftKey: boolean;
};

/** Determines the only focus wrap needed by the feature-owned modal traps. */
export function getFocusTrapTarget({
  focusIsWithinDialog,
  focusIsFirst,
  focusIsLast,
  shiftKey,
}: FocusTrapInput): FocusTrapTarget {
  if (!focusIsWithinDialog) return "first";
  if (shiftKey && focusIsFirst) return "last";
  if (!shiftKey && focusIsLast) return "first";
  return null;
}
