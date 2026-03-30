"use client";

import { Transaction } from "@/generated/prisma/client";
import { useState } from "react";

const THEME_COLOR = "#2563be";
const BG_COLOR = "#f4f4f5";
const CARD_BG = "#ffffff";
const BORDER_COLOR = "#e4e4e7";
const TEXT_MAIN = "#09090b";
const TEXT_SUB = "#71717a";

export function DashBoard({
  transactions,
  data,
}: {
  transactions: Transaction[];
  data: {
    thisMonthIncome: number;
    thisMonthExpense: number;
    balance: number;
    todayExpense: number;
    eachCategorySpendingThisMonth: { category: string; amount: number }[];
  };
}) {
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

  const categories = data.eachCategorySpendingThisMonth.map((cat) => ({
    name: cat.category,
    icon: "🍜",
    amount: `฿${cat.amount.toLocaleString()}`,
  }));

  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
  };

  const filterButtonStyle = (name: string) => ({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: hoveredFilter === name ? "#000" : CARD_BG,
    color: hoveredFilter === name ? "#fff" : TEXT_SUB,
    padding: "8px 20px",
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "12px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100%", color: TEXT_MAIN }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>ภาพรวมระบบ</h1>
        <p style={{ color: TEXT_SUB, fontSize: "14px" }}>ยินดีต้อนรับกลับมา! นี่คือสรุปการเงินของคุณในเดือนนี้</p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {[
          { label: "รายรับเดือนนี้", value: data.thisMonthIncome, color: "#10b981" },
          { label: "รายจ่ายเดือนนี้", value: data.thisMonthExpense, color: "#ef4444" },
          { label: "ยอดคงเหลือ", value: data.balance, color: TEXT_MAIN },
          { label: "หมวดหมู่ยอดนิยม", value: "อาหาร", color: "#8b5cf6" },
        ].map((item, idx) => (
          <div key={idx} style={cardStyle}>
            <p
              style={{
                color: TEXT_SUB,
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                marginBottom: "8px",
                letterSpacing: "0.5px",
              }}
            >
              {item.label}
            </p>
            <p style={{ color: item.color, fontSize: "28px", fontWeight: 800 }}>
              {typeof item.value === "number" ? `฿${item.value.toLocaleString()}` : item.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "24px" }}>
        {/*Category List*/}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>การใช้จ่ายตามหมวดหมู่</h3>
          {categories.map((c) => (
            <div key={c.name} style={cardStyle}>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: BG_COLOR,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                  }}
                >
                  {c.icon}
                </div>
                <span
                  style={{
                    background: "#f0fdf4",
                    color: "#166534",
                    padding: "4px 10px",
                    borderRadius: "10px",
                    fontSize: "11px",
                    fontWeight: 800,
                  }}
                >
                  {c.name}
                </span>
              </div>
              <p style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800, marginBottom: "12px" }}>{c.amount}</p>
              <div style={{ height: "8px", background: BG_COLOR, borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: "70%", height: "100%", background: THEME_COLOR, borderRadius: "10px" }} />
              </div>
            </div>
          ))}
        </div>

        {/*Transaction*/}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>รายการล่าสุด</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              {["ทั้งหมด", "รายจ่าย", "รายรับ"].map((filter) => (
                <button
                  key={filter}
                  style={filterButtonStyle(filter)}
                  onMouseEnter={() => setHoveredFilter(filter)}
                  onMouseLeave={() => setHoveredFilter(null)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: TEXT_SUB,
                      textTransform: "uppercase",
                    }}
                  >
                    วันที่
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: TEXT_SUB,
                      textTransform: "uppercase",
                    }}
                  >
                    รายการ
                  </th>
                  <th
                    style={{
                      padding: "16px",
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: TEXT_SUB,
                      textTransform: "uppercase",
                    }}
                  >
                    จำนวนเงิน
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, index) => (
                  <tr key={index} style={{ borderBottom: `1px solid ${BG_COLOR}` }}>
                    <td style={{ padding: "16px", fontSize: "14px", color: TEXT_SUB }}>
                      {new Date(t.date).toLocaleDateString("th-TH", { day: "2-digit", month: "short" })}
                    </td>
                    <td style={{ padding: "16px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: TEXT_MAIN }}>{t.name}</p>
                      <p style={{ fontSize: "11px", color: TEXT_SUB }}>{t.category}</p>
                    </td>
                    <td
                      style={{
                        padding: "16px",
                        textAlign: "right",
                        fontSize: "15px",
                        fontWeight: 700,
                        color: t.type === "expense" ? "#ef4444" : "#10b981",
                      }}
                    >
                      {t.type === "expense" ? "-" : "+"}
                      {t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
