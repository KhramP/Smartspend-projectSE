"use client";

import { useState } from "react";
import { Transaction } from "@/generated/prisma/client";
import { getHistoryPageData } from "@/app/actions/transaction";
import { TransactionList } from "@/app/_components/transaction-list";
import "@/app/_components/GlobalLayout.css";
import { pdf } from "@react-pdf/renderer";
import { HistoryPDFDocument } from "@/app/_components/history-pdf";

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

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const formatDate = (tx: Transaction, includeYear = true) =>
    new Date(tx.date).toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      ...(includeYear && { year: "numeric" }),
    });

  const downloadCSV = () => {
    const header = "วันที่,ชื่อรายการ,หมวดหมู่,ประเภท,จำนวนเงิน (฿)\n";
    const rows = transactions
      .map((tx) => {
        const date = formatDate(tx);
        const name = `"${(tx.name ?? "").replace(/"/g, '""')}"`;
        const category = tx.category ?? "";
        const type = tx.type === "income" ? "รายรับ" : "รายจ่าย";
        const amount = tx.amount.toFixed(2);
        return `${date},${name},${category},${type},${amount}`;
      })
      .join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smartspend-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    const blob = await pdf(<HistoryPDFDocument transactions={transactions} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smartspend-history-${new Date().toISOString().slice(0, 10)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">ประวัติ</h1>
        <p className="text-gray-400">เลือกช่วงเวลาที่ต้องการตรวจสอบรายการย้อนหลัง</p>
      </div>

      {/* Month Selection Card */}
      <div className="glass-card p-6 sm:p-8 lg:p-10 flex flex-col">
        <h2 className="text-xl text-gray-400 mb-8">เลือกเดือนที่คุณต้องการ</h2>

        <div className="flex-1 space-y-12">
          {years.map((year) => (
            <div key={year}>
              <h3 className="text-4xl font-light text-gray-500 mb-6">{year}</h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 lg:gap-6">
                {months.map((m) => {
                  const key = `${year}-${m}`;
                  const isOn = !!selected[key];
                  return (
                    <div
                      key={m}
                      onClick={() => toggle(year, m)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                          isOn
                            ? "bg-[var(--accent-green)] border-[var(--accent-green)]"
                            : "border-gray-600 group-hover:border-gray-400"
                        }`}
                      >
                        {isOn && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                            <path d="M20 6L9 17L4 12" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xl ${isOn ? "text-white" : "text-gray-400"}`}>{m}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-white/10">
          <button
            onClick={handleSearch}
            disabled={selectedCount === 0 || loading}
            className={`flex-[2] py-4 lg:py-5 rounded-full text-base lg:text-lg font-semibold transition-all ${
              selectedCount > 0 && !loading
                ? "bg-[var(--accent-green)] text-black hover:brightness-110 cursor-pointer"
                : "bg-white/10 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "กำลังโหลด..." : `ดูประวัติการใช้จ่าย (${selectedCount} เดือน)`}
          </button>
          <button
            onClick={() => {
              setSelected({});
              setTransactions([]);
            }}
            className="flex-1 py-4 lg:py-5 rounded-full text-base lg:text-lg font-medium border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all cursor-pointer bg-transparent"
          >
            ล้างทั้งหมด
          </button>
        </div>
      </div>

      {/* Results */}
      {transactions.length > 0 && (
        <div className="glass-card p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-white">ผลลัพธ์</h3>
              <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
                {transactions.length} รายการ
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                CSV
              </button>
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                PDF
              </button>
            </div>
          </div>
          <TransactionList transactions={transactions} showYear />
        </div>
      )}
    </div>
  );
}
