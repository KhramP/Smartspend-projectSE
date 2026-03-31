"use client";

import { useState } from "react";
import { UI_COLORS, CATEGORY_COLORS_ARRAY, cardStyle as baseCardStyle, pageContainerStyle } from "@/lib/constants";
import { PageHeader } from "@/app/_components/page-header";

const { BG: BG_COLOR, BORDER: BORDER_COLOR, TEXT_MAIN, TEXT_SUB } = UI_COLORS;
const CATEGORY_COLORS = CATEGORY_COLORS_ARRAY;

type AnalyseData = {
  monthlyData: { month: string; income: number; expense: number }[];
  categoryStats: { name: string; amount: number; percent: number }[];
  statCards: { avgMonthlyExpense: number; avgMonthlySaving: number; highestMonth: string; savingRate: number };
  topExpenses: { rank: number; name: string; category: string; count: number; amount: number }[];
};

export function AnalyseClient({ data }: { data: AnalyseData }) {
  const [trendTab, setTrendTab] = useState("รายรับ-รายจ่าย");
  const [topTab, setTopTab] = useState("ยอดรวม");

  const cardStyle = {
    ...baseCardStyle,
    borderRadius: "20px",
  };

  const statCardsDisplay = [
    {
      label: "ค่าใช้จ่ายเฉลี่ย/เดือน",
      value: `฿${data.statCards.avgMonthlyExpense.toLocaleString()}`,
      color: "#f43f5e",
      icon: "📉",
    },
    {
      label: "ออมเงินเฉลี่ย/เดือน",
      value: `฿${data.statCards.avgMonthlySaving.toLocaleString()}`,
      color: "#10b981",
      icon: "🏦",
    },
    { label: "เดือนที่ใช้จ่ายสูงสุด", value: data.statCards.highestMonth, color: TEXT_MAIN, icon: "📅" },
    { label: "อัตราออมเงิน", value: `${data.statCards.savingRate}%`, color: "#f59e0b", icon: "💹" },
  ];

  const topExpensesSorted =
    topTab === "ครั้ง" ? [...data.topExpenses].sort((a, b) => b.count - a.count) : data.topExpenses;

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="วิเคราะห์เชิงลึก" subtitle="เจาะลึกพฤติกรรมการใช้เงินของคุณอย่างละเอียด" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {statCardsDisplay.map((s) => (
          <div key={s.label} style={cardStyle}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: BG_COLOR,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
              >
                {s.icon}
              </div>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: s.color }} />
            </div>
            <p
              style={{
                color: TEXT_SUB,
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {s.label}
            </p>
            <p style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>แนวโน้มรายรับ-รายจ่าย</h3>
            <div style={{ display: "flex", background: BG_COLOR, padding: "4px", borderRadius: "12px" }}>
              {["รายรับ-รายจ่าย", "รายจ่าย", "รายรับ"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTrendTab(tab)}
                  style={{
                    padding: "6px 16px",
                    fontSize: "12px",
                    border: "none",
                    borderRadius: "8px",
                    background: trendTab === tab ? "#2563be" : "transparent",
                    color: trendTab === tab ? "#fff" : "#000",
                    fontWeight: 600,
                    cursor: "pointer",
                    boxShadow: trendTab === tab ? "0 2px 4px rgb(0 0 0 / 0.05)" : "none",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: "220px" }}>
            {data.monthlyData.length > 0 ? (
              <svg viewBox="0 0 400 140" style={{ width: "100%", height: "100%" }}>
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 35 + 10}
                    x2="400"
                    y2={i * 35 + 10}
                    stroke={BORDER_COLOR}
                    strokeWidth="1"
                  />
                ))}
                {data.monthlyData.map((m, i) => {
                  const x = (i / Math.max(data.monthlyData.length - 1, 1)) * 370 + 15;
                  const maxVal = Math.max(...data.monthlyData.flatMap((d) => [d.income, d.expense]), 1);
                  const expenseY = 120 - (m.expense / maxVal) * 100;
                  const incomeY = 120 - (m.income / maxVal) * 100;
                  return (
                    <g key={i}>
                      {(trendTab === "รายรับ-รายจ่าย" || trendTab === "รายจ่าย") && (
                        <circle cx={x} cy={expenseY} r="5" fill="#ef4444" />
                      )}
                      {(trendTab === "รายรับ-รายจ่าย" || trendTab === "รายรับ") && (
                        <circle cx={x} cy={incomeY} r="5" fill="#10b981" />
                      )}
                      <text x={x} y="135" textAnchor="middle" fontSize="10" fill={TEXT_SUB}>
                        {m.month}
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: TEXT_SUB,
                }}
              >
                ไม่มีข้อมูล
              </div>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>สัดส่วนหมวดหมู่</h3>
          <p style={{ color: TEXT_SUB, fontSize: "13px", marginBottom: "28px" }}>ข้อมูลย้อนหลัง 6 เดือน</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {data.categoryStats.length === 0 ? (
              <p style={{ color: TEXT_SUB, textAlign: "center" }}>ไม่มีข้อมูล</p>
            ) : (
              data.categoryStats.map((cat, i) => (
                <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, width: "70px" }}>{cat.name}</span>
                  <div
                    style={{ flex: 1, height: "10px", background: BG_COLOR, borderRadius: "10px", overflow: "hidden" }}
                  >
                    <div
                      style={{
                        width: `${cat.percent}%`,
                        height: "100%",
                        background: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                        borderRadius: "10px",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "right", minWidth: "80px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700 }}>{cat.percent}%</span>
                    <p style={{ color: TEXT_SUB, fontSize: "11px" }}>฿{cat.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
        <div style={{ ...cardStyle, background: "#fff", border: "none" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>💡</div>
          <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>Insight รายสัปดาห์</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.6", fontWeight: 500 }}>
            {data.categoryStats.length > 0 ? (
              <>
                คุณใช้จ่ายกับหมวด <span style={{ fontWeight: 800 }}>{data.categoryStats[0].name}</span> มากที่สุด
                คิดเป็น {data.categoryStats[0].percent}% ของค่าใช้จ่ายทั้งหมด
              </>
            ) : (
              "เริ่มเพิ่มรายการเพื่อดูข้อมูลวิเคราะห์ของคุณ"
            )}
          </p>
        </div>

        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Top รายจ่ายสูงสุด</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              {["ยอดรวม", "ครั้ง"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTopTab(tab)}
                  style={{
                    padding: "6px 14px",
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "1px solid " + BORDER_COLOR,
                    background: topTab === tab ? "#2563eb" : "transparent",
                    color: topTab === tab ? "#fff" : TEXT_SUB,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {topExpensesSorted.length === 0 ? (
              <p style={{ color: TEXT_SUB, textAlign: "center", padding: "20px 0" }}>ไม่มีข้อมูล</p>
            ) : (
              topExpensesSorted.map((item) => (
                <div
                  key={item.rank}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px",
                    background: BG_COLOR,
                    borderRadius: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: TEXT_SUB, width: "15px" }}>{item.rank}</div>
                    <div>
                      <p style={{ fontSize: "15px", fontWeight: 700 }}>{item.name}</p>
                      <p style={{ color: TEXT_SUB, fontSize: "12px" }}>
                        {item.category} • {item.count} ครั้ง
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "18px", fontWeight: 800, color: item.rank === 1 ? "#e11d48" : TEXT_MAIN }}>
                      ฿{item.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
