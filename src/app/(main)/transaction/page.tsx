"use client";

import { useState } from "react";


const THEME_COLOR = "#2563be"; 
const BG_COLOR = "#f4f4f5";
const CARD_BG = "#ffffff";
const BORDER_COLOR = "#e4e4e7";
const TEXT_MAIN = "#09090b";
const TEXT_SUB = "#71717a";

const stats = [
  { label: "รายจ่ายเดือนนี้", value: "฿15,000", color: "#ef4444", icon: "↑" },
  { label: "รายได้เดือนนี้", value: "฿35,000", color: "#10b981", icon: "↓" },
  { label: "เฉลี่ยต่อวัน", value: "฿500", color: "#0ea5e9", icon: "≈" },
  { label: "จำนวนรายการ", value: "42", color: "#8b5cf6", icon: "#" },
];

const transactions = [
  { date: "28 มี.ค.", name: "ข้าวมันไก่", category: "อาหาร", amount: -80, icon: "🍜" },
  { date: "28 มี.ค.", name: "BTS", category: "เดินทาง", amount: -44, icon: "🚇" },
  { date: "27 มี.ค.", name: "Netflix", category: "บันเทิง", amount: -349, icon: "🎬" },
  { date: "27 มี.ค.", name: "เงินเดือน", category: "รายได้", amount: 35000, icon: "💰" },
  { date: "26 มี.ค.", name: "7-Eleven", category: "ช้อปปิ้ง", amount: -127, icon: "🛒" },
];

export default function TransactionPage() {
  const [filter, setFilter] = useState("ทั้งหมด");
  const [search, setSearch] = useState("");

  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  };

  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN }}>
      
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>รายการธุรกรรม</h1>
          <p style={{ color: TEXT_SUB, fontSize: "14px" }}>ตรวจสอบและค้นหาประวัติการใช้จ่ายของคุณ</p>
        </div>
        <button style={{ background: "#2563eb", color: "#fff", padding: "12px 24px", borderRadius: "12px", border: "none", fontWeight: 700, cursor: "pointer" }}>
          + เพิ่มรายการ
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {stats.map((s) => (
          <div key={s.label} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <p style={{ color: TEXT_SUB, fontSize: "12px", fontWeight: 600 }}>{s.label}</p>
              <span style={{ color: s.color, fontWeight: 800 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: "24px", fontWeight: 800 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ ...cardStyle, padding: "32px" }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหารายการ..."
              style={{
                width: "100%", background: BG_COLOR, border: `1px solid ${BORDER_COLOR}`,
                borderRadius: "12px", padding: "14px 16px 14px 40px", fontSize: "14px", outline: "none"
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
                  padding: "10px 20px", borderRadius: "8px", border: "none",
                  background: filter === f ? CARD_BG : "transparent",
                  color: filter === f ? TEXT_MAIN : TEXT_SUB,
                  fontWeight: 700, fontSize: "13px", cursor: "pointer",
                  boxShadow: filter === f ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {transactions.map((tx, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "100px 1fr 140px 120px",
              padding: "16px 0", borderBottom: `1px solid ${BG_COLOR}`, alignItems: "center"
            }}>
              <span style={{ color: TEXT_SUB, fontSize: "13px" }}>{tx.date}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "20px" }}>{tx.icon}</span>
                <span style={{ fontWeight: 600 }}>{tx.name}</span>
              </div>
              <span style={{ color: TEXT_SUB, fontSize: "12px", background: BG_COLOR, padding: "4px 12px", borderRadius: "8px", width: "fit-content" }}>
                {tx.category}
              </span>
              <span style={{ color: tx.amount > 0 ? "#10b981" : "#ef4444", fontSize: "16px", fontWeight: 800, textAlign: "right" }}>
                {tx.amount > 0 ? "+" : ""}฿{Math.abs(tx.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}