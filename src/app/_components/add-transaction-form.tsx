"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/app/actions/transaction";
import { useUser } from "@/utils/user-global";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/constants";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { user } = useUser();
  const router = useRouter();
  const [type, setType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const expenseCategories = EXPENSE_CATEGORIES;
  const incomeCategories = INCOME_CATEGORIES;

  const resetForm = () => {
    setType("expense");
    setSelectedCategory("");
    setAmount("");
    setName("");
    setDate("");
    setNote("");
    setError("");
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedCategory) {
      setError("กรุณาเลือกหมวดหมู่");
      return;
    }

    if (!user) {
      setError("กรุณาเข้าสู่ระบบ");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createTransaction({
        userId: user.id,
        amount: parseFloat(amount),
        name,
        type,
        category: selectedCategory,
        date,
        note: note || undefined,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      resetForm();
      onClose();
      router.refresh();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
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
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>เพิ่มรายการ</span>
          <button
            type="button"
            className="ml-auto border-none bg-transparent p-1 text-xl text-gray-500 transition-colors hover:text-white cursor-pointer rounded"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Toggle รายจ่าย / รายรับ */}
          <div className="mb-6 flex rounded-lg border border-white/10 p-1">
            <button
              type="button"
              className={`flex-1 cursor-pointer rounded-md border-none px-3 py-3 text-base font-medium transition-all duration-300 ${type === "expense" ? "bg-white/10 text-white" : "bg-transparent text-gray-500"}`}
              onClick={() => setType("expense")}
            >
              รายจ่าย
            </button>
            <button
              type="button"
              className={`flex-1 cursor-pointer rounded-md border-none px-3 py-3 text-base font-medium transition-all duration-300 ${type === "income" ? "bg-white/10 text-white" : "bg-transparent text-gray-500"}`}
              onClick={() => setType("income")}
            >
              รายรับ
            </button>
          </div>

          {/* Amount & Name Inputs */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-500">จำนวนเงิน (฿)</label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-500">ชื่อรายการ</label>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none"
              placeholder="ระบุชื่อรายการ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Categories Grid */}
          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-500">หมวดหมู่</label>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <div className="grid flex-3 grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {expenseCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3 text-[13px] transition-all duration-200 ${
                      selectedCategory === cat.name
                        ? "border-[#9bd104] bg-[#9bd104]/10 text-white"
                        : "border-white/10 bg-black/20 text-gray-500 hover:border-[#9bd104] hover:bg-[#9bd104]/10 hover:text-white"
                    }`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-1 flex-row sm:flex-col justify-start gap-2 sm:gap-3 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                {incomeCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border px-2 py-3 text-[13px] transition-all duration-200 ${
                      selectedCategory === cat.name
                        ? "border-[#9bd104] bg-[#9bd104]/10 text-white"
                        : "border-white/10 bg-black/20 text-gray-500 hover:border-[#9bd104] hover:bg-[#9bd104]/10 hover:text-white"
                    }`}
                    onClick={() => setSelectedCategory(cat.name)}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Date & Note Inputs */}
          <div className="mb-5 flex-1">
            <label className="mb-2 block text-sm text-gray-500">วันที่</label>
            <input
              type="date"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm text-gray-500">Note</label>
            <input
              type="text"
              className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-[15px] text-white transition-colors duration-300 focus:border-[#9bd104] focus:outline-none"
              placeholder="บันทึกเพิ่มเติม..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 cursor-pointer rounded-lg border-none bg-[#9bd104] px-4 py-4 text-base font-semibold text-black transition-opacity duration-300 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกรายการ"}
            </button>
            <button
              type="button"
              className="flex-1 cursor-pointer rounded-lg border border-gray-600 bg-transparent px-4 py-4 text-base text-white transition-all duration-300 hover:border-white hover:bg-white/5"
              onClick={handleClose}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
