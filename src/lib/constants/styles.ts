// Shared style objects (Strategy: Single Source of Truth)
// Eliminates duplicate inline style definitions across components

import { UI_COLORS } from "./colors";

export const cardStyle: React.CSSProperties = {
  background: UI_COLORS.CARD_BG,
  border: `1px solid ${UI_COLORS.BORDER}`,
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
};

export const cardStyleLarge: React.CSSProperties = {
  ...cardStyle,
  padding: "32px",
};

export const pageContainerStyle: React.CSSProperties = {
  padding: "40px",
  background: UI_COLORS.BG,
  minHeight: "100vh",
  color: UI_COLORS.TEXT_MAIN,
  fontFamily: "inherit",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  background: UI_COLORS.BG,
  border: `1px solid ${UI_COLORS.BORDER}`,
  borderRadius: "12px",
  padding: "12px 16px",
  color: UI_COLORS.TEXT_MAIN,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
};

export const labelStyle: React.CSSProperties = {
  color: UI_COLORS.TEXT_SUB,
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export const pageTitleStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 800,
  letterSpacing: "-1px",
};

export const pageSubtitleStyle: React.CSSProperties = {
  color: UI_COLORS.TEXT_SUB,
  fontSize: "14px",
};

export const progressBarContainerStyle: React.CSSProperties = {
  height: "8px",
  background: UI_COLORS.BG,
  borderRadius: "10px",
  overflow: "hidden",
};

export function progressBarFillStyle(percent: number, color: string): React.CSSProperties {
  return {
    width: `${Math.min(percent, 100)}%`,
    height: "100%",
    background: color,
    borderRadius: "10px",
  };
}
