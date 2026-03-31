"use client";

import { Transaction } from "@/generated/prisma/client";
import { useState } from "react";
import { UI_COLORS, cardStyle as baseCardStyle, pageContainerStyle } from "@/lib/constants";
import { PageHeader } from "@/app/_components/page-header";
import { StatCardGrid } from "@/app/_components/stat-card";
import { TransactionList } from "@/app/_components/transaction-list";

const { BG: BG_COLOR, CARD_BG, BORDER: BORDER_COLOR, TEXT_MAIN, TEXT_SUB } = UI_COLORS;

export function TransactionClient({
  data,
}: {
  data: {
    transactions: Transaction[];
    stats: {
      monthlyExpense: number;
      monthlyIncome: number;
      avgPerDay: number;
      transactionCount: number;
    };
  };
}) {
  const [filter, setFilter] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");

  const statsDisplay = [
    { label: "รายจ่ายเดือนนี้", value: `฿${data.stats.monthlyExpense.toLocaleString()}`, color: "#ef4444", icon: "↑" },
    { label: "รายได้เดือนนี้", value: `฿${data.stats.monthlyIncome.toLocaleString()}`, color: "#10b981", icon: "↓" },
    { label: "เฉลี่ยต่อวัน", value: `฿${data.stats.avgPerDay.toLocaleString()}`, color: "#0ea5e9", icon: "≈" },
    { label: "จำนวนรายการ", value: `${data.stats.transactionCount}`, color: "#8b5cf6", icon: "#" },
  ];

  const filteredTransactions = data.transactions.filter((tx) => {
    if (filter === "รายจ่าย" && tx.type !== "expense") return false;
    if (filter === "รายรับ" && tx.type !== "income") return false;
    if (search && !(tx.name || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const cardStyle = {
    ...baseCardStyle,
    borderRadius: "20px",
    padding: "20px",
  };

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="รายการธุรกรรม" subtitle="ตรวจสอบและค้นหาประวัติการใช้จ่ายของคุณ" />

      <StatCardGrid stats={statsDisplay} />

      <div style={{ ...cardStyle, padding: "32px" }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหารายการ..."
              style={{
                width: "100%",
                background: BG_COLOR,
                border: `1px solid ${BORDER_COLOR}`,
                borderRadius: "12px",
                padding: "14px 16px 14px 40px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <span style={{ position: "absolute", left: "14px", top: "14px", color: TEXT_SUB }}>🔍</span>
          </div>
          <div style={{ display: "flex", background: BG_COLOR, padding: "4px", borderRadius: "12px" }}>
            {["ทั้งหมด", "รายจ่าย", "รายรับ"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  background: filter === f ? CARD_BG : "transparent",
                  color: filter === f ? TEXT_MAIN : TEXT_SUB,
                  fontWeight: 700,
                  fontSize: "13px",
                  cursor: "pointer",
                  boxShadow: filter === f ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <TransactionList transactions={filteredTransactions} />
      </div>
    </div>
  );
}
