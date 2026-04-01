"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserTheme } from "@/app/actions/transaction";
import { useTheme } from "@/app/theme-provider";
import "@/app/_components/GlobalLayout.css";

export function ThemeClient({
  currentTheme,
  userId,
}: {
  currentTheme: { themeColor: string; themeMode: string };
  userId: string;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [selectedColor, setSelectedColor] = useState(currentTheme.themeColor);
  const [selectedMode, setSelectedMode] = useState(currentTheme.themeMode);
  const [saving, setSaving] = useState(false);

  const accentColors = [
    { name: "Ocean Blue", value: "#2563eb" },
    { name: "Lemon Green", value: "#84cc16" },
    { name: "Sky Blue", value: "#38bdf8" },
    { name: "Royal Purple", value: "#a855f7" },
    { name: "Fiery Red", value: "#ef4444" },
    { name: "Sunset Orange", value: "#f97316" },
    { name: "Sakura Pink", value: "#ec4899" },
    { name: "Emerald", value: "#10b981" },
  ];

  const modes = [
    { name: "light", label: "สว่าง", icon: "☀️" },
    { name: "dark", label: "มืด", icon: "🌙" },
  ];

  const handleSave = async () => {
    setSaving(true);
    await updateUserTheme({ userId, themeColor: selectedColor, themeMode: selectedMode });
    setTheme(selectedMode, selectedColor);
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="p-6 md:p-10 flex justify-center">
      <div className="glass-card w-full max-w-3xl p-6 md:p-8 shadow-2xl rounded-3xl border border-white/10">
        <p className="text-gray-400 mb-10 text-center text-lg">เลือกสไตล์และสีสันที่สะท้อนความเป็นตัวคุณ</p>

        <div className="space-y-12">
          {/* Mode selection */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 rounded-full" style={{ background: selectedColor }} />
              โหมดการแสดงผล
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {modes.map((m) => (
                <div
                  key={m.name}
                  onClick={() => setSelectedMode(m.name)}
                  className={`flex items-center justify-center gap-3 p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                    selectedMode === m.name
                      ? "bg-white/10 border-white/20"
                      : "bg-black/20 border-transparent hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  <span className="text-3xl">{m.icon}</span>
                  <span className={`text-base font-bold ${selectedMode === m.name ? "text-white" : "text-gray-400"}`}>
                    {m.label}
                  </span>
                  {/* Custom radio */}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-auto ${
                      selectedMode === m.name ? "border-white" : "border-gray-600"
                    }`}
                  >
                    {selectedMode === m.name && (
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: selectedColor }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Color selection */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 rounded-full" style={{ background: selectedColor }} />
              สีหลักของแอป (Accent Color)
            </h3>
            <div className="flex flex-wrap gap-5 justify-center">
              {accentColors.map((c) => (
                <div
                  key={c.value}
                  onClick={() => setSelectedColor(c.value)}
                  className={`w-14 h-14 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center border-4 ${
                    selectedColor === c.value
                      ? "border-white scale-110 shadow-lg"
                      : "border-transparent hover:border-white/30 hover:scale-105"
                  }`}
                  style={{ background: c.value }}
                  title={c.name}
                >
                  {selectedColor === c.value && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17L4 12" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-sm mt-4">
              เลือก: {accentColors.find((c) => c.value === selectedColor)?.name || selectedColor}
            </p>
          </section>

          {/* Preview */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 rounded-full" style={{ background: selectedColor }} />
              ตัวอย่าง
            </h3>
            <div
              className={`p-6 rounded-2xl border border-dashed border-white/10 ${
                selectedMode === "dark" ? "bg-[#1a1a2e]" : "bg-black/20"
              }`}
            >
              <div className="flex gap-3 items-center mb-4">
                <div className="w-10 h-10 rounded-xl" style={{ background: selectedColor }} />
                <div>
                  <p className={`text-sm font-bold ${selectedMode === "dark" ? "text-white" : "text-white"}`}>
                    ตัวอย่างหัวข้อ
                  </p>
                  <p className={`text-xs ${selectedMode === "dark" ? "text-gray-400" : "text-gray-400"}`}>
                    คำอธิบายรายละเอียด
                  </p>
                </div>
              </div>
              <button
                className="px-6 py-2.5 text-white text-sm font-bold rounded-xl transition-transform hover:scale-105"
                style={{ background: selectedColor }}
              >
                ปุ่มตัวอย่าง
              </button>
            </div>
          </section>
        </div>

        {/* Action buttons */}
        <div className="mt-16 pt-8 border-t border-white/10 flex gap-4 justify-center">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-save shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              width: "220px",
              padding: "18px",
              fontSize: "16px",
              borderRadius: "40px",
              background: selectedColor,
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการปรับแต่งธีม"}
          </button>
          <button
            onClick={() => {
              setSelectedColor(currentTheme.themeColor);
              setSelectedMode(currentTheme.themeMode);
            }}
            className="px-8 py-4 rounded-[40px] border border-gray-600 text-gray-400 font-bold text-base hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            คืนค่าเริ่มต้น
          </button>
        </div>
      </div>
    </div>
  );
}
