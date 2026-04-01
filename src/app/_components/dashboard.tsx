"use client";

import { Transaction } from "@/generated/prisma/client";
import { useState } from "react";
import "@/app/_components/GlobalLayout.css";

export function DashBoard({
  transactions,
  data,
  budgets,
}: {
  transactions: Transaction[];
  data: {
    thisMonthIncome: number;
    thisMonthExpense: number;
    balance: number;
    todayExpense: number;
    eachCategorySpendingThisMonth: { category: string; amount: number }[];
  };
  budgets: { id: string; userId: string; category: string; amount: number }[];
}) {
  const [period, setPeriod] = useState("1 เดือน");

  // Derive category stats from real data
  const totalExpense = data.eachCategorySpendingThisMonth.reduce((sum, c) => sum + c.amount, 0);
  const categoryColors = ["#9bd104ff", "#ffd700", "#4CAF50", "#2196F3", "#e91e63", "#ff9800", "#9c27b0", "#00bcd4"];
  const categoryStats = data.eachCategorySpendingThisMonth.map((cat, idx) => ({
    name: cat.category,
    percent: totalExpense > 0 ? Math.round((cat.amount / totalExpense) * 100) : 0,
    amount: `฿${cat.amount.toLocaleString()}`,
    color: categoryColors[idx % categoryColors.length],
  }));

  // Budget data from real database budgets
  const budgetMap = new Map(budgets.map((b) => [b.category, b.amount]));
  const spendingMap = new Map(data.eachCategorySpendingThisMonth.map((c) => [c.category, c.amount]));
  const budgetData = budgets
    .filter((b) => b.amount > 0)
    .slice(0, 3)
    .map((b) => ({
      name: b.category,
      used: spendingMap.get(b.category) || 0,
      total: b.amount,
    }));

  // Build chart data from transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Group transactions by week for 1-month view
  const monthTransactions = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const weekLabels = ["สัปดาห์ 1", "สัปดาห์ 2", "สัปดาห์ 3", "สัปดาห์ 4"];
  const data1Month = weekLabels.map((label, weekIdx) => {
    const weekTxns = monthTransactions.filter((t) => {
      const day = new Date(t.date).getDate();
      return Math.ceil(day / 7) - 1 === weekIdx;
    });
    return {
      label,
      income: weekTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expense: weekTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  // 7-day view
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const thDayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
  const data7Days = Array.from({ length: 7 }, (_, i) => {
    const targetDate = new Date(sevenDaysAgo);
    targetDate.setDate(targetDate.getDate() + i);
    const label = thDayNames[targetDate.getDay()];
    const dayTxns = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.toDateString() === targetDate.toDateString();
    });
    return {
      label,
      income: dayTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expense: dayTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  // 1-year view
  const monthNames = [
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
  const data1Year = monthNames.map((label, monthIdx) => {
    const monthTxns = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === monthIdx && d.getFullYear() === currentYear;
    });
    return {
      label,
      income: monthTxns.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
      expense: monthTxns.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
    };
  });

  let currentChartData = data1Month;
  let maxVal = 15000;

  if (period === "7 วัน") {
    currentChartData = data7Days;
    maxVal = Math.max(...data7Days.flatMap((d) => [d.income, d.expense]), 1000);
  } else if (period === "1 เดือน") {
    currentChartData = data1Month;
    maxVal = Math.max(...data1Month.flatMap((d) => [d.income, d.expense]), 1000);
  } else if (period === "1 ปี") {
    currentChartData = data1Year;
    maxVal = Math.max(...data1Year.flatMap((d) => [d.income, d.expense]), 1000);
  }

  // Round maxVal up for nicer scale
  maxVal = Math.ceil(maxVal / 1000) * 1000;

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* แถวที่ 1: การ์ดสถิติ 4 ใบ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6">
        <div className="stat-card glass-card text-center">
          <p className="stat-label text-[var(--text-muted)]">รายรับเดือนนี้</p>
          <h3 className="stat-value text-[var(--text-primary)] text-3xl mt-2">
            ฿{data.thisMonthIncome.toLocaleString()}
          </h3>
        </div>
        <div className="stat-card glass-card text-center">
          <p className="stat-label text-[var(--text-muted)]">รายจ่ายเดือนนี้</p>
          <h3 className="stat-value text-[var(--text-primary)] text-3xl mt-2">
            ฿{data.thisMonthExpense.toLocaleString()}
          </h3>
        </div>
        <div className="stat-card glass-card text-center">
          <p className="stat-label text-[var(--text-muted)]">คงเหลือ(รายรับ - รายจ่าย)</p>
          <h3 className="stat-value text-[var(--text-primary)] text-3xl mt-2">฿{data.balance.toLocaleString()}</h3>
        </div>
        <div className="stat-card glass-card text-center">
          <p className="stat-label text-[var(--text-muted)]">รายจ่ายวันนี้</p>
          <h3 className="stat-value text-[var(--text-primary)] text-3xl mt-2">฿{data.todayExpense.toLocaleString()}</h3>
        </div>
      </div>

      {/* แถวที่ 2: กราฟแท่ง และ สัดส่วนหมวดหมู่ */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        {/* กราฟแท่ง (สรุปรายรับ-รายจ่าย) */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">สรุปรายรับ-รายจ่าย</h3>
            <div className="flex border border-[var(--glass-border)] rounded-lg overflow-hidden bg-[var(--input-bg)]">
              {["7 วัน", "1 เดือน", "1 ปี"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setPeriod(tab)}
                  className={`px-4 py-1.5 text-xs transition ${period === tab ? "bg-[var(--menu-active-bg)] text-[var(--menu-active-text)] font-medium" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[250px] flex items-end justify-between pl-14 pr-2 pt-4 border-b border-[var(--glass-border)] relative pb-6 mt-4">
            <div className="absolute left-14 right-0 bottom-6 top-4 flex flex-col justify-between pointer-events-none z-0">
              {[1, 0.75, 0.5, 0.25].map((multiplier, idx) => (
                <div key={idx} className="border-t border-dashed border-[var(--glass-border)] w-full relative">
                  <span className="absolute -left-14 -top-2.5 text-[10px] text-[var(--text-muted)] w-12 text-right pr-2">
                    {(maxVal * multiplier).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {currentChartData.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end w-full group z-10">
                <div className="flex items-end gap-1.5 w-full justify-center h-full">
                  <div
                    style={{ height: `${(item.income / maxVal) * 100}%` }}
                    className="w-1/3 max-w-[14px] bg-green-500 rounded-t-sm shadow-[0_0_8px_rgba(34,197,94,0.3)] transition-all duration-300 group-hover:bg-green-400"
                    title={`รายรับ: ฿${item.income.toLocaleString()}`}
                  ></div>
                  <div
                    style={{ height: `${(item.expense / maxVal) * 100}%` }}
                    className="w-1/3 max-w-[14px] bg-red-500 rounded-t-sm shadow-[0_0_8px_rgba(239,68,68,0.3)] transition-all duration-300 group-hover:bg-red-400"
                    title={`รายจ่าย: ฿${item.expense.toLocaleString()}`}
                  ></div>
                </div>
                <span className="text-xs text-[var(--text-muted)] absolute bottom-1">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span className="text-xs text-[var(--text-muted)]">รายรับ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span className="text-xs text-[var(--text-muted)]">รายจ่าย</span>
            </div>
          </div>
        </div>

        {/* สัดส่วนค่าใช้จ่าย */}
        <div className="glass-card p-6 flex flex-col">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-lg font-medium text-[var(--text-primary)]">สัดส่วนค่าใช้จ่าย</h3>
            <p className="text-xs text-[var(--text-muted)]">{period}</p>
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-[var(--glass-border)] relative mb-8">
              <span className="text-2xl font-semibold text-[var(--text-primary)]">
                ฿{totalExpense.toLocaleString()}
              </span>
              <span className="text-[11px] text-[var(--text-muted)]">รายจ่ายรวม</span>
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[var(--accent-green)] border-r-[var(--accent-green)] transform rotate-45"></div>
            </div>

            <div className="space-y-4 w-full px-2">
              {categoryStats.map((cat, idx) => (
                <div key={idx} className="text-sm">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[var(--text-secondary)] font-medium">{cat.name}</span>
                    <span className="text-right text-[var(--text-primary)]">
                      {cat.amount} <span className="text-[var(--text-muted)] text-xs ml-1">({cat.percent}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bar-bg)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* แถวที่ 3: งบประมาณเดือนนี้ และ รายการล่าสุด */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ช่องงบประมาณเดือนนี้ */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">งบประมาณเดือนนี้</h3>
          </div>
          <div className="space-y-6">
            {budgetData.map((budget) => (
              <div key={budget.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[var(--text-secondary)]">{budget.name}</span>
                  <span className={budget.used > budget.total ? "text-red-400" : "text-[var(--text-muted)]"}>
                    ฿{budget.used.toLocaleString()} / {budget.total.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-3 bg-[var(--bar-bg)] border border-[var(--glass-border)] rounded-sm overflow-hidden">
                  <div
                    className={`h-full ${budget.used > budget.total ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-[var(--accent-gold)] shadow-[0_0_10px_rgba(255,215,0,0.5)]"}`}
                    style={{ width: `${Math.min((budget.used / budget.total) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ช่องรายการล่าสุด */}
        <div className="glass-card p-0 overflow-hidden flex flex-col">
          <div className="p-6 pb-4">
            <h3 className="text-lg font-medium text-[var(--text-secondary)]">รายการล่าสุด</h3>
          </div>

          <div className="flex-1 border-t border-[var(--glass-border)]">
            {transactions.slice(0, 5).map((tx, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-4 border-b border-[var(--glass-border)] bg-[var(--hover-bg)] hover:brightness-95 transition"
              >
                <div>
                  <div className="text-[var(--text-primary)] text-sm">{tx.name}</div>
                  <div className="text-[var(--text-muted)] text-xs">{tx.category}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm ${tx.type === "income" ? "text-green-500" : "text-[var(--text-secondary)]"}`}
                  >
                    {tx.type === "expense" ? "-" : "+"}฿{tx.amount.toLocaleString()}
                  </div>
                  <div className="text-[var(--text-muted)] text-xs">
                    {new Date(tx.date).toLocaleDateString("th-TH", { day: "2-digit", month: "short" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
