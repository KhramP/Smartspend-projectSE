// Component Composition Pattern: Reusable transaction list row
// Eliminates duplicate transaction rendering across pages

import { Transaction } from "@/generated/prisma/client";
import { UI_COLORS } from "@/lib/constants";

export function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 1fr 140px 120px",
        padding: "16px 0",
        borderBottom: `1px solid ${UI_COLORS.BG}`,
        alignItems: "center",
      }}
    >
      <span style={{ color: UI_COLORS.TEXT_SUB, fontSize: "13px" }}>
        {new Date(tx.date).toLocaleDateString("th-TH", { day: "2-digit", month: "short" })}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <span style={{ fontWeight: 600 }}>{tx.name}</span>
      </div>
      <span
        style={{
          color: UI_COLORS.TEXT_SUB,
          fontSize: "12px",
          background: UI_COLORS.BG,
          padding: "4px 12px",
          borderRadius: "8px",
          width: "fit-content",
        }}
      >
        {tx.category}
      </span>
      <span
        style={{
          color: tx.type === "income" ? UI_COLORS.INCOME : UI_COLORS.EXPENSE,
          fontSize: "16px",
          fontWeight: 800,
          textAlign: "right",
        }}
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
    return <p style={{ color: UI_COLORS.TEXT_SUB, textAlign: "center", padding: "40px 0" }}>ไม่พบรายการ</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {transactions.map((tx, i) => (
        <div
          key={tx.id || i}
          style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr 140px 120px",
            padding: "16px 0",
            borderBottom: `1px solid ${UI_COLORS.BG}`,
            alignItems: "center",
          }}
        >
          <span style={{ color: UI_COLORS.TEXT_SUB, fontSize: "13px" }}>
            {new Date(tx.date).toLocaleDateString("th-TH", {
              day: "2-digit",
              month: "short",
              ...(showYear && { year: "numeric" }),
            })}
          </span>
          <span style={{ fontWeight: 600 }}>{tx.name}</span>
          <span
            style={{
              color: UI_COLORS.TEXT_SUB,
              fontSize: "12px",
              background: UI_COLORS.BG,
              padding: "4px 12px",
              borderRadius: "8px",
              width: "fit-content",
            }}
          >
            {tx.category}
          </span>
          <span
            style={{
              color: tx.type === "income" ? UI_COLORS.INCOME : UI_COLORS.EXPENSE,
              fontSize: "16px",
              fontWeight: 800,
              textAlign: "right",
            }}
          >
            {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
