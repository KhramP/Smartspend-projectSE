"use client";

import { useState } from "react";
import { calculateTax, TAX_BRACKETS_DISPLAY } from "@/services/tax.service";
import "@/app/_components/GlobalLayout.css";

export function TaxClient({ userId, yearlyIncome }: { userId: string; yearlyIncome: number }) {
  const [fields, setFields] = useState({
    personalDeduction: 60000,
    lifeInsurance: 0,
    ssfRmf: 0,
    homeLoanInterest: 0,
    donation: 0,
  });
  const [annualIncome, setAnnualIncome] = useState(yearlyIncome);

  const totalDeductions = Object.values(fields).reduce((a, b) => a + b, 0);
  const taxableIncome = Math.max(annualIncome - totalDeductions, 0);
  const { tax, effectiveRate } = calculateTax(taxableIncome);

  const taxBrackets = TAX_BRACKETS_DISPLAY;

  const fieldDefs: { key: string; label: string; isIncome?: boolean }[] = [
    { key: "annualIncome", label: `รายได้ต่อปี (ดึงจากระบบ: ฿${yearlyIncome.toLocaleString()})`, isIncome: true },
    { key: "personalDeduction", label: "ค่าลดหย่อนส่วนตัว" },
    { key: "lifeInsurance", label: "เบี้ยประกันชีวิต" },
    { key: "ssfRmf", label: "กองทุน SSF/RMF (บาท)" },
    { key: "homeLoanInterest", label: "ดอกเบี้ยบ้าน (บาท)" },
    { key: "donation", label: "เงินบริจาค (บาท)" },
  ];

  const handleReset = () => {
    setAnnualIncome(yearlyIncome);
    setFields({ personalDeduction: 60000, lifeInsurance: 0, ssfRmf: 0, homeLoanInterest: 0, donation: 0 });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Left: Form */}
        <div className="glass-card p-8">
          <div className="page-title mb-8" style={{ fontSize: "28px" }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginRight: "12px" }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
            <span>รายได้และค่าลดหย่อน</span>
          </div>

          <div className="space-y-6">
            {fieldDefs.map((f) => (
              <div key={f.key} className="form-group">
                <label>{f.label}</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="ระบุจำนวนเงิน"
                  value={f.isIncome ? annualIncome || "" : (fields as Record<string, number>)[f.key] || ""}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value) || 0;
                    if (f.isIncome) {
                      setAnnualIncome(val);
                    } else {
                      setFields((prev) => ({ ...prev, [f.key]: val }));
                    }
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-10 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">กรอกข้อมูลให้ถูกต้อง เพื่อความแม่นยำของระบบ</p>
          </div>
        </div>

        {/* Right: Result + Table */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-8">
            <div className="text-center mb-8">
              <p className="text-gray-400 text-lg mb-2">ภาษีที่ต้องชำระ (ประมาณการ)</p>
              <h3 className="text-5xl font-bold text-white mb-2">
                ฿{tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <span
                className="inline-block px-4 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: "var(--accent-green)" }}
              >
                อัตราภาษีที่แท้จริง {effectiveRate.toFixed(2)}%
              </span>
            </div>

            {/* Summary row */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <p className="text-gray-500 text-xs mb-1">รายได้สุทธิ</p>
                <p className="text-white font-bold text-lg">฿{taxableIncome.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-xs mb-1">ลดหย่อนรวม</p>
                <p className="text-white font-bold text-lg">฿{totalDeductions.toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t border-white/10 my-6" />

            {/* Tax brackets table */}
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "rgba(155, 209, 4, 0.2)" }}>
                    <th className="p-3 text-left text-[var(--accent-green)]">เงินได้สุทธิ (บาท)</th>
                    <th className="p-3 text-right text-[var(--accent-green)]">อัตราภาษี</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {taxBrackets.map((b, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3">{b.income}</td>
                      <td className="p-3 text-right">
                        {b.rate === "ยกเว้น" ? (
                          <span className="inline-block px-3 py-0.5 rounded-md text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            ได้รับการยกเว้น
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-0.5 rounded-md text-xs font-bold text-gray-300 bg-white/5 border border-white/10">
                            {b.rate}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 flex gap-2 text-yellow-500/80">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 mt-0.5"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <p className="text-[11px]">
                การคำนวณนี้เป็นการประมาณการเบื้องต้นเท่านั้น กรุณาปรึกษาผู้เชี่ยวชาญด้านภาษีเพื่อความถูกต้อง
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button className="btn-save flex-1 py-5 text-xl">คำนวณภาษี</button>
            <button
              className="btn-cancel flex-1 py-5 text-xl"
              style={{ background: "rgba(255,255,255,0.05)" }}
              onClick={handleReset}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
