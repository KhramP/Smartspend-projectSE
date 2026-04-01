"use client";

import { getCategoryIcon } from "@/lib/constants";
import "@/app/_components/GlobalLayout.css";

type CategoryPageData = {
  categories: { name: string; count: number; amount: number; percent: number }[];
  totalCategories: number;
  totalTransactions: number;
  totalAmount: number;
};

export function CategoryClient({ data }: { data: CategoryPageData }) {
  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8">
        {[
          { label: "หมวดหมู่ทั้งหมด", value: String(data.totalCategories), color: "text-[var(--accent-green)]" },
          { label: "รายการรวมเดือนนี้", value: String(data.totalTransactions), color: "text-sky-400" },
          { label: "ยอดรวมทุกหมวดหมู่", value: `฿${data.totalAmount.toLocaleString()}`, color: "text-violet-400" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-6 flex items-center gap-5">
            <div
              className={`w-1.5 h-10 rounded-full ${
                s.color === "text-[var(--accent-green)]"
                  ? "bg-[var(--accent-green)]"
                  : s.color === "text-sky-400"
                    ? "bg-sky-400"
                    : "bg-violet-400"
              }`}
            />
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">{s.label}</p>
              <p className={`text-2xl font-extrabold text-white`}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {data.categories.map((cat) => {
          const icon = getCategoryIcon(cat.name);
          return (
            <div
              key={cat.name}
              className="category-card glass-card hover:-translate-y-1 hover:border-white/20 transition-all duration-200 cursor-pointer"
              style={{ padding: "24px" }}
            >
              <div className="category-header">
                <span className="category-icon" style={{ fontSize: "24px" }}>
                  {icon}
                </span>
                <div>
                  <span className="category-title block text-lg">{cat.name}</span>
                  <span className="text-xs text-[var(--muted-text)]">{cat.count} รายการ</span>
                </div>
              </div>
              <p className="category-amount mt-2.5">฿{cat.amount.toLocaleString()}</p>
              <div className="mt-3">
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-400 text-xs">สัดส่วนการใช้จ่าย</span>
                  <span className="text-[var(--accent-gold)] text-xs font-bold">{cat.percent}%</span>
                </div>
                <div className="gold-progress-bar">
                  <div className="gold-progress-fill" style={{ width: `${cat.percent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
