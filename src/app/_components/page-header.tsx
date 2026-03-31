// Component Composition Pattern: Reusable page header
// Eliminates duplicate header markup across all page components

import { UI_COLORS } from "@/lib/constants";

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>{title}</h1>
      <p style={{ color: UI_COLORS.TEXT_SUB, fontSize: "14px" }}>{subtitle}</p>
    </div>
  );
}
