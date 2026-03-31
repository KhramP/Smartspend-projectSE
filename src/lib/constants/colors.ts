// Centralized UI color constants (Strategy: Single Source of Truth)
// All client components import from here instead of re-declaring

export const UI_COLORS = {
  THEME: "#2563be",
  BG: "#f4f4f5",
  CARD_BG: "#ffffff",
  BORDER: "#e4e4e7",
  TEXT_MAIN: "#09090b",
  TEXT_SUB: "#71717a",

  // Semantic colors
  INCOME: "#10b981",
  EXPENSE: "#ef4444",
  WARNING: "#f59e0b",
  INFO: "#0ea5e9",
  PURPLE: "#8b5cf6",
  PINK: "#ec4899",
  ROSE: "#f43f5e",
  LIME: "#84cc16",
} as const;

export type UIColorKey = keyof typeof UI_COLORS;
