"use client";

import {
  UI_COLORS,
  cardStyle as baseCardStyle,
  pageContainerStyle,
  getCategoryColor,
  getCategoryIcon,
} from "@/lib/constants";
import { PageHeader } from "@/app/_components/page-header";

const { BG: BG_COLOR, BORDER: BORDER_COLOR, TEXT_MAIN, TEXT_SUB } = UI_COLORS;

type BudgetPageData = {
  categorySpending: { name: string; used: number }[];
  totalUsed: number;
};

export function BudgetClient({ data }: { data: BudgetPageData }) {
  const totalBudget = Math.max(data.totalUsed * 1.3, 1);
  const remaining = totalBudget - data.totalUsed;
  const overallPercent = (data.totalUsed / totalBudget) * 100;

  const cardStyle = {
    ...baseCardStyle,
    padding: "32px",
  };

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="งบประมาณ" subtitle="จัดการและติดตามการใช้จ่ายตามเป้าหมาย" />

      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0", marginBottom: "32px" }}>
          {[
            { label: "ยอดใช้จ่ายรวม", value: `฿${data.totalUsed.toLocaleString()}`, color: "#e11d48" },
            { label: "คงเหลือ (ประมาณ)", value: `฿${Math.round(remaining).toLocaleString()}`, color: "#10b981" },
            { label: "จำนวนหมวดหมู่", value: `${data.categorySpending.length}`, color: TEXT_MAIN },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{ padding: "0 40px", borderLeft: i > 0 ? `1px solid ${BORDER_COLOR}` : "none" }}
            >
              <p
                style={{
                  color: TEXT_SUB,
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {item.label}
              </p>
              <p style={{ color: item.color, fontSize: "32px", fontWeight: 800 }}>{item.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: BG_COLOR, padding: "24px", borderRadius: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
            <span style={{ color: TEXT_MAIN, fontSize: "14px", fontWeight: 700 }}>ภาพรวมการใช้งบเดือนนี้</span>
            <span
              style={{
                background: overallPercent > 80 ? "#fff1f2" : "#f7fee7",
                color: overallPercent > 80 ? "#e11d48" : "#4d7c0f",
                padding: "4px 12px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              {overallPercent.toFixed(1)}%
            </span>
          </div>
          <div style={{ height: "14px", background: BORDER_COLOR, borderRadius: "10px", overflow: "hidden" }}>
            <div
              style={{
                width: `${Math.min(overallPercent, 100)}%`,
                height: "100%",
                background: overallPercent > 80 ? "#e11d48" : "#000",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "18px", fontWeight: 700, marginTop: "40px", marginBottom: "20px" }}>
        งบประมาณแยกตามหมวดหมู่
      </h2>

      {data.categorySpending.length === 0 ? (
        <p style={{ color: TEXT_SUB, textAlign: "center", padding: "40px 0" }}>ไม่มีข้อมูลการใช้จ่ายเดือนนี้</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {data.categorySpending.map((b) => {
            const color = getCategoryColor(b.name);
            const icon = getCategoryIcon(b.name);

            return (
              <div key={b.name} style={{ ...cardStyle, padding: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      background: `${color}15`,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                    }}
                  >
                    {icon}
                  </div>
                  <p style={{ color: TEXT_MAIN, fontWeight: 800, fontSize: "16px" }}>{b.name}</p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <span style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800 }}>
                    ฿{b.used.toLocaleString()}
                  </span>
                </div>
                <div style={{ height: "8px", background: "#f1f1f5", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: color, borderRadius: "10px" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
