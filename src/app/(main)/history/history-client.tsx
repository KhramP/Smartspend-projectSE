"use client";

import { useState } from "react";
import { Transaction } from "@/generated/prisma/client";
import { getHistoryPageData } from "@/app/actions/transaction";
import { TransactionList } from "@/app/_components/transaction-list";
import "@/app/_components/GlobalLayout.css";

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
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">ผลลัพธ์</h3>
            <span className="text-sm text-gray-400 bg-white/10 px-3 py-1 rounded-full">
              {transactions.length} รายการ
            </span>
          </div>
          <TransactionList transactions={transactions} showYear />
        </div>
      )}
    </div>
  );
}
