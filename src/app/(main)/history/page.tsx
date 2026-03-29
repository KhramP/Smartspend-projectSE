"use client";

import { useState } from "react";


const THEME_COLOR = "#2563be"; 
const BG_COLOR = "#f4f4f5";    
const CARD_BG = "#ffffff";    
const BORDER_COLOR = "#e4e4e7";
const TEXT_MAIN = "#09090b";   
const TEXT_SUB = "#71717a";   

export default function HistoryPage() {
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const years = [2024, 2025];
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const toggle = (y: number, m: string) => {
    const k = `${y}-${m}`;
    setSelected((p) => ({ ...p, [k]: !p[k] }));
  };

  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "24px",
    padding: "40px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
  };

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN, fontFamily: "inherit" }}>
      
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>ประวัติ</h1>
        <p style={{ color: TEXT_SUB, fontSize: "14px" }}>เลือกช่วงเวลาที่ต้องการตรวจสอบรายการย้อนหลัง</p>
      </div>

      <div style={cardStyle}>
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {years.map((year) => (
            <div key={year}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "40px", fontWeight: 900, lineHeight: 1, color: TEXT_MAIN }}>
                  {year}
                </h3>
                <div style={{ height: "2px", flex: 1, background: BG_COLOR, borderRadius: "2px" }} />
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(6, 1fr)", 
                gap: "16px" 
              }}>
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
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (!isOn) e.currentTarget.style.background = BG_COLOR;
                      }}
                      onMouseLeave={(e) => {
                        if (!isOn) e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <div style={{
                        width: "24px", height: "24px",
                        border: `2px solid ${isOn ? "#000" : BORDER_COLOR}`,
                        background: isOn ? "#000" : "transparent",
                        borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s",
                      }}>
                        {isOn && <span style={{ color: THEME_COLOR, fontSize: "12px", fontWeight: 900 }}>✓</span>}
                      </div>
                      <span style={{ 
                        color: isOn ? "#000" : TEXT_SUB, 
                        fontSize: "15px", 
                        fontWeight: isOn ? 700 : 500 
                      }}>
                        {m}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          gap: "16px", 
          marginTop: "48px", 
          paddingTop: "32px", 
          borderTop: `1px solid ${BORDER_COLOR}` 
        }}>
          <button style={{
            flex: 2, 
            padding: "18px",
            background: selectedCount > 0 ? "#2563eb" : BORDER_COLOR, 
            color: selectedCount > 0 ? "#fff" : TEXT_SUB,
            border: "none",
            borderRadius: "16px", 
            fontWeight: 800, 
            fontSize: "16px", 
            cursor: selectedCount > 0 ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}>
            ดูประวัติการใช้จ่าย ({selectedCount} เดือน)
          </button>
          
          <button 
            onClick={() => setSelected({})} 
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
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff1f2";
              e.currentTarget.style.color = "#e11d48";
              e.currentTarget.style.borderColor = "#fecaca";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = TEXT_SUB;
              e.currentTarget.style.borderColor = BORDER_COLOR;
            }}
          >
            ล้างทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}