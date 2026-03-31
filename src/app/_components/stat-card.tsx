// Component Composition Pattern: Reusable stat card
// Eliminates duplicate stat grid rendering across pages

import { UI_COLORS, cardStyle } from "@/lib/constants";

interface StatItem {
  label: string;
  value: string;
  color: string;
  icon?: string;
}

export function StatCardGrid({ stats, columns = 4 }: { stats: StatItem[]; columns?: number }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "20px",
        marginBottom: "32px",
      }}
    >
      {stats.map((s) => (
        <div key={s.label} style={cardStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <p
              style={{
                color: UI_COLORS.TEXT_SUB,
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {s.label}
            </p>
            {s.icon && <span style={{ color: s.color, fontWeight: 800 }}>{s.icon}</span>}
          </div>
          <p style={{ color: s.color, fontSize: "24px", fontWeight: 800 }}>{s.value}</p>
        </div>
      ))}
    </div>
  );
}
