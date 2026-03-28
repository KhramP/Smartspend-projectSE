"use client";

import "../../_components/GlobalLayout.css";

export default function SettingsPage() {
  return (
    <div className="p-10">
      <div className="grid grid-cols-1 gap-8 max-w-4xl">
        
        {/* Profile Settings */}
        <section className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            จัดการโปรไฟล์
          </h3>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400">
                Avatar
              </div>
              <button className="btn-premium" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #555' }}>
                เปลี่ยนรูปโปรไฟล์
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-group">
                <label>ชื่อแสดงผล</label>
                <input type="text" className="form-input" defaultValue="John K." />
              </div>
              <div className="form-group">
                <label>อีเมล</label>
                <input type="email" className="form-input" defaultValue="john@example.com" disabled />
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
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
              <select className="bg-transparent border border-gray-600 rounded-lg p-1 text-sm text-white">
                <option value="THB">บาท (THB)</option>
                <option value="USD">ดอลลาร์ (USD)</option>
              </select>
            </div>
          </div>
        </section>

        <div className="flex gap-4">
          <button className="btn-save" style={{ flex: 1 }}>บันทึกการตั้งค่าทั้งหมด</button>
          <button className="btn-cancel" style={{ border: '1px solid #555' }}>รีเซ็ต</button>
        </div>
      </div>
    </div>
  );
}