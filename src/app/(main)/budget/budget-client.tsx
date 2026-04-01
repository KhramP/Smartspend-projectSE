"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCategoryIcon } from "@/lib/constants";
import { AddBudgetModal } from "@/app/_components/add-budget-modal";
import "@/app/_components/GlobalLayout.css";

type BudgetPageData = {
  categorySpending: { name: string; used: number; budget: number }[];
  totalUsed: number;
  totalBudget: number;
};

export function BudgetClient({ data, userId }: { data: BudgetPageData; userId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const totalBudget = data.totalBudget > 0 ? data.totalBudget : 0;
  const remaining = totalBudget - data.totalUsed;
  const overallPercent = totalBudget > 0 ? (data.totalUsed / totalBudget) * 100 : 0;

  const handleSaved = () => {
    router.refresh();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Top row: overview + donut */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-6">
        {/* Left: overview card */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">ภาพรวมงบประมาณเดือนนี้</h3>
            <button
              className="btn-premium hover:bg-white/10 transition"
              style={{ borderRadius: "20px", padding: "5px 15px" }}
              onClick={() => setIsModalOpen(true)}
            >
              ตั้งงบใหม่
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="stat-card bg-black/20 rounded-xl p-4 text-center border border-white/5">
              <p className="text-xs text-gray-400 mb-1">งบรวม</p>
              <h4 className="text-xl font-bold">฿{Math.round(totalBudget).toLocaleString()}</h4>
            </div>
            <div className="stat-card bg-black/20 rounded-xl p-4 text-center border border-white/5">
              <p className="text-xs text-gray-400 mb-1">ใช้ไปแล้ว</p>
              <h4 className="text-xl font-bold text-red-400">฿{data.totalUsed.toLocaleString()}</h4>
            </div>
            <div className="stat-card bg-black/20 rounded-xl p-4 text-center border border-white/5">
              <p className="text-xs text-gray-400 mb-1">คงเหลือ</p>
              <h4 className="text-xl font-bold text-[var(--accent-green)]">
                ฿{Math.round(remaining).toLocaleString()}
              </h4>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>ภาพรวม {overallPercent.toFixed(1)}% ของงบทั้งหมด</span>
            </div>
            <div className="gold-progress-bar" style={{ height: "12px" }}>
              <div className="gold-progress-fill" style={{ width: `${Math.min(overallPercent, 100)}%` }}></div>
            </div>
          </div>
        </div>

        {/* Right: donut chart */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-medium text-gray-400 mb-4 self-start">สัดส่วนงบที่ใช้</h3>
          <div className="relative w-40 h-40 rounded-full border-[10px] border-gray-700 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-white">{Math.round(overallPercent)}%</span>
              <p className="text-[10px] text-gray-400">ใช้ไปแล้ว</p>
            </div>
            <div className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-[var(--accent-gold)] border-r-[var(--accent-gold)] transform rotate-45"></div>
          </div>
        </div>
      </div>

      {/* Bottom row: category budget cards */}
      {data.categorySpending.length === 0 ? (
        <p className="text-gray-500 text-center py-10">ไม่มีข้อมูลการใช้จ่ายเดือนนี้</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.categorySpending.map((b) => {
            const hasBudget = b.budget > 0;
            const icon = getCategoryIcon(b.name);
            const catBudget = b.budget > 0 ? b.budget : 0;
            const percent = catBudget > 0 ? (b.used / catBudget) * 100 : 0;
            const isOver = percent > 100;
            
            return (
              <div key={b.name} className="glass-card p-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-medium flex items-center gap-2">
                      <span>{icon}</span> {b.name}
                    </h4>
                    <p className="text-[10px] text-gray-400">{hasBudget ? "งบเดือน" : "ยังไม่ตั้งงบ"}</p>
                  </div>
                  <div className={`text-sm font-bold ${isOver || !hasBudget ? "text-red-500" : "text-[var(--accent-green)]"}`}>
                    {hasBudget ? `ใช้ไป ${percent.toFixed(0)}%` : "ยังไม่ตั้งงบ"}
                  </div>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">ใช้ไป</span>
                    <span className="text-white font-semibold">฿{b.used.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-white/5 pt-1">
                    <span className="text-gray-400">งบ</span>
                    <span className="text-gray-500">฿{Math.round(catBudget).toLocaleString()}</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isOver || !hasBudget ? "bg-red-500" : "bg-[var(--accent-gold)]"}`}
                    style={{ width: `${hasBudget ? Math.min(percent, 100) : 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        onSaved={handleSaved}
      />
    </div>
  );
}
