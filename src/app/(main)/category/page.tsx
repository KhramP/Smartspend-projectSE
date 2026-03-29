"use client";

import { useState } from "react";


const THEME_COLOR = "#2563be"; 
const BG_COLOR = "#f4f4f5";    
const CARD_BG = "#ffffff";     
const BORDER_COLOR = "#e4e4e7"; 
const TEXT_MAIN = "#09090b";   
const TEXT_SUB = "#71717a";    

const categories = [
  { name: "อาหาร", icon: "🍜", count: 42, amount: 5407, percent: 70, color: "#84cc16" },
  { name: "เดินทาง", icon: "🚗", count: 18, amount: 3131, percent: 55, color: "#0ea5e9" },
  { name: "บันเทิง", icon: "🎮", count: 8, amount: 2561, percent: 65, color: "#8b5cf6" },
  { name: "ช้อปปิ้ง", icon: "🛍️", count: 5, amount: 1890, percent: 35, color: "#f43f5e" },
  { name: "สุขภาพ", icon: "🏥", count: 2, amount: 600, percent: 25, color: "#10b981" },
  { name: "การศึกษา", icon: "📚", count: 3, amount: 480, percent: 38, color: "#ec4899" },
  { name: "ค่าน้ำไฟ", icon: "💡", count: 2, amount: 361, percent: 58, color: "#f59e0b" },
];

export default function CategoryPage() {
  const [hovered, setHovered] = useState<string | null>(null);

  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "24px",
    padding: "24px",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
  };

  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN, fontFamily: "inherit" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>หมวดหมู่</h1>
          <p style={{ color: TEXT_SUB, fontSize: "14px" }}>จัดการและวิเคราะห์ค่าใช้จ่ายแยกตามประเภท</p>
        </div>
        <button style={{
          background: "#2563eb",
          color: "#fff",
          padding: "12px 24px",
          border: "none",
          borderRadius: "14px",
          fontWeight: 700,
          fontSize: "14px",
          cursor: "pointer",
          transition: "transform 0.1s",
        }}>
          + เพิ่มหมวดหมู่
        </button>
      </div>

      {/* Summary Bar */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
        marginBottom: "32px",
      }}>
        {[
          { label: "หมวดหมู่ทั้งหมด", value: "7", accent: THEME_COLOR },
          { label: "รายการรวมเดือนนี้", value: "80", accent: "#0ea5e9" },
          { label: "ยอดรวมทุกหมวดหมู่", value: "฿14,430", accent: "#8b5cf6" },
        ].map((s) => (
          <div key={s.label} style={{ ...cardStyle, display: "flex", alignItems: "center", gap: "20px", padding: "20px 28px" }}>
            <div style={{ width: "5px", height: "40px", background: s.accent, borderRadius: "10px" }} />
            <div>
              <p style={{ color: TEXT_SUB, fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "4px" }}>{s.label}</p>
              <p style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", 
        gap: "20px",
      }}>
        {categories.map((cat) => (
          <div
            key={cat.name}
            onMouseEnter={() => setHovered(cat.name)}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...cardStyle,
              borderColor: hovered === cat.name ? cat.color : BORDER_COLOR,
              transform: hovered === cat.name ? "translateY(-4px)" : "none",
              boxShadow: hovered === cat.name ? `0 10px 15px -3px ${cat.color}20` : "0 1px 3px 0 rgb(0 0 0 / 0.05)",
              cursor: "pointer",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{
                width: "52px", height: "52px",
                background: `${cat.color}10`,
                borderRadius: "16px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "26px",
              }}>
                {cat.icon}
              </div>
              <div style={{
                background: BG_COLOR,
                color: TEXT_SUB,
                padding: "6px 12px",
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: 700,
                border: `1px solid ${BORDER_COLOR}`,
              }}>
                {cat.count} รายการ
              </div>
            </div>

            {/* Info */}
            <p style={{ color: TEXT_SUB, fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>{cat.name}</p>
            <p style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800, marginBottom: "20px" }}>
              ฿{cat.amount.toLocaleString()}
            </p>

            {/* Progress Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: TEXT_SUB, fontSize: "11px", fontWeight: 500 }}>สัดส่วนการใช้จ่าย</span>
                <span style={{ color: cat.color, fontSize: "12px", fontWeight: 800 }}>{cat.percent}%</span>
              </div>
              <div style={{ height: "8px", background: BG_COLOR, borderRadius: "10px", overflow: "hidden" }}>
                <div style={{
                  width: `${cat.percent}%`,
                  height: "100%",
                  background: cat.color,
                  borderRadius: "10px",
                  transition: "width 0.8s ease-in-out",
                }} />
              </div>
            </div>
          </div>
        ))}

        {/* Add New Category Card */}
        <div style={{
          ...cardStyle,
          background: "transparent",
          border: `2px dashed ${BORDER_COLOR}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          cursor: "pointer",
          minHeight: "220px",
          boxShadow: "none",
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = THEME_COLOR;
            e.currentTarget.style.background = `${THEME_COLOR}05`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = BORDER_COLOR;
            e.currentTarget.style.background = "transparent";
          }}
        >
          <div style={{
            width: "48px", height: "48px",
            background: "#fff",
            border: `1px solid ${BORDER_COLOR}`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "24px", color: TEXT_SUB,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
          }}>
            +
          </div>
          <p style={{ color: TEXT_SUB, fontSize: "14px", fontWeight: 600 }}>เพิ่มหมวดหมู่ใหม่</p>
        </div>
      </div>
    </div>
  );
}