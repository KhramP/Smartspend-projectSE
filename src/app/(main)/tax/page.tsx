"use client";

import { useState } from "react";
 
const THEME_COLOR = "#2563be"; 
const BG_COLOR = "#f4f4f5";    
const CARD_BG = "#ffffff";     
const BORDER_COLOR = "#e4e4e7"; 
const TEXT_MAIN = "#09090b";   
const TEXT_SUB = "#71717a";   

export default function TaxPage() {
  const [taxResult] = useState({ amount: "100.00", rate: "15.00" });
  const taxBrackets = [
    { income: "1 - 150,000", rate: "ยกเว้น" },
    { income: "150,001 - 300,000", rate: "5%" },
    { income: "300,001 - 500,000", rate: "10%" },
    { income: "500,001 - 750,000", rate: "15%" },
    { income: "750,001 - 1,000,000", rate: "20%" },
    { income: "1,000,001 - 2,000,000", rate: "25%" },
    { income: "2,000,001 - 5,000,000", rate: "30%" },
    { income: "5,000,001+", rate: "35%" },
  ];
 
  const fields = [
    "ค่าลดหย่อนส่วนตัว", "เบี้ยประกันชีวิต", "กองทุน SSF/RMF", "ดอกเบี้ยบ้าน", "เงินบริจาค"
  ];

  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
  };
 
  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN, fontFamily: "inherit" }}>
      
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>คำนวณภาษี</h1>
        <p style={{ color: TEXT_SUB, fontSize: "14px" }}>ประมาณการภาษีเงินได้บุคคลธรรมดาและจัดการค่าลดหย่อน</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
  
        {/*Input Form */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
            <span>📝</span> ค่าลดหย่อน
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {fields.map((f) => (
              <div key={f}>
                <label style={{ color: TEXT_SUB, fontSize: "12px", fontWeight: 700, display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{f}</label>
                <input type="number" placeholder="0" style={{
                  width: "100%", background: BG_COLOR, border: `1px solid ${BORDER_COLOR}`,
                  borderRadius: "12px", padding: "14px 16px", color: TEXT_MAIN, fontSize: "15px",
                  outline: "none", boxSizing: "border-box", transition: "all 0.2s"
                }} 
                onFocus={(e) => {
                  e.target.style.borderColor = "#000";
                  e.target.style.background = "#fff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = BORDER_COLOR;
                  e.target.style.background = BG_COLOR;
                }} />
              </div>
            ))}
          </div>
          <button style={{
            marginTop: "32px", width: "100%", padding: "18px",
            background: "#2563eb", color: "#fff", border: "none",
            borderRadius: "16px", fontWeight: 800, fontSize: "16px", cursor: "pointer",
            transition: "transform 0.1s"
          }}>
            คำนวณภาษี
          </button>
        </div>
 
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Result Card */}
          <div style={{
            ...cardStyle,
            textAlign: "center",
            background: `linear-gradient(135deg, ${CARD_BG} 0%, #f7fee7 100%)`,
          }}>
            <p style={{ color: TEXT_SUB, fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>ภาษีที่ต้องชำระ (ประมาณการ)</p>
            <h2 style={{ color: TEXT_MAIN, fontSize: "56px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "8px" }}>
              ฿{taxResult.amount}
            </h2>
            <div style={{ display: "inline-block", background: THEME_COLOR, padding: "4px 16px", borderRadius: "99px" }}>
              <p style={{ color: "#fff", fontSize: "13px", fontWeight: 800 }}>อัตราภาษีที่แท้จริง {taxResult.rate}%</p>
            </div>
          </div>
 
          <div style={{ ...cardStyle, padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>อัตราภาษีเงินได้บุคคลธรรมดา</h3>
            </div>
            <div style={{ padding: "8px 0" }}>
              {taxBrackets.map((b, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 24px",
                  background: i % 2 === 0 ? "transparent" : "#fafafa",
                }}>
                  <span style={{ color: TEXT_SUB, fontSize: "13px", fontWeight: 500 }}>{b.income}</span>
                  <span style={{
                    color: b.rate === "ยกเว้น" ? "#10b981" : TEXT_MAIN,
                    fontSize: "12px", fontWeight: 800,
                    background: b.rate === "ยกเว้น" ? "#ecfdf5" : BG_COLOR,
                    padding: "4px 12px", borderRadius: "8px",
                    minWidth: "60px", textAlign: "center",
                    border: `1px solid ${b.rate === "ยกเว้น" ? "#d1fae5" : BORDER_COLOR}`
                  }}>
                    {b.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}