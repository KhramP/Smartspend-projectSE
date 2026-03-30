"use client";

import { useState } from "react";
import "../../_components/GlobalLayout.css";

interface CategoryStat {
  category: string;
  amount: number;
  count: number;
  percent: number;
  color: string;
}

interface TopExpense {
  rank: number;
  name: string;
  category: string;
  count: number;
  amount: number;
}

interface MonthlyTrendItem {
  month: string;
  expense: number;
  income: number;
}

interface Props {
  analytics: {
    avgExpensePerMonth: number;
    avgSavingPerMonth: number;
    highestSpendingMonth: string;
    savingRate: number;
  };
  categoryBreakdown: {
    categories: CategoryStat[];
    totalExpense: number;
    totalCount: number;
  };
  topExpenses: TopExpense[];
  monthlyTrend: MonthlyTrendItem[];
}

const categoryIcons: Record<string, string> = {
  อาหาร: "🍜",
  เดินทาง: "🚌",
  บันเทิง: "🎮",
  ช้อปปิ้ง: "🛍️",
  สุขภาพ: "🏥",
  การศึกษา: "📚",
  ค่าน้ำไฟ: "💡",
  อื่นๆ: "📦",
};

export default function AnalysePageClient({ analytics, categoryBreakdown, topExpenses, monthlyTrend }: Props) {
  const [trendTab, setTrendTab] = useState("รายรับ-รายจ่าย");
  const [catTab, setCatTab] = useState("ยอดรวม");
  const [topTab, setTopTab] = useState("ยอดรวม");

  // Build SVG points from real monthly trend data
  const maxVal = Math.max(...monthlyTrend.flatMap((m) => [m.expense, m.income]), 1);
  const trendPoints = monthlyTrend
    .map((m, i) => {
      const x = (i / Math.max(monthlyTrend.length - 1, 1)) * 100;
      const val = trendTab === "รายรับ" ? m.income : trendTab === "รายจ่าย" ? m.expense : m.expense + m.income;
      const y = 50 - (val / (maxVal * 2)) * 45;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold text-white mb-6">วิเคราะห์เชิงลึก</h2>

      <div className="stat-grid mb-6">
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">ค่าใช้จ่ายเฉลี่ย/เดือน</p>
          <h3 className="stat-value text-red-400">฿{analytics.avgExpensePerMonth.toLocaleString()}</h3>
        </div>
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">ออมเงินเฉลี่ย/เดือน</p>
          <h3 className="stat-value text-green-400">฿{analytics.avgSavingPerMonth.toLocaleString()}</h3>
        </div>
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">เดือนที่ใช้จ่ายสูงสุด</p>
          <h3 className="stat-value text-white">{analytics.highestSpendingMonth}</h3>
        </div>
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">อัตราออมเงิน</p>
          <h3 className="stat-value text-[var(--accent-gold)]">{analytics.savingRate}%</h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">แนวโน้มรายรับ-รายจ่าย</h3>
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              {["รายรับ-รายจ่าย", "รายจ่าย", "รายรับ"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTrendTab(tab)}
                  className={`px-4 py-1.5 text-xs ${trendTab === tab ? "bg-[var(--accent-green)] text-black font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-[250px] border-l border-b border-gray-600 relative flex items-end">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
              <polyline fill="none" stroke="var(--accent-gold)" strokeWidth="1" points={trendPoints} />
            </svg>
            <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-[10px] text-gray-500 px-1">
              {monthlyTrend.map((m) => (
                <span key={m.month}>{m.month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">สัดส่วนหมวดหมู่</h3>
              <p className="text-xs text-gray-400">6 เดือนล่าสุด</p>
            </div>
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              {["ยอดรวม", "ครั้ง"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCatTab(tab)}
                  className={`px-4 py-1.5 text-xs ${catTab === tab ? "bg-[var(--accent-green)] text-black font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-around mb-8 mt-2">
            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-gray-600 relative">
              <span className="text-xl font-semibold text-white">
                ฿{categoryBreakdown.totalExpense.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400">รายจ่ายรวม</span>
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[var(--accent-green)] border-r-[var(--accent-green)] transform rotate-45"></div>
            </div>
            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-gray-600 relative">
              <span className="text-xl font-semibold text-white">{categoryBreakdown.totalCount} ครั้ง</span>
              <span className="text-xs text-gray-400">ธุรกรรมรวม</span>
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-b-[var(--accent-gold)] border-l-[var(--accent-gold)] transform -rotate-12"></div>
            </div>
          </div>

          <div className="space-y-3">
            {categoryBreakdown.categories.map((cat, idx) => (
              <div key={idx} className="flex items-center text-sm">
                <span className="w-16 text-gray-300">{cat.category}</span>
                <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  ></div>
                </div>
                <span className="w-12 text-right text-gray-400">
                  {catTab === "ครั้ง" ? `${cat.count}x` : `${cat.percent}%`}
                </span>
                <span className="w-20 text-right font-medium text-white">
                  {catTab === "ครั้ง" ? `${cat.count} ครั้ง` : `฿${cat.amount.toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div className="glass-card p-6 min-h-[300px] flex items-center justify-center border-dashed border-gray-600">
          <span className="text-gray-500">พื้นที่สำหรับกราฟเพิ่มเติม</span>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Top รายจ่ายสูงสุด</h3>
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              {["ยอดรวม", "ครั้ง"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTopTab(tab)}
                  className={`px-4 py-1.5 text-xs ${topTab === tab ? "bg-[var(--accent-green)] text-black font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {topExpenses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">ยังไม่มีข้อมูล</p>
            ) : (
              topExpenses.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-4 bg-black/20 border border-gray-700 rounded-xl hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-gray-500 font-bold w-4">{item.rank}</div>
                    <div className="text-2xl">{categoryIcons[item.category] || "📦"}</div>
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">{item.count} ครั้ง</div>
                    <div className="font-semibold text-[var(--accent-gold)]">
                      {topTab === "ครั้ง" ? `${item.count} ครั้ง` : `฿${item.amount.toLocaleString()}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
