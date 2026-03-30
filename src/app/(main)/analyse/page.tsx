"use client";

import { useState } from "react";

const THEME_COLOR = "#2563be"; 
const BG_COLOR = "#f4f4f5";   
const CARD_BG = "#ffffff";     
const BORDER_COLOR = "#e4e4e7"; 
const TEXT_MAIN = "#09090b"; 
const TEXT_SUB = "#71717a";   

const categoryStats = [
  { name: "อาหาร", percent: 48, amount: "฿32,442", color: "#84cc16", icon: "🍜" },
  { name: "เดินทาง", percent: 32, amount: "฿18,786", color: "#0ea5e9", icon: "🚗" },
  { name: "บันเทิง", percent: 28, amount: "฿15,408", color: "#8b5cf6", icon: "🎮" },
  { name: "สุขภาพ", percent: 16, amount: "฿5,130", color: "#10b981", icon: "🏥" },
  { name: "อื่นๆ", percent: 15, amount: "฿4,130", color: "#71717a", icon: "📦" },
];

const topExpenses = [
  { rank: 1, name: "ข้าว/อาหาร", category: "อาหาร", count: "180 ครั้ง", amount: "฿18,400", icon: "🍜", color: "#84cc16" },
  { rank: 2, name: "BTS/MRT", category: "เดินทาง", count: "142 ครั้ง", amount: "฿8,520", icon: "🚇", color: "#0ea5e9" },
  { rank: 3, name: "Streaming", category: "บันเทิง", count: "12 ครั้ง", amount: "฿1,780", icon: "🎬", color: "#8b5cf6" },
];

const statCards = [
  { label: "ค่าใช้จ่ายเฉลี่ย/เดือน", value: "฿12,540", color: "#f43f5e", icon: "📉" },
  { label: "ออมเงินเฉลี่ย/เดือน", value: "฿4,200", color: "#10b981", icon: "🏦" },
  { label: "เดือนที่ใช้จ่ายสูงสุด", value: "ธันวาคม", color: TEXT_MAIN, icon: "📅" },
  { label: "อัตราออมเงิน", value: "15%", color: "#f59e0b", icon: "💹" },
];

export default function AnalysePage() {
  const [trendTab, setTrendTab] = useState("รายรับ-รายจ่าย");
  const [topTab, setTopTab] = useState("ยอดรวม");

  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  };

  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN, fontFamily: "inherit" }}>
    
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>วิเคราะห์เชิงลึก</h1>
        <p style={{ color: TEXT_SUB, fontSize: "14px" }}>เจาะลึกพฤติกรรมการใช้เงินของคุณอย่างละเอียด</p>
      </div>

 
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
        {statCards.map((s) => (
          <div key={s.label} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", background: BG_COLOR, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
                {s.icon}
              </div>
              <div style={{
                width: "10px", height: "10px",
                borderRadius: "50%",
                background: s.color,
              }} />
            </div>
            <p style={{ color: TEXT_SUB, fontSize: "12px", fontWeight: 600, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {s.label}
            </p>
            <p style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px", marginBottom: "24px" }}>
        {/* Trend Chart Card */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>แนวโน้มรายรับ-รายจ่าย</h3>
            <div style={{ display: "flex", background: BG_COLOR, padding: "4px", borderRadius: "12px"}}>
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
                    transition: "all 0.2s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ height: "220px" }}>
            <svg viewBox="0 0 400 120" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={THEME_COLOR} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={THEME_COLOR} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="0" y1={i * 30 + 10} x2="400" y2={i * 30 + 10} stroke={BORDER_COLOR} strokeWidth="1" />
              ))}
              <path d="M0,80 C30,70 60,90 90,60 C120,30 150,95 180,50 C210,20 240,75 270,40 C300,10 330,70 370,35 L370,120 L0,120 Z"
                fill="url(#lineGrad)" />
              <path d="M0,80 C30,70 60,90 90,60 C120,30 150,95 180,50 C210,20 240,75 270,40 C300,10 330,70 370,35"
                fill="none" stroke={TEXT_MAIN} strokeWidth="3" strokeLinecap="round" />
              <circle cx="370" cy="35" r="5" fill={TEXT_MAIN} />
            </svg>
          </div>
        </div>

        {/* Category Proportion Card */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>สัดส่วนหมวดหมู่</h3>
          <p style={{ color: TEXT_SUB, fontSize: "13px", marginBottom: "28px" }}>ข้อมูลย้อนหลัง 6 เดือน</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {categoryStats.map((cat) => (
              <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span style={{ fontSize: "18px" }}>{cat.icon}</span>
                <span style={{ fontSize: "14px", fontWeight: 600, width: "70px" }}>{cat.name}</span>
                <div style={{ flex: 1, height: "10px", background: BG_COLOR, borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{
                    width: `${cat.percent}%`, height: "100%",
                    background: cat.color,
                    borderRadius: "10px",
                  }} />
                </div>
                <div style={{ textAlign: "right", minWidth: "80px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700 }}>{cat.percent}%</span>
                  <p style={{ color: TEXT_SUB, fontSize: "11px" }}>{cat.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "24px" }}>
        {/* Advice/Tip Card */}
        <div style={{ ...cardStyle, background: "#fff", border: "none" }}>
          <div style={{ fontSize: "40px", marginBottom: "16px" }}>💡</div>
          <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "12px" }}>Insight รายสัปดาห์</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.6", fontWeight: 500 }}>
            คุณใช้จ่ายกับหมวด <span style={{ fontWeight: 800 }}>"อาหาร"</span> สูงกว่าค่าเฉลี่ยปกติ 12% 
            ลองปรับแผนการกินนอกบ้านเพื่อเพิ่มอัตราการออมเงินในเดือนหน้า!
          </p>
          <button style={{ marginTop: "24px", padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "12px", fontWeight: 700, cursor: "pointer" }}>
            ดูคำแนะนำเพิ่มเติม
          </button>
        </div>

        {/* Top Expenses List */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Top รายจ่ายสูงสุด</h3>
            <div style={{ display: "flex", gap: "8px" }}>
               {["ยอดรวม", "ครั้ง"].map(tab => (
                 <button key={tab} onClick={() => setTopTab(tab)} style={{
                   padding: "6px 14px", fontSize: "12px", borderRadius: "8px", border: "1px solid " + BORDER_COLOR,
                   background: topTab === tab ? "#2563eb" : "transparent",
                   color: topTab === tab ? "#fff" : TEXT_SUB,
                   fontWeight: 600, cursor: "pointer"
                 }}>{tab}</button>
               ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {topExpenses.map((item) => (
              <div key={item.rank} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                background: BG_COLOR,
                borderRadius: "16px",
                border: "1px solid transparent",
                transition: "transform 0.2s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: TEXT_SUB, width: "15px" }}>{item.rank}</div>
                  <div style={{ fontSize: "24px" }}>{item.icon}</div>
                  <div>
                    <p style={{ fontSize: "15px", fontWeight: 700 }}>{item.name}</p>
                    <p style={{ color: TEXT_SUB, fontSize: "12px" }}>{item.category} • {item.count}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: "18px", fontWeight: 800, color: item.rank === 1 ? "#e11d48" : TEXT_MAIN }}>{item.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}