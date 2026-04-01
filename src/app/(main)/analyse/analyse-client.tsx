"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CATEGORY_COLORS, CATEGORY_ICONS, INCOME_CATEGORIES } from "@/lib/constants/categories";
import "@/app/_components/GlobalLayout.css";

type AnalyseData = {
  monthlyData: { month: string; income: number; expense: number }[];
  categoryStats: { name: string; amount: number; percent: number }[];
  statCards: { avgMonthlyExpense: number; avgMonthlySaving: number; highestMonth: string; savingRate: number };
  topExpenses: { rank: number; name: string; category: string; count: number; amount: number }[];
};

const COLORS = ["#9bd104", "#ffd700", "#4CAF50", "#2196F3", "#8b5cf6", "#f43f5e", "#f59e0b", "#71717a"];

export function AnalyseClient({ data }: { data: AnalyseData }) {
  const [trendTab, setTrendTab] = useState("รายรับ-รายจ่าย");

  const incomeNames = new Set(INCOME_CATEGORIES.map((c) => c.name));
  const expenseOnlyStats = data.categoryStats.filter((c) => !incomeNames.has(c.name));
  const sortedCategoryStats = [...expenseOnlyStats].sort((a, b) => b.amount - a.amount);
  const totalExpense6m = expenseOnlyStats.reduce((s, c) => s + c.amount, 0);
  const totalTransactions6m = data.topExpenses.reduce((s, t) => s + t.count, 0);
  const topCategory = sortedCategoryStats[0];

  // Chart configs for shadcn
  const trendChartConfig = {
    income: { label: "รายรับ", color: "#10b981" },
    expense: { label: "รายจ่าย", color: "#ef4444" },
  };

  const pieData = expenseOnlyStats.map((c, i) => ({
    name: c.name,
    value: c.amount,
    fill: CATEGORY_COLORS[c.name] || COLORS[i % COLORS.length],
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-6">
        <div className="glass-card text-center py-6 lg:py-8 px-4">
          <p className="stat-label">ค่าใช้จ่ายเฉลี่ย/เดือน</p>
          <h3 className="text-xl lg:text-3xl font-semibold text-red-400">
            ฿{data.statCards.avgMonthlyExpense.toLocaleString()}
          </h3>
        </div>
        <div className="glass-card text-center py-6 lg:py-8 px-4">
          <p className="stat-label">ออมเงินเฉลี่ย/เดือน</p>
          <h3 className="text-xl lg:text-3xl font-semibold text-green-400">
            ฿{data.statCards.avgMonthlySaving.toLocaleString()}
          </h3>
        </div>
        <div className="glass-card text-center py-6 lg:py-8 px-4">
          <p className="stat-label">เดือนที่ใช้จ่ายสูงสุด</p>
          <h3 className="text-xl lg:text-3xl font-semibold text-white">{data.statCards.highestMonth}</h3>
        </div>
        <div className="glass-card text-center py-6 lg:py-8 px-4">
          <p className="stat-label">อัตราออมเงิน</p>
          <h3 className="text-xl lg:text-3xl font-semibold text-[var(--accent-gold)]">{data.statCards.savingRate}%</h3>
        </div>
      </div>

      {/* Row 2: Trend Chart + Category Proportions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Trend Chart (shadcn) */}
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
          <div className="flex-1 min-h-[250px]">
            {data.monthlyData.length > 0 ? (
              <ChartContainer config={trendChartConfig} className="h-[250px] w-full">
                <BarChart data={data.monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  {(trendTab === "รายรับ-รายจ่าย" || trendTab === "รายรับ") && (
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                  )}
                  {(trendTab === "รายรับ-รายจ่าย" || trendTab === "รายจ่าย") && (
                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  )}
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">ไม่มีข้อมูล</div>
            )}
          </div>
        </div>

        {/* Right: Category Proportions */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">สัดส่วนหมวดหมู่</h3>
              <p className="text-xs text-gray-400">6 เดือนล่าสุด</p>
            </div>
          </div>

          {/* Donut summary circles */}
          <div className="flex justify-around mb-8 mt-2">
            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-gray-600 relative">
              <span className="text-xl font-semibold text-white">฿{totalExpense6m.toLocaleString()}</span>
              <span className="text-xs text-gray-400">รายจ่ายรวม</span>
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[var(--accent-green)] border-r-[var(--accent-green)] transform rotate-45"></div>
            </div>
            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-gray-600 relative">
              <span className="text-xl font-semibold text-white">{totalTransactions6m} ครั้ง</span>
              <span className="text-xs text-gray-400">ธุรกรรมรวม</span>
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-b-[var(--accent-gold)] border-l-[var(--accent-gold)] transform -rotate-12"></div>
            </div>
          </div>

          {/* Category progress bars */}
          <div className="space-y-3">
            {expenseOnlyStats.length === 0 ? (
              <p className="text-center text-gray-500">ไม่มีข้อมูล</p>
            ) : (
              expenseOnlyStats.map((cat, idx) => (
                <div key={cat.name} className="flex items-center text-sm">
                  <span className="w-16 text-gray-300">{cat.name}</span>
                  <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percent}%`,
                        backgroundColor: CATEGORY_COLORS[cat.name] || COLORS[idx % COLORS.length],
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-gray-400">{cat.percent}%</span>
                  <span className="w-20 text-right font-medium text-white">฿{cat.amount.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Pie Chart + Top Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pie Chart (shadcn) */}
        <div className="glass-card p-6 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-medium text-white mb-2">💡 Insight</h3>
          {expenseOnlyStats.length > 0 ? (
            <>
              <p className="text-sm text-gray-400 mb-4">
                คุณใช้จ่ายกับหมวด <span className="font-bold text-white">{topCategory.name}</span> มากที่สุด คิดเป็น{" "}
                {topCategory.percent}% ของค่าใช้จ่ายทั้งหมด
              </p>
              <div className="flex-1 min-h-[200px]">
                <ChartContainer
                  config={Object.fromEntries(
                    expenseOnlyStats.map((c, i) => [
                      c.name,
                      { label: c.name, color: CATEGORY_COLORS[c.name] || COLORS[i % COLORS.length] },
                    ]),
                  )}
                  className="h-[200px] w-full"
                >
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              เริ่มเพิ่มรายการเพื่อดูข้อมูลวิเคราะห์ของคุณ
            </div>
          )}
        </div>

        {/* Right: Top Expenses */}
        <div className="glass-card p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white">Top รายรับ/รายจ่ายสูงสุด</h3>
          </div>

          <div className="space-y-4">
            {data.topExpenses.length === 0 ? (
              <p className="text-center text-gray-500 py-5">ไม่มีข้อมูล</p>
            ) : (
              data.topExpenses.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-4 bg-black/20 border border-gray-700 rounded-xl hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-gray-500 font-bold w-4">{item.rank}</div>
                    <div className="text-2xl">{CATEGORY_ICONS[item.category] || "📦"}</div>
                    <div>
                      <div className="font-medium text-white">{item.name}</div>
                      <div className="text-xs text-gray-400">{item.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">{item.count} ครั้ง</div>
                    <div className="font-semibold text-[var(--accent-gold)]">฿{item.amount.toLocaleString()}</div>
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
