"use client";

import { useState } from "react";
import "../../_components/GlobalLayout.css";

const taxBrackets = [
  { income: "1 - 150,000", range: "150,000", rate: "ได้รับการยกเว้น" },
  { income: "150,001 - 300,000", range: "150,000", rate: "5" },
  { income: "300,001 - 500,000", range: "200,000", rate: "10" },
  { income: "500,001 - 750,000", range: "250,000", rate: "15" },
  { income: "750,001 - 1,000,000", range: "250,000", rate: "20" },
  { income: "1,000,001 - 2,000,000", range: "1,000,000", rate: "25" },
  { income: "2,000,001 - 5,000,000", range: "3,000,000", rate: "30" },
  { income: "5,000,001 บาทขึ้นไป", range: "-", rate: "35" },
];

function calculateThaiTax(netIncome: number) {
  const brackets = [
    { limit: 150000, rate: 0 },
    { limit: 300000, rate: 0.05 },
    { limit: 500000, rate: 0.1 },
    { limit: 750000, rate: 0.15 },
    { limit: 1000000, rate: 0.2 },
    { limit: 2000000, rate: 0.25 },
    { limit: 5000000, rate: 0.3 },
    { limit: Infinity, rate: 0.35 },
  ];

  let tax = 0;
  let prev = 0;
  for (const bracket of brackets) {
    if (netIncome <= prev) break;
    const taxable = Math.min(netIncome, bracket.limit) - prev;
    tax += taxable * bracket.rate;
    prev = bracket.limit;
  }
  return tax;
}

export default function TaxPageClient({ totalIncome }: { totalIncome: number }) {
  const [personalDeduction, setPersonalDeduction] = useState(60000);
  const [insurance, setInsurance] = useState(0);
  const [fund, setFund] = useState(0);
  const [homeLoan, setHomeLoan] = useState(0);
  const [donation, setDonation] = useState(0);
  const [taxResult, setTaxResult] = useState<{ amount: number; rate: number } | null>(null);

  const handleCalculate = () => {
    const totalDeductions = personalDeduction + insurance + fund + homeLoan + donation;
    const netIncome = Math.max(totalIncome - totalDeductions, 0);
    const tax = calculateThaiTax(netIncome);
    const effectiveRate = totalIncome > 0 ? (tax / totalIncome) * 100 : 0;
    setTaxResult({ amount: tax, rate: Math.round(effectiveRate * 100) / 100 });
  };

  const handleReset = () => {
    setPersonalDeduction(60000);
    setInsurance(0);
    setFund(0);
    setHomeLoan(0);
    setDonation(0);
    setTaxResult(null);
  };

  return (
    <div className="p-10">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            <span>ค่าลดหย่อนส่วนตัว</span>
          </div>

          <div className="mb-4 p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-gray-400">รายได้รวมทั้งปี (จากระบบ)</p>
            <p className="text-2xl font-bold text-white">฿{totalIncome.toLocaleString()}</p>
          </div>

          <div className="space-y-6">
            <div className="form-group">
              <label>ค่าลดหย่อนส่วนตัว</label>
              <input
                type="number"
                className="form-input"
                value={personalDeduction}
                onChange={(e) => setPersonalDeduction(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>เบี้ยประกันชีวิต</label>
              <input
                type="number"
                className="form-input"
                placeholder="ระบุจำนวนเงิน"
                value={insurance}
                onChange={(e) => setInsurance(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>กองทุน SSF/RMF (บาท)</label>
              <input
                type="number"
                className="form-input"
                placeholder="ระบุจำนวนเงิน"
                value={fund}
                onChange={(e) => setFund(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>ดอกเบี้ยบ้าน (บาท)</label>
              <input
                type="number"
                className="form-input"
                placeholder="ระบุจำนวนเงิน"
                value={homeLoan}
                onChange={(e) => setHomeLoan(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>เงินบริจาค (บาท)</label>
              <input
                type="number"
                className="form-input"
                placeholder="ระบุจำนวนเงิน"
                value={donation}
                onChange={(e) => setDonation(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-10 pt-4 border-t border-white/10 text-center">
            <p className="text-xs text-gray-500">กรอกข้อมูลให้ถูกต้อง เพื่อความแม่นยำของระบบ</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-card p-8 flex-1">
            <div className="text-center mb-8">
              <p className="text-gray-400 text-lg mb-2">ภาษีที่ต้องชำระ (ประมาณการ)</p>
              <h3 className="text-5xl font-bold text-white mb-2">
                ฿
                {taxResult
                  ? taxResult.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : "0.00"}
              </h3>
              <p className="text-gray-400">
                อัตราภาษีที่แท้จริง {taxResult ? taxResult.rate.toFixed(2) : "0.00"}% ของรายได้
              </p>
            </div>

            <div className="border-t border-white/10 my-8"></div>

            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ background: "rgba(155, 209, 4, 0.2)" }}>
                    <th className="p-3 text-left text-[var(--accent-green)]">เงินได้สุทธิ (บาท)</th>
                    <th className="p-3 text-left text-[var(--accent-green)]">ช่วงเงินได้สุทธิ</th>
                    <th className="p-3 text-right text-[var(--accent-green)]">อัตราภาษี (ร้อยละ)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  {taxBrackets.map((item, idx) => (
                    <tr key={idx} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-3">{item.income}</td>
                      <td className="p-3">{item.range}</td>
                      <td className="p-3 text-right">{item.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <p className="text-[11px]">
                การคำนวณนี้เป็นการประมาณการเบื้องต้นเท่านั้น กรุณาปรึกษาผู้เชี่ยวชาญด้านภาษีเพื่อความถูกต้อง
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              className="btn-save"
              style={{ flex: 1, padding: "20px", fontSize: "20px" }}
              onClick={handleCalculate}
            >
              คำนวณภาษี
            </button>
            <button
              className="btn-cancel"
              style={{ flex: 1, padding: "20px", fontSize: "20px", background: "rgba(255,255,255,0.05)" }}
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
