"use client";

import { useState } from "react";
import { UI_COLORS, cardStyle as baseCardStyle, pageContainerStyle } from "@/lib/constants";
import { calculateTax, TAX_BRACKETS_DISPLAY } from "@/services/tax.service";
import { PageHeader } from "@/app/_components/page-header";

const { BG: BG_COLOR, CARD_BG, BORDER: BORDER_COLOR, TEXT_MAIN, TEXT_SUB, THEME: THEME_COLOR } = UI_COLORS;

export function TaxClient({ userId }: { userId: string }) {
  const [fields, setFields] = useState({
    personalDeduction: 60000,
    lifeInsurance: 0,
    ssfRmf: 0,
    homeLoanInterest: 0,
    donation: 0,
  });
  const [annualIncome, setAnnualIncome] = useState(0);

  const totalDeductions = Object.values(fields).reduce((a, b) => a + b, 0);
  const taxableIncome = Math.max(annualIncome - totalDeductions, 0);
  const { tax, effectiveRate } = calculateTax(taxableIncome);

  const taxBrackets = TAX_BRACKETS_DISPLAY;

  const fieldDefs = [
    { key: "annualIncome", label: "รายได้ต่อปี", isIncome: true },
    { key: "personalDeduction", label: "ค่าลดหย่อนส่วนตัว" },
    { key: "lifeInsurance", label: "เบี้ยประกันชีวิต" },
    { key: "ssfRmf", label: "กองทุน SSF/RMF" },
    { key: "homeLoanInterest", label: "ดอกเบี้ยบ้าน" },
    { key: "donation", label: "เงินบริจาค" },
  ];

  const cardStyle = {
    ...baseCardStyle,
    padding: "32px",
  };

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="คำนวณภาษี" subtitle="ประมาณการภาษีเงินได้บุคคลธรรมดาและจัดการค่าลดหย่อน" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>📝</span> รายได้และค่าลดหย่อน
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {fieldDefs.map((f) => (
              <div key={f.key}>
                <label
                  style={{
                    color: TEXT_SUB,
                    fontSize: "12px",
                    fontWeight: 700,
                    display: "block",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {f.label}
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={f.isIncome ? annualIncome || "" : (fields as Record<string, number>)[f.key] || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (f.isIncome) {
                      setAnnualIncome(val);
                    } else {
                      setFields((prev) => ({ ...prev, [f.key]: val }));
                    }
                  }}
                  style={{
                    width: "100%",
                    background: BG_COLOR,
                    border: `1px solid ${BORDER_COLOR}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    color: TEXT_MAIN,
                    fontSize: "15px",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              ...cardStyle,
              textAlign: "center",
              background: `linear-gradient(135deg, ${CARD_BG} 0%, #f7fee7 100%)`,
            }}
          >
            <p style={{ color: TEXT_SUB, fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
              ภาษีที่ต้องชำระ (ประมาณการ)
            </p>
            <h2
              style={{
                color: TEXT_MAIN,
                fontSize: "56px",
                fontWeight: 900,
                letterSpacing: "-2px",
                marginBottom: "8px",
              }}
            >
              ฿{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div
              style={{ display: "inline-block", background: THEME_COLOR, padding: "4px 16px", borderRadius: "99px" }}
            >
              <p style={{ color: "#fff", fontSize: "13px", fontWeight: 800 }}>
                อัตราภาษีที่แท้จริง {effectiveRate.toFixed(2)}%
              </p>
            </div>
            <div style={{ marginTop: "16px", display: "flex", justifyContent: "center", gap: "24px" }}>
              <div>
                <p style={{ color: TEXT_SUB, fontSize: "11px" }}>รายได้สุทธิ</p>
                <p style={{ fontWeight: 700 }}>฿{taxableIncome.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ color: TEXT_SUB, fontSize: "11px" }}>ลดหย่อนรวม</p>
                <p style={{ fontWeight: 700 }}>฿{totalDeductions.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div style={{ ...cardStyle, padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700 }}>อัตราภาษีเงินได้บุคคลธรรมดา</h3>
            </div>
            <div style={{ padding: "8px 0" }}>
              {taxBrackets.map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                    background: i % 2 === 0 ? "transparent" : "#fafafa",
                  }}
                >
                  <span style={{ color: TEXT_SUB, fontSize: "13px", fontWeight: 500 }}>{b.income}</span>
                  <span
                    style={{
                      color: b.rate === "ยกเว้น" ? "#10b981" : TEXT_MAIN,
                      fontSize: "12px",
                      fontWeight: 800,
                      background: b.rate === "ยกเว้น" ? "#ecfdf5" : BG_COLOR,
                      padding: "4px 12px",
                      borderRadius: "8px",
                      minWidth: "60px",
                      textAlign: "center",
                      border: `1px solid ${b.rate === "ยกเว้น" ? "#d1fae5" : BORDER_COLOR}`,
                    }}
                  >
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
