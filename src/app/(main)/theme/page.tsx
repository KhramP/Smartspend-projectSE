"use client";

import { useState } from "react";

const THEME_COLOR = "#2563be"; 
const BG_COLOR = "#f4f4f5";   
const CARD_BG = "#ffffff";     
const BORDER_COLOR = "#e4e4e7"; 
const TEXT_MAIN = "#09090b";   
const TEXT_SUB = "#71717a";    

export default function ThemePage() {
  const [selectedColor, setSelectedColor] = useState("#bef264"); 
  const [cardStyleName, setCardStyleName] = useState("Minimalist");
  const [fontSize, setFontSize] = useState(16);
 
  const accentColors = [
    { name: "Lemon Green", value: "#bef264" },
    { name: "Ocean Blue", value: "#38bdf8" },
    { name: "Royal Purple", value: "#a855f7" },
    { name: "Fiery Red", value: "#ef4444" },
    { name: "Sunset Orange", value: "#f97316" },
    { name: "Sakura Pink", value: "#ec4899" },
  ];
  const cardStyles = ["Minimalist", "Glassmorphism", "Material Design", "Bold Outline"];

  const containerCardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
  };
 
  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN, fontFamily: "inherit" }}>
      
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>ปรับแต่งธีม</h1>
        <p style={{ color: TEXT_SUB, fontSize: "14px" }}>เลือกสไตล์และสีสันที่สะท้อนความเป็นตัวคุณ</p>
      </div>
 
      <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "24px" }}>
        
        <div style={containerCardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ color: selectedColor }}>●</span> สีหลักของแอป
          </h3>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            {accentColors.map((c) => (
              <div 
                key={c.value} 
                onClick={() => setSelectedColor(c.value)} 
                style={{
                  width: "56px", height: "56px", borderRadius: "16px",
                  background: c.value, cursor: "pointer",
                  border: selectedColor === c.value ? `4px solid #fff` : "none",
                  boxShadow: selectedColor === c.value ? `0 0 0 2px ${c.value}, 0 4px 12px ${c.value}40` : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: selectedColor === c.value ? "scale(1.1)" : "scale(1)",
                }}
              >
                {selectedColor === c.value && <span style={{ color: "#000", fontWeight: 900, fontSize: "20px" }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
 
        {/*Card style*/}
        <div style={containerCardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>
            <span style={{ color: selectedColor }}>●</span> สไตล์การ์ด
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {cardStyles.map((s) => (
              <div 
                key={s} 
                onClick={() => setCardStyleName(s)} 
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "16px 20px",
                  background: cardStyleName === s ? `${selectedColor}10` : BG_COLOR,
                  border: `1px solid ${cardStyleName === s ? selectedColor : BORDER_COLOR}`,
                  borderRadius: "14px", cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <span style={{ color: cardStyleName === s ? TEXT_MAIN : TEXT_SUB, fontSize: "14px", fontWeight: 700 }}>{s}</span>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  border: `2px solid ${cardStyleName === s ? selectedColor : BORDER_COLOR}`,
                  background: cardStyleName === s ? selectedColor : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {cardStyleName === s && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#000" }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/*Font*/}
        <div style={containerCardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "24px" }}>
            <span style={{ color: selectedColor }}>●</span> ขนาดตัวอักษร
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px", padding: "0 10px" }}>
            <span style={{ color: TEXT_SUB, fontSize: "12px", fontWeight: 800 }}>A</span>
            <input 
              type="range" min={12} max={24} value={fontSize}
              onChange={(e) => setFontSize(+e.target.value)}
              style={{ 
                flex: 1, 
                accentColor: "#2563eb",
                height: "6px",
                cursor: "pointer"
              }} 
            />
            <span style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800 }}>A</span>
          </div>
          <div style={{ 
            background: BG_COLOR, 
            padding: "24px", 
            borderRadius: "16px", 
            textAlign: "center",
            border: `1px dashed ${BORDER_COLOR}`
          }}>
            <p style={{ color: TEXT_MAIN, fontSize: `${fontSize}px`, fontWeight: 500 }}>
              นี่คือตัวอย่างขนาดตัวอักษรของคุณ ({fontSize}px)
            </p>
          </div>
        </div>
 
        {/*Save Button*/}
        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          <button style={{
            flex: 2, padding: "20px",
            background: "#2563eb", color: "#fff", border: "none",
            borderRadius: "18px", fontWeight: 800, fontSize: "16px", cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: `0 10px 15px -3px rgba(0,0,0,0.1)`
          }}>
            บันทึกการปรับแต่งธีม
          </button>
          <button style={{
            flex: 1, padding: "20px",
            background: "transparent", border: `1px solid ${BORDER_COLOR}`,
            borderRadius: "18px", color: TEXT_SUB, fontWeight: 700, fontSize: "16px", cursor: "pointer"
          }}>
            คืนค่าเริ่มต้น
          </button>
        </div>
      </div>
    </div>
  );
}