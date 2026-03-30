"use client";

import { useState, useTransition } from "react";
import { getTransactionsByMonths } from "../../actions/transaction";
import "../../_components/GlobalLayout.css";

interface Transaction {
  id: string;
  amount: number;
  name: string | null;
  date: string;
  type: string;
  category: string | null;
}

export default function HistoryPageClient({ userId }: { userId: string }) {
  const monthLabels = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];
  const years = [2024, 2025, 2026];
  const [selectedMonths, setSelectedMonths] = useState<Record<string, boolean>>({});
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isPending, startTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  const toggleMonth = (year: number, month: string) => {
    const key = `${year}-${month}`;
    setSelectedMonths((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    const selected = Object.entries(selectedMonths)
      .filter(([, v]) => v)
      .map(([key]) => {
        const [year, monthLabel] = key.split("-");
        return { year: parseInt(year), month: monthLabels.indexOf(monthLabel) };
      });

    if (selected.length === 0) return;

    startTransition(async () => {
      const data = await getTransactionsByMonths({ userId, months: selected });
      setTransactions(JSON.parse(JSON.stringify(data)));
      setHasSearched(true);
    });
  };

  const handleCancel = () => {
    setSelectedMonths({});
    setTransactions([]);
    setHasSearched(false);
  };

  return (
    <div className="p-10">
      <div className="glass-card p-10 min-h-[600px] flex flex-col">
        <h2 className="text-xl text-gray-400 mb-8">เลือกเดือนที่คุณต้องการ</h2>

        <div className="flex-1 space-y-12">
          {years.map((year) => (
            <div key={year}>
              <h3 className="text-4xl font-light text-gray-500 mb-6">{year}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "24px" }}>
                {monthLabels.map((month) => {
                  const isSelected = selectedMonths[`${year}-${month}`];
                  return (
                    <div
                      key={month}
                      onClick={() => toggleMonth(year, month)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-[var(--accent-green)] border-[var(--accent-green)]"
                            : "border-gray-600 group-hover:border-gray-400"
                        }`}
                      >
                        {isSelected && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                            <path d="M20 6L9 17L4 12"></path>
                          </svg>
                        )}
                      </div>
                      <span className={`text-xl ${isSelected ? "text-white" : "text-gray-400"}`}>{month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-10 mt-12">
          <button
            className="btn-save"
            disabled={isPending}
            style={{
              flex: 1,
              padding: "24px",
              fontSize: "24px",
              borderRadius: "40px",
              background: "transparent",
              border: "1px solid #666",
              color: "#fff",
            }}
            onClick={handleSearch}
          >
            {isPending ? "กำลังโหลด..." : "ส่งคำขอ"}
          </button>
          <button
            className="btn-cancel"
            style={{ flex: 1, padding: "24px", fontSize: "24px", borderRadius: "40px", border: "1px solid #666" }}
            onClick={handleCancel}
          >
            ยกเลิก
          </button>
        </div>
      </div>

      {hasSearched && (
        <div className="glass-card overflow-hidden mt-8">
          <table className="transaction-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>วันที่</th>
                <th>รายการ</th>
                <th>หมวดหมู่</th>
                <th>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "60px" }} className="text-gray-500">
                    ไม่พบรายการในเดือนที่เลือก
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString("th-TH")}</td>
                    <td>{t.name || "-"}</td>
                    <td>{t.category || "-"}</td>
                    <td className={t.type === "income" ? "text-green-400" : "text-red-400"}>
                      {t.type === "income" ? "+" : "-"}฿{t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
