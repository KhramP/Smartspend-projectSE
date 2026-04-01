"use client";

import { useState } from "react";
import { createBudget } from "@/app/actions/transaction";
import "./GlobalLayout.css";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSaved?: () => void;
}

export function AddBudgetModal({ isOpen, onClose, userId, onSaved }: AddBudgetModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategoryName, setCustomCategoryName] = useState("");
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { id: "อาหาร", name: "อาหาร", icon: "🍜" },
    { id: "เดินทาง", name: "เดินทาง", icon: "🚌" },
    { id: "บันเทิง", name: "บันเทิง", icon: "🎮" },
    { id: "ช้อปปิ้ง", name: "ช้อปปิ้ง", icon: "🛍️" },
    { id: "สุขภาพ", name: "สุขภาพ", icon: "🏥" },
    { id: "การศึกษา", name: "การศึกษา", icon: "📚" },
    { id: "ค่าน้ำไฟ", name: "ค่าน้ำไฟ", icon: "💡" },
    { id: "custom", name: "ตั้งชื่อหมวดหมู่เอง", icon: "✏️" },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const finalCategory = selectedCategory === "custom" ? customCategoryName.trim() : selectedCategory;

    if (!finalCategory || !amount) {
      setError("กรุณาเลือกหมวดหมู่และระบุจำนวนเงิน");
      return;
    }

    setSaving(true);
    try {
      const result = await createBudget({
        userId,
        category: finalCategory,
        amount: parseFloat(amount),
      });

      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }

      handleReset();
      onClose();
      onSaved?.();
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  // ฟังก์ชันช่วยล้างค่าทั้งหมด
  const handleReset = () => {
    setSelectedCategory("");
    setCustomCategoryName("");
    setAmount("");
  };

  if (!isOpen) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      {/* หน้าต่าง Modal */}
      <div
        className="glass-card w-full max-w-4xl p-10 border border-white/20 relative rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* หัวข้อ */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white">ตั้งงบใหม่</h2>
          <button onClick={handleCancel} className="text-gray-400 hover:text-white transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* กล่องเลือกหมวดหมู่ */}
          <div className="mb-10">
            <label className="block text-gray-400 mb-6 font-medium text-lg">เลือกหมวดหมู่</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`cat-btn flex-col items-center justify-center py-8 gap-3 rounded-2xl border transition ${
                    selectedCategory === cat.id
                      ? "active border-[var(--accent-green)] bg-[var(--accent-green)]/10 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                      : "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white"
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="text-4xl mb-2">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
              ))}
            </div>

            {/* 2. แสดงเงื่อนไข: ช่องพิมพ์ชื่อหมวดหมู่เอง จะโชว์เมื่อเลือก ID 'custom' */}
            {selectedCategory === "custom" && (
              <div className="form-group mt-6 p-6 glass-card border border-white/10 rounded-2xl animate-fadeIn">
                <label className="block text-gray-400 mb-3 font-medium">ระบุชื่อหมวดหมู่ของคุณ</label>
                <input
                  type="text"
                  className="form-input w-full text-lg py-3 bg-black/30 border-gray-600 rounded-xl focus:border-[var(--accent-green)]"
                  placeholder="เช่น ค่าขนมสัตว์เลี้ยง, ค่าสมาชิกรายเดือน"
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  required={selectedCategory === "custom"} // บังคับกรอกถ้าเลือกอันนี้
                />
              </div>
            )}
          </div>

          {/* กล่องกำหนดงบประมาณ */}
          <div className="mb-14">
            <div className="form-group mb-0">
              <label className="block text-gray-400 mb-3 font-medium text-lg">กำหนดงบประมาณ</label>
              <input
                type="number"
                className="form-input w-full text-xl py-4 bg-black/40 border-gray-600 rounded-xl focus:border-[var(--accent-green)]"
                placeholder="ระบุจำนวนเงิน (฿)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ปุ่ม Action */}
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          <div className="flex gap-6 justify-center">
            <button
              type="submit"
              className="btn-save py-5 text-xl font-bold rounded-2xl flex-1 shadow-lg max-w-sm transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              disabled={
                saving || !selectedCategory || (selectedCategory === "custom" && !customCategoryName.trim()) || !amount
              }
            >
              {saving ? "กำลังบันทึก..." : "บันทึกรายการ"}
            </button>
            <button
              type="button"
              className="btn-cancel py-5 text-xl font-medium rounded-2xl flex-1 border-gray-500 max-w-sm transition hover:bg-white/5"
              onClick={handleCancel}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
