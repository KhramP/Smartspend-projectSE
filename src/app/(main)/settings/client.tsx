"use client";

import { useState, useTransition } from "react";
import { updateUserProfile } from "../../actions/user";
import { useRouter } from "next/navigation";
import "../../_components/GlobalLayout.css";

interface Profile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  plan: string;
}

export default function SettingsPageClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [name, setName] = useState(profile?.name || "");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleSave = () => {
    startTransition(async () => {
      const result = await updateUserProfile({ userId: profile.id, name });
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("บันทึกสำเร็จ");
        router.refresh();
      }
    });
  };

  return (
    <div className="p-10">
      <div className="grid grid-cols-1 gap-8 max-w-4xl">
        <section className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            จัดการโปรไฟล์
          </h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400 overflow-hidden">
                {profile?.image ? (
                  <img src={profile.image} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  "Avatar"
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400">แผน: {profile?.plan || "FREE"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>ชื่อแสดงผล</label>
                <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>อีเมล</label>
                <input type="email" className="form-input" value={profile?.email || ""} disabled />
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">การตั้งค่าระบบ</h3>
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
              <select className="bg-transparent border border-gray-600 rounded-lg p-1 text-sm text-white">
                <option value="THB">บาท (THB)</option>
                <option value="USD">ดอลลาร์ (USD)</option>
              </select>
            </div>
          </div>
        </section>

        {message && (
          <p className={`text-sm ${message.includes("สำเร็จ") ? "text-green-400" : "text-red-400"}`}>{message}</p>
        )}

        <div className="flex gap-4">
          <button className="btn-save" style={{ flex: 1 }} onClick={handleSave} disabled={isPending}>
            {isPending ? "กำลังบันทึก..." : "บันทึกการตั้งค่าทั้งหมด"}
          </button>
          <button
            className="btn-cancel"
            style={{ border: "1px solid #555" }}
            onClick={() => setName(profile?.name || "")}
          >
            รีเซ็ต
          </button>
        </div>
      </div>
    </div>
  );
}
