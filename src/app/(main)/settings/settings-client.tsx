"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserSettings } from "@/app/actions/transaction";
import "@/app/_components/GlobalLayout.css";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const handleSave = async () => {
    setSaving(true);
    await updateUserSettings({ userId, name });
    setSaving(false);
    router.refresh();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">การตั้งค่า</h1>
        <p className="text-gray-400 text-sm mt-1">จัดการข้อมูลส่วนตัวและปรับแต่งการใช้งานแอปพลิเคชัน</p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-4xl">
        {/* Profile Section */}
        <section className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            จัดการโปรไฟล์
          </h3>

          <div className="space-y-6">
            {/* Avatar + Info */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center text-3xl">
                {settings.image ? (
                  <img src={settings.image} alt="avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-gray-400">👤</span>
                )}
              </div>
              <div>
                <p className="text-white font-semibold">{settings.name}</p>
                <p className="text-xs text-gray-400 mt-1">แผน: {settings.plan}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label>ชื่อแสดงผล</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>อีเมล</label>
                <input
                  type="email"
                  className="form-input opacity-50 cursor-not-allowed"
                  defaultValue={settings.email}
                  disabled
                />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            การตั้งค่าระบบ
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <div>
                <p className="text-white font-medium">แจ้งเตือนเมื่อใช้จ่ายเกินงบ</p>
                <p className="text-xs text-gray-400">ระบบจะส่งการแจ้งเตือนหากใช้จ่ายเกิน 80% ของงบ</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-[var(--accent-green)]" defaultChecked />
            </div>
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
              <div>
                <p className="text-white font-medium">สกุลเงินหลัก</p>
                <p className="text-xs text-gray-400">ตั้งค่าสกุลเงินที่จะแสดงผลในแอป</p>
              </div>
              <select className="bg-transparent border border-gray-600 rounded-lg p-1 text-sm">
                <option value="THB">บาท (THB)</option>
                <option value="USD">ดอลลาร์ (USD)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-save flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
          </button>
          <button
            onClick={() => setName(settings.name)}
            className="px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-all font-medium"
          >
            รีเซ็ต
          </button>
        </div>
      </div>
    </div>
  );
}
