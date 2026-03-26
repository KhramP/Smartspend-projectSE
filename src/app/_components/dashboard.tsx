"use client";

import { Transaction } from "@/generated/prisma/client";

export function DashBoard({ transactions }: { transactions: Transaction[] }) {
  const categories = [
    { name: "อาหาร", icon: "🍜", amount: "฿5,407" },
    { name: "เดินทาง", icon: "🚗", amount: "฿3,210" },
  ];
  // [
  //   { date: "12 Mar 2026", name: "ข้าวกลางวัน", category: "อาหาร", amount: "฿120" },
  //   { date: "11 Mar 2026", name: "ข้าวกลางวัน", category: "อาหาร", amount: "฿120" },
  // ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">DashBoard</h1>
      </div>

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-xl">
          <p className="mb-2.5 text-sm text-muted-foreground">รายรับเดือนนี้</p>
          <h3 className="text-3xl font-semibold text-foreground">$35,000</h3>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-xl">
          <p className="mb-2.5 text-sm text-muted-foreground">รายจ่ายเดือนนี้</p>
          <h3 className="text-3xl font-semibold text-foreground">$28,500</h3>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-xl">
          <p className="mb-2.5 text-sm text-muted-foreground">ยอดคงเหลือ</p>
          <h3 className="text-3xl font-semibold text-foreground">$6,500</h3>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-xl">
          <p className="mb-2.5 text-sm text-muted-foreground">หมวดหมู่ยอดนิยม</p>
          <h3 className="text-3xl font-semibold text-foreground">อาหาร</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] items-start gap-6">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {categories.map((c) => (
            <div
              key={c.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 text-left backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-4">
                <span className="text-3xl">{c.icon}</span>
                <span className="text-lg font-medium text-foreground">{c.name}</span>
              </div>
              <p className="text-2xl font-semibold text-[#ffd700]">{c.amount}</p>
              <div className="mt-3 h-2 rounded bg-gray-200">
                <div
                  className="h-full rounded bg-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 backdrop-blur-xl">
          <div className="mb-6 flex flex-wrap gap-2 sm:gap-3">
            <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#9bd104] bg-secondary px-4 py-2.5 text-sm text-foreground">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M7 13l3 3 7-9" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              ทั้งหมด
            </button>
            <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#9bd104] bg-secondary px-4 py-2.5 text-sm text-foreground">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M7 13l3 3 7-9" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              รายจ่าย
            </button>
            <button className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#9bd104] bg-secondary px-4 py-2.5 text-sm text-foreground">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M7 13l3 3 7-9" stroke="currentColor" strokeWidth="2.5" />
              </svg>
              รายรับ
            </button>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full border-collapse min-w-[480px]">
              <thead>
                <tr>
                  <th className="p-3 sm:p-4 text-left text-sm text-gray-500">วันที่</th>
                  <th className="p-3 sm:p-4 text-left text-sm text-gray-500">รายการ</th>
                  <th className="p-3 sm:p-4 text-left text-sm text-gray-500">หมวดหมู่</th>
                  <th className="p-3 sm:p-4 text-left text-sm text-gray-500">จำนวนเงิน</th>
                </tr>
              </thead>
              <tbody>
                {!transactions ? (
                  <tr>
                    <td colSpan={4} className="p-3 sm:p-4 text-sm text-foreground">
                      กำลังโหลด...
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, index) => (
                    <tr key={index}>
                      {/* Thai date format */}
                      <td className="p-3 sm:p-4 text-sm text-foreground">
                        {new Date(t.date).toLocaleDateString("th-TH")}
                      </td>
                      <td className="p-3 sm:p-4 text-sm text-foreground">{t.name}</td>
                      <td className="p-3 sm:p-4 text-sm text-foreground">{t.category}</td>
                      <td className="p-3 sm:p-4 text-sm text-foreground">{t.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
