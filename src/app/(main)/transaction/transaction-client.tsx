"use client";

import { Transaction } from "@/generated/prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTransaction, updateTransaction } from "@/app/actions/transaction";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";
import "@/app/_components/GlobalLayout.css";

export function TransactionClient({
  data,
  userId,
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
  userId: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<"ทั้งหมด" | "รายจ่าย" | "รายรับ">("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState({ name: "", amount: "", date: "", category: "", type: "", note: "" });
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

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

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;
    setDeleting(id);
    await deleteTransaction({ id, userId });
    setDeleting(null);
    router.refresh();
  };

  const openEdit = (tx: Transaction) => {
    setEditTx(tx);
    setEditForm({
      name: tx.name || "",
      amount: String(tx.amount),
      date: new Date(tx.date).toISOString().slice(0, 10),
      category: tx.category || "",
      type: tx.type,
      note: tx.note || "",
    });
    setEditError("");
  };

  const handleEditSave = async () => {
    if (!editTx) return;
    setSaving(true);
    setEditError("");
    const result = await updateTransaction({
      id: editTx.id,
      userId,
      name: editForm.name,
      amount: parseFloat(editForm.amount),
      date: editForm.date,
      category: editForm.category,
      type: editForm.type,
      note: editForm.note || undefined,
    });
    setSaving(false);
    if (result && "error" in result && result.error) {
      setEditError(result.error);
      return;
    }
    setEditTx(null);
    router.refresh();
  };

  const editCategories = editForm.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

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
              <th style={{ textAlign: "center", width: "90px" }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "60px" }} className="text-gray-500">
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
                  <td style={{ textAlign: "center" }}>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEdit(tx)}
                        className="text-gray-500 hover:text-blue-400 transition-colors cursor-pointer"
                        title="แก้ไข"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deleting === tx.id}
                        className="text-gray-500 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-30"
                        title="ลบ"
                      >
                        {deleting === tx.id ? (
                          <span className="text-xs">...</span>
                        ) : (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editTx && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[95%] max-w-[500px] rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">แก้ไขรายการ</h3>
              <button
                onClick={() => setEditTx(null)}
                className="text-gray-400 hover:text-white cursor-pointer text-2xl"
              >
                &times;
              </button>
            </div>

            {editError && <p className="text-red-400 text-sm mb-4">{editError}</p>}

            <div className="space-y-4">
              {/* Type toggle */}
              <div className="flex gap-2">
                {(["expense", "income"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setEditForm((p) => ({ ...p, type: t, category: "" }));
                    }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      editForm.type === t
                        ? t === "expense"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}
                  >
                    {t === "expense" ? "รายจ่าย" : "รายรับ"}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label>ชื่อรายการ</label>
                <input
                  className="form-input"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>จำนวนเงิน</label>
                <input
                  className="form-input"
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>วันที่</label>
                <input
                  className="form-input"
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
              <div className="form-group">
                <label>หมวดหมู่</label>
                <select
                  className="form-input"
                  value={editForm.category}
                  onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {editCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>หมายเหตุ</label>
                <input
                  className="form-input"
                  value={editForm.note}
                  onChange={(e) => setEditForm((p) => ({ ...p, note: e.target.value }))}
                  placeholder="(ไม่บังคับ)"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handleEditSave} disabled={saving} className="btn-save flex-1 disabled:opacity-50">
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                onClick={() => setEditTx(null)}
                className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all cursor-pointer"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
