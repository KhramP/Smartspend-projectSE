"use client";

import { Transaction } from "@/generated/prisma/client";
import { useState } from "react";
import "@/app/_components/GlobalLayout.css";

export function TransactionClient({
  data,
}: {
  data: {
    transactions: Transaction[];
    stats: {
      monthlyExpense: number;
      monthlyIncome: number;
      avgPerDay: number;
      transactionCount: number;
    };
  };
}) {
  const [filter, setFilter] = useState<"ทั้งหมด" | "รายจ่าย" | "รายรับ">("ทั้งหมด");
  const [search, setSearch] = useState("");

  const stats = [
    { label: "รายจ่ายเดือนนี้", value: `฿${data.stats.monthlyExpense.toLocaleString()}` },
    { label: "รายได้เดือนนี้", value: `฿${data.stats.monthlyIncome.toLocaleString()}` },
    { label: "เฉลี่ยต่อวัน", value: `฿${data.stats.avgPerDay.toLocaleString()}` },
    { label: "จำนวนรายการ", value: `${data.stats.transactionCount}` },
  ];

  const filteredTransactions = data.transactions.filter((tx) => {
    if (filter === "รายจ่าย" && tx.type !== "expense") return false;
    if (filter === "รายรับ" && tx.type !== "income") return false;
    if (search && !(tx.name || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 text-center">
            <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
            <h3 className="text-xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filter Tools */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 lg:mb-8 items-stretch sm:items-center">
        {/* Search */}
        <div className="glass-card flex items-center px-4 py-1 flex-1 min-w-0 sm:min-w-[250px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อรายการ..."
            className="bg-transparent border-none outline-none text-white w-full py-2"
          />
          <button className="text-[var(--accent-green)] font-medium px-4 border-l border-white/10 ml-2">ค้นหา</button>
        </div>

        {/* Type filter buttons */}
        <div className="flex gap-2">
          {(["ทั้งหมด", "รายจ่าย", "รายรับ"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`btn-premium transition-all ${
                filter === type ? "!bg-white/10 !border-white/40 text-white" : ""
              }`}
              style={{ background: "transparent", borderColor: filter === type ? "rgba(255,255,255,0.4)" : "#444" }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="glass-card overflow-x-auto">
        <table className="transaction-table min-w-[500px]" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>วันที่</th>
              <th>รายการ</th>
              <th>หมวดหมู่</th>
              <th style={{ textAlign: "right" }}>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "60px" }} className="text-gray-500">
                  ไม่พบรายการ
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx, i) => (
                <tr key={tx.id || i} className="hover:bg-white/5 transition-colors">
                  <td className="text-gray-400 text-sm">
                    {new Date(tx.date).toLocaleDateString("th-TH", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="font-semibold">{tx.name}</td>
                  <td>
                    <span className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-lg">{tx.category}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span
                      className="font-extrabold text-base"
                      style={{ color: tx.type === "income" ? "#10b981" : "#ef4444" }}
                    >
                      {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                    </span>
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
