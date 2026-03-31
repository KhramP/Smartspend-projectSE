"use client";

import { useState } from "react";
import { Transaction } from "@/generated/prisma/client";
import { getHistoryPageData } from "@/app/actions/transaction";
import { UI_COLORS, cardStyle as baseCardStyle, pageContainerStyle } from "@/lib/constants";
import { PageHeader } from "@/app/_components/page-header";
import { TransactionList } from "@/app/_components/transaction-list";

const { BG: BG_COLOR, BORDER: BORDER_COLOR, TEXT_MAIN, TEXT_SUB, THEME: THEME_COLOR } = UI_COLORS;

export function HistoryClient({ userId }: { userId: string }) {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const years = [2025, 2026];
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (y: number, m: string) => {
    const k = `${y}-${m}`;
    setSelected((p) => ({ ...p, [k]: !p[k] }));
  };

  const cardStyle = {
    ...baseCardStyle,
    padding: "40px",
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const handleSearch = async () => {
    setLoading(true);
    const selectedMonths = Object.entries(selected)
      .filter(([, v]) => v)
      .map(([k]) => {
        const [year, monthStr] = k.split("-");
        const monthIndex = months.indexOf(monthStr);
        return { year: parseInt(year), month: monthIndex };
      });

    const data = await getHistoryPageData({ userId, months: selectedMonths });
    setTransactions(data.transactions);
    setLoading(false);
  };

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="ประวัติ" subtitle="เลือกช่วงเวลาที่ต้องการตรวจสอบรายการย้อนหลัง" />

      <div style={cardStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {years.map((year) => (
            <div key={year}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "40px", fontWeight: 900, lineHeight: 1, color: TEXT_MAIN }}>{year}</h3>
                <div style={{ height: "2px", flex: 1, background: BG_COLOR, borderRadius: "2px" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px" }}>
                {months.map((m) => {
                  const key = `${year}-${m}`;
                  const isOn = !!selected[key];
                  return (
                    <div
                      key={m}
                      onClick={() => toggle(year, m)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px",
                        borderRadius: "16px",
                        background: isOn ? `${THEME_COLOR}20` : "transparent",
                        border: `1px solid ${isOn ? THEME_COLOR : BORDER_COLOR}`,
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          border: `2px solid ${isOn ? "#000" : BORDER_COLOR}`,
                          background: isOn ? "#000" : "transparent",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isOn && <span style={{ color: THEME_COLOR, fontSize: "12px", fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ color: isOn ? "#000" : TEXT_SUB, fontSize: "15px", fontWeight: isOn ? 700 : 500 }}>
                        {m}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
            paddingTop: "32px",
            borderTop: `1px solid ${BORDER_COLOR}`,
          }}
        >
          <button
            onClick={handleSearch}
            disabled={selectedCount === 0 || loading}
            style={{
              flex: 2,
              padding: "18px",
              background: selectedCount > 0 ? "#2563eb" : BORDER_COLOR,
              color: selectedCount > 0 ? "#fff" : TEXT_SUB,
              border: "none",
              borderRadius: "16px",
              fontWeight: 800,
              fontSize: "16px",
              cursor: selectedCount > 0 ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "กำลังโหลด..." : `ดูประวัติการใช้จ่าย (${selectedCount} เดือน)`}
          </button>
          <button
            onClick={() => {
              setSelected({});
              setTransactions([]);
            }}
            style={{
              flex: 1,
              padding: "18px",
              background: "transparent",
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: "16px",
              color: TEXT_SUB,
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            ล้างทั้งหมด
          </button>
        </div>
      </div>

      {transactions.length > 0 && (
        <div style={{ ...cardStyle, marginTop: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px" }}>
            ผลลัพธ์ ({transactions.length} รายการ)
          </h3>
          <TransactionList transactions={transactions} showYear />
        </div>
      )}
    </div>
  );
}
