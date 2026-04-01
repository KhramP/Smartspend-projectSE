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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
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

  const handleDelete = async () => {
    if (!confirmDeleteId) return;
    setDeleting(confirmDeleteId);
    setConfirmDeleteId(null);
    await deleteTransaction({ id: confirmDeleteId, userId });
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
                        onClick={() => setConfirmDeleteId(tx.id)}
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
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-h-[90vh] w-[95%] sm:w-[90%] max-w-[800px] overflow-y-auto rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-8 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-250">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3 text-2xl font-semibold text-white">
              <svg
                width="28"
                height="28"
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
              <span>แก้ไขรายการ</span>
              <button
                type="button"
                className="ml-auto border-none bg-transparent p-1 text-xl text-gray-500 transition-colors hover:text-white cursor-pointer rounded"
                onClick={() => setEditTx(null)}
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {editError}
              </div>
            )}

            {/* Toggle รายจ่าย / รายรับ */}
            <div className="mb-6 flex rounded-lg border border-white/10 p-1">
              <button
                type="button"
                className={`flex-1 cursor-pointer rounded-md border-none px-3 py-3 text-base font-medium transition-all duration-300 ${editForm.type === "expense" ? "bg-white/10 text-white" : "bg-transparent text-gray-500"}`}
                onClick={() => setEditForm((p) => ({ ...p, type: "expense", category: "" }))}
              >
                รายจ่าย
              </button>
              <button
                type="button"
                className={`flex-1 cursor-pointer rounded-md border-none px-3 py-3 text-base font-medium transition-all duration-300 ${editForm.type === "income" ? "bg-white/10 text-white" : "bg-transparent text-gray-500"}`}
                onClick={() => setEditForm((p) => ({ ...p, type: "income", category: "" }))}
              >
                รายรับ
              </button>
            </div>

            {/* Amount */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-500">จำนวนเงิน (฿)</label>
              <input
                type="number"
                step="0.01"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                placeholder="0.00"
                value={editForm.amount}
                onChange={(e) => setEditForm((p) => ({ ...p, amount: e.target.value }))}
              />
            </div>

            {/* Name */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-500">ชื่อรายการ</label>
              <input
                type="text"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none"
                placeholder="ระบุชื่อรายการ"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>

            {/* Categories Grid */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-500">หมวดหมู่</label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="grid flex-3 grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3 text-[13px] transition-all duration-200 ${
                        editForm.category === cat.name
                          ? "border-[#9bd104] bg-[#9bd104]/10 text-white"
                          : "border-white/10 bg-black/20 text-gray-500 hover:border-[#9bd104] hover:bg-[#9bd104]/10 hover:text-white"
                      }`}
                      onClick={() => setEditForm((p) => ({ ...p, category: cat.name, type: "expense" }))}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-1 flex-row sm:flex-col justify-start gap-2 sm:gap-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                  {INCOME_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3 text-[13px] transition-all duration-200 ${
                        editForm.category === cat.name
                          ? "border-[#9bd104] bg-[#9bd104]/10 text-white"
                          : "border-white/10 bg-black/20 text-gray-500 hover:border-[#9bd104] hover:bg-[#9bd104]/10 hover:text-white"
                      }`}
                      onClick={() => setEditForm((p) => ({ ...p, category: cat.name, type: "income" }))}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Date */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-500">วันที่</label>
              <input
                type="date"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                value={editForm.date}
                onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>

            {/* Note */}
            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-500">Note</label>
              <input
                type="text"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none"
                placeholder="บันทึกเพิ่มเติม..."
                value={editForm.note}
                onChange={(e) => setEditForm((p) => ({ ...p, note: e.target.value }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={handleEditSave}
                disabled={saving}
                className="flex-2 cursor-pointer rounded-lg border-none bg-[#9bd104] px-4 py-4 text-base font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "กำลังบันทึก..." : "บันทึกรายการ"}
              </button>
              <button
                type="button"
                className="flex-1 cursor-pointer rounded-lg border border-gray-600 bg-transparent px-4 py-4 text-base text-white transition-all duration-300 hover:border-white hover:bg-white/5"
                onClick={() => setEditTx(null)}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-[90%] max-w-[400px] rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-250 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">ยืนยันการลบ</h3>
            <p className="text-sm text-gray-400 mb-6">ต้องการลบรายการนี้หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 cursor-pointer rounded-lg border-none bg-red-500 px-4 py-3 text-base font-semibold text-white transition-opacity duration-300 hover:opacity-90"
              >
                ลบรายการ
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 cursor-pointer rounded-lg border border-gray-600 bg-transparent px-4 py-3 text-base text-white transition-all duration-300 hover:border-white hover:bg-white/5"
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
