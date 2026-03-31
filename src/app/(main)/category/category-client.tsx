"use client";

import { useState } from "react";
import {
  UI_COLORS,
  CATEGORY_COLORS_ARRAY,
  cardStyle as baseCardStyle,
  pageContainerStyle,
  getCategoryIcon,
} from "@/lib/constants";
import { PageHeader } from "@/app/_components/page-header";

const { BG: BG_COLOR, BORDER: BORDER_COLOR, TEXT_MAIN, TEXT_SUB, THEME: THEME_COLOR } = UI_COLORS;
const CATEGORY_COLORS = CATEGORY_COLORS_ARRAY;

type CategoryPageData = {
  categories: { name: string; count: number; amount: number; percent: number }[];
  totalCategories: number;
  totalTransactions: number;
  totalAmount: number;
};

export function CategoryClient({ data }: { data: CategoryPageData }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const cardStyle = {
    ...baseCardStyle,
    transition: "all 0.2s ease",
  };

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="หมวดหมู่" subtitle="จัดการและวิเคราะห์ค่าใช้จ่ายแยกตามประเภท" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {[
          { label: "หมวดหมู่ทั้งหมด", value: String(data.totalCategories), accent: THEME_COLOR },
          { label: "รายการรวมเดือนนี้", value: String(data.totalTransactions), accent: "#0ea5e9" },
          { label: "ยอดรวมทุกหมวดหมู่", value: `฿${data.totalAmount.toLocaleString()}`, accent: "#8b5cf6" },
        ].map((s) => (
          <div
            key={s.label}
            style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "20px", padding: "20px 28px" }}
          >
            <div style={{ width: "5px", height: "40px", background: s.accent, borderRadius: "10px" }} />
            <div>
              <p
                style={{
                  color: TEXT_SUB,
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                {s.label}
              </p>
              <p style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {data.categories.map((cat, i) => {
          const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
          const icon = getCategoryIcon(cat.name);
          return (
            <div
              key={cat.name}
              onMouseEnter={() => setHovered(cat.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...cardStyle,
                borderColor: hovered === cat.name ? color : BORDER_COLOR,
                transform: hovered === cat.name ? "translateY(-4px)" : "none",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    background: `${color}10`,
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                  }}
                >
                  {icon}
                </div>
                <div
                  style={{
                    background: BG_COLOR,
                    color: TEXT_SUB,
                    padding: "6px 12px",
                    borderRadius: "10px",
                    fontSize: "12px",
                    fontWeight: 700,
                    border: `1px solid ${BORDER_COLOR}`,
                  }}
                >
                  {cat.count} รายการ
                </div>
              </div>
              <p style={{ color: TEXT_SUB, fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{cat.name}</p>
              <p style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}>
                ฿{cat.amount.toLocaleString()}
              </p>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ color: TEXT_SUB, fontSize: "11px", fontWeight: 500 }}>สัดส่วนการใช้จ่าย</span>
                  <span style={{ color, fontSize: "12px", fontWeight: 800 }}>{cat.percent}%</span>
                </div>
                <div style={{ height: "8px", background: BG_COLOR, borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: `${cat.percent}%`, height: "100%", background: color, borderRadius: "10px" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
