"use client";

import { useState } from "react";
import "../../_components/GlobalLayout.css";

interface Transaction {
  id: string;
  amount: number;
  name: string | null;
  note: string | null;
  date: string;
  type: string;
  category: string | null;
}

interface Stats {
  thisMonthExpense: number;
  thisMonthIncome: number;
  averagePerDay: number;
  transactionCount: number;
}

interface Props {
  initialTransactions: Transaction[];
  stats: Stats;
  userId: string;
}

export default function TransactionPageClient({ initialTransactions, stats }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = initialTransactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false;
    if (search && !t.name?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statCards = [
    { label: "รายจ่ายเดือนนี้", value: `฿${stats.thisMonthExpense.toLocaleString()}` },
    { label: "รายได้เดือนนี้", value: `฿${stats.thisMonthIncome.toLocaleString()}` },
    { label: "เฉลี่ยต่อวัน", value: `฿${stats.averagePerDay.toLocaleString()}` },
    { label: "จำนวนรายการ", value: stats.transactionCount.toString() },
  ];

  return (
    <div className="p-10">
      <div className="grid grid-cols-4 gap-6 mb-10">
        {statCards.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 text-center">
            <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
            <h3 className="text-xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="glass-card flex items-center px-4 py-1" style={{ flex: 1, minWidth: "300px" }}>
          <input
            type="text"
            placeholder="ค้นหาชื่อรายการ..."
            className="bg-transparent border-none outline-none text-white w-full py-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="text-[var(--accent-green)] font-medium px-4 border-l border-white/10 ml-2">ค้นหา</button>
        </div>

        <div className="flex gap-2">
          {[
            { label: "ทั้งหมด", value: "all" },
            { label: "รายจ่าย", value: "expense" },
            { label: "รายรับ", value: "income" },
          ].map((type) => (
            <button
              key={type.value}
              onClick={() => setTypeFilter(type.value)}
              className="btn-premium"
              style={{
                background: typeFilter === type.value ? "var(--accent-green)" : "transparent",
                borderColor: typeFilter === type.value ? "var(--accent-green)" : "#444",
                color: typeFilter === type.value ? "#000" : "#fff",
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "100px" }} className="text-gray-500">
                  ยังไม่มีข้อมูลรายการ
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
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
    </div>
  );
}
