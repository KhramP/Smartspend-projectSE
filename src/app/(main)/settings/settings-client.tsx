"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserSettings } from "@/app/actions/transaction";
import {
  UI_COLORS,
  cardStyle as baseCardStyle,
  inputStyle as baseInputStyle,
  pageContainerStyle,
  labelStyle,
} from "@/lib/constants";
import { PageHeader } from "@/app/_components/page-header";

const { BORDER: BORDER_COLOR, TEXT_SUB } = UI_COLORS;

type Settings = {
  name: string;
  email: string;
  image: string | null;
  plan: string;
};

export function SettingsClient({ settings, userId }: { settings: Settings; userId: string }) {
  const router = useRouter();
  const [name, setName] = useState(settings.name);
  const [saving, setSaving] = useState(false);

  const cardStyle = {
    ...baseCardStyle,
    padding: "32px",
  };

  const inputStyle = {
    ...baseInputStyle,
    marginTop: "8px",
  };

  const handleSave = async () => {
    setSaving(true);
    await updateUserSettings({ userId, name });
    setSaving(false);
    router.refresh();
  };

  return (
    <div style={pageContainerStyle}>
      <PageHeader title="การตั้งค่า" subtitle="จัดการข้อมูลส่วนตัวและปรับแต่งการใช้งานแอปพลิเคชัน" />

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "20px" }}>👤</span> จัดการโปรไฟล์
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#f1f5f9",
                border: `2px dashed ${BORDER_COLOR}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              🙂
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600 }}>{settings.name}</p>
              <p style={{ color: TEXT_SUB, fontSize: "12px" }}>แผน: {settings.plan}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>ชื่อแสดงผล</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>อีเมล</label>
              <input defaultValue={settings.email} type="email" style={inputStyle} disabled />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2,
              padding: "18px",
              background: "#2563eb",
              border: "none",
              borderRadius: "16px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
        </div>
      </div>
    </div>
  );
}
