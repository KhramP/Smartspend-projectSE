// Component Composition Pattern: Reusable transaction list row
// Eliminates duplicate transaction rendering across pages

import { Transaction } from "@/generated/prisma/client";

export function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[100px_1fr_120px_120px] items-center py-3 sm:py-4 border-b border-white/5 gap-2 sm:gap-4">
      <span className="text-gray-400 text-xs sm:text-sm">
        {new Date(tx.date).toLocaleDateString("th-TH", { day: "2-digit", month: "short" })}
      </span>
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="font-semibold text-white text-sm truncate">{tx.name}</span>
      </div>
      <span className="hidden sm:inline text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-lg w-fit">
        {tx.category}
      </span>
      <span
        className="text-right text-sm sm:text-base font-bold"
        style={{ color: tx.type === "income" ? "#10b981" : "#ef4444" }}
      >
        {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
      </span>
    </div>
  );
}

export function TransactionList({
  transactions,
  showYear = false,
}: {
  transactions: Transaction[];
  showYear?: boolean;
}) {
  if (transactions.length === 0) {
    return <p className="text-gray-500 text-center py-10">ไม่พบรายการ</p>;
  }

  return (
    <div className="flex flex-col">
      {transactions.map((tx, i) => (
        <div
          key={tx.id || i}
          className="grid grid-cols-[80px_1fr_auto] sm:grid-cols-[100px_1fr_120px_120px] items-center py-3 sm:py-4 border-b border-white/5 gap-2 sm:gap-4 hover:bg-white/5 transition-colors"
        >
          <span className="text-gray-400 text-xs sm:text-sm">
            {new Date(tx.date).toLocaleDateString("th-TH", {
              day: "2-digit",
              month: "short",
              ...(showYear && { year: "numeric" }),
            })}
          </span>
          <span className="font-semibold text-white text-sm truncate">{tx.name}</span>
          <span className="hidden sm:inline text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-lg w-fit">
            {tx.category}
          </span>
          <span
            className="text-right text-sm sm:text-base font-bold"
            style={{ color: tx.type === "income" ? "#10b981" : "#ef4444" }}
          >
            {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
