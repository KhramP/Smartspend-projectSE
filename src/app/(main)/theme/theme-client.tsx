"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserTheme } from "@/app/actions/transaction";
import { useTheme } from "@/app/theme-provider";
import { UI_COLORS, cardStyle as baseCardStyle, pageContainerStyle } from "@/lib/constants";
import { PageHeader } from "@/app/_components/page-header";

const { BG: BG_COLOR, BORDER: BORDER_COLOR, TEXT_MAIN, TEXT_SUB } = UI_COLORS;

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

    // Apply theme via context (propagates to all components)
    setTheme(selectedMode, selectedColor);

    setSaving(false);
    router.refresh();
  };

  const containerCardStyle = {
    ...baseCardStyle,
    padding: "32px",
  };

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="ปรับแต่งธีม" subtitle="เลือกสไตล์และสีสันที่สะท้อนความเป็นตัวคุณ" />

      <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Mode selection */}
        <div style={containerCardStyle}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            โหมดการแสดงผล
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {modes.map((m) => (
              <div
                key={m.name}
                onClick={() => setSelectedMode(m.name)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "12px",
                  padding: "24px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  background: selectedMode === m.name ? `${selectedColor}15` : BG_COLOR,
                  border: `2px solid ${selectedMode === m.name ? selectedColor : BORDER_COLOR}`,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "28px" }}>{m.icon}</span>
                <span
                  style={{ fontSize: "16px", fontWeight: 700, color: selectedMode === m.name ? TEXT_MAIN : TEXT_SUB }}
                >
                  {m.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Color selection */}
        <div style={containerCardStyle}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ color: selectedColor }}>●</span> สีหลักของแอป
          </h3>
          <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
            {accentColors.map((c) => (
              <div
                key={c.value}
                onClick={() => setSelectedColor(c.value)}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: c.value,
                  cursor: "pointer",
                  border: selectedColor === c.value ? "4px solid #fff" : "none",
                  boxShadow: selectedColor === c.value ? `0 0 0 2px ${c.value}, 0 4px 12px ${c.value}40` : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: selectedColor === c.value ? "scale(1.1)" : "scale(1)",
                }}
              >
                {selectedColor === c.value && (
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: "20px" }}>✓</span>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "16px" }}>
            <p style={{ color: TEXT_SUB, fontSize: "13px" }}>
              เลือก: {accentColors.find((c) => c.value === selectedColor)?.name || selectedColor}
            </p>
          </div>
        </div>

        {/* Preview */}
        <div style={containerCardStyle}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>ตัวอย่าง</h3>
          <div
            style={{
              background: selectedMode === "dark" ? "#1a1a2e" : BG_COLOR,
              padding: "24px",
              borderRadius: "16px",
              border: `1px dashed ${BORDER_COLOR}`,
            }}
          >
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ width: "40px", height: "40px", background: selectedColor, borderRadius: "12px" }} />
              <div>
                <p style={{ color: selectedMode === "dark" ? "#fff" : TEXT_MAIN, fontSize: "14px", fontWeight: 700 }}>
                  ตัวอย่างหัวข้อ
                </p>
                <p style={{ color: selectedMode === "dark" ? "#aaa" : TEXT_SUB, fontSize: "12px" }}>
                  คำอธิบายรายละเอียด
                </p>
              </div>
            </div>
            <button
              style={{
                padding: "10px 24px",
                background: selectedColor,
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              ปุ่มตัวอย่าง
            </button>
          </div>
        </div>

        {/* Save */}
        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2,
              padding: "20px",
              background: selectedColor,
              color: "#fff",
              border: "none",
              borderRadius: "18px",
              fontWeight: 800,
              fontSize: "16px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
              transition: "all 0.2s",
              boxShadow: `0 10px 15px -3px rgba(0,0,0,0.1)`,
            }}
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการปรับแต่งธีม"}
          </button>
          <button
            onClick={() => {
              setSelectedColor(currentTheme.themeColor);
              setSelectedMode(currentTheme.themeMode);
            }}
            style={{
              flex: 1,
              padding: "20px",
              background: "transparent",
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: "18px",
              color: TEXT_SUB,
              fontWeight: 700,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            คืนค่าเริ่มต้น
          </button>
        </div>
      </div>
    </div>
  );
}
