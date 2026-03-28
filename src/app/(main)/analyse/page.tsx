"use client";

import { useState } from "react";
import "../../_components/GlobalLayout.css";

export default function AnalysePage() {
  // จำลอง State สำหรับปุ่ม Toggle ต่างๆ
  const [trendTab, setTrendTab] = useState("รายรับ-รายจ่าย");
  const [catTab, setCatTab] = useState("ยอดรวม");
  const [topTab, setTopTab] = useState("ยอดรวม");

  // ข้อมูลจำลองสำหรับแถบความคืบหน้า (Progress bars)
  const categoryStats = [
    { name: "อาหาร", percent: 48, amount: "฿32,442", color: "#9bd104ff" },
    { name: "เดินทาง", percent: 32, amount: "฿18,786", color: "#ffd700" },
    { name: "บันเทิง", percent: 28, amount: "฿15,408", color: "#4CAF50" },
    { name: "สุขภาพ", percent: 16, amount: "฿5,130", color: "#2196F3" },
    { name: "อื่นๆ", percent: 15, amount: "฿4,130", color: "#9E9E9E" },
  ];

  // ข้อมูลจำลองสำหรับ Top รายจ่าย
  const topExpenses = [
    { rank: 1, name: "ข้าว/อาหาร", category: "อาหาร", count: "180 ครั้ง", amount: "฿18,400", icon: "🍜" },
    { rank: 2, name: "BTS/MRT", category: "เดินทาง", count: "142 ครั้ง", amount: "฿8,520", icon: "🚇" },
    { rank: 3, name: "Streaming", category: "บันเทิง", count: "12 ครั้ง", amount: "฿1,780", icon: "🎬" },
  ];

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold text-white mb-6">วิเคราะห์เชิงลึก</h2>

      {/* แถวที่ 1: การ์ดสถิติ 4 ใบ */}
      <div className="stat-grid mb-6">
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">ค่าใช้จ่ายเฉลี่ย/เดือน</p>
          <h3 className="stat-value text-red-400">฿12,540</h3>
        </div>
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">ออมเงินเฉลี่ย/เดือน</p>
          <h3 className="stat-value text-green-400">฿4,200</h3>
        </div>
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">เดือนที่ใช้จ่ายสูงสุด</p>
          <h3 className="stat-value text-white">ธันวาคม</h3>
        </div>
        <div className="stat-card glass-card text-center py-8">
          <p className="stat-label">อัตราออมเงิน</p>
          <h3 className="stat-value text-[var(--accent-gold)]">15%</h3>
        </div>
      </div>

      {/* แถวที่ 2: กราฟแนวโน้ม และ สัดส่วนหมวดหมู่ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        
        {/* กล่องซ้าย: แนวโน้มรายรับ-รายจ่าย */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">แนวโน้มรายรับ-รายจ่าย</h3>
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              {["รายรับ-รายจ่าย", "รายจ่าย", "รายรับ"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTrendTab(tab)}
                  className={`px-4 py-1.5 text-xs ${trendTab === tab ? "bg-[var(--accent-green)] text-black font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {/* จำลองพื้นที่กราฟเส้นด้วย SVG แบบง่ายๆ */}
          <div className="flex-1 min-h-[250px] border-l border-b border-gray-600 relative flex items-end">
            <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
              <polyline 
                fill="none" 
                stroke="var(--accent-gold)" 
                strokeWidth="1" 
                points="0,30 15,40 30,25 45,45 60,20 75,40 90,15 100,35" 
              />
            </svg>
          </div>
        </div>

        {/* กล่องขวา: สัดส่วนหมวดหมู่ */}
        <div className="glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">สัดส่วนหมวดหมู่</h3>
              <p className="text-xs text-gray-400">6 เดือนล่าสุด</p>
            </div>
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              {["ยอดรวม", "ครั้ง"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCatTab(tab)}
                  className={`px-4 py-1.5 text-xs ${catTab === tab ? "bg-[var(--accent-green)] text-black font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* วงกลมสถิติ (Donuts) */}
          <div className="flex justify-around mb-8 mt-2">
            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-gray-600 relative">
              <span className="text-xl font-semibold text-white">฿75,287</span>
              <span className="text-xs text-gray-400">รายจ่ายรวม</span>
              {/* เส้นขอบสีจำลองกราฟโดนัท */}
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[var(--accent-green)] border-r-[var(--accent-green)] transform rotate-45"></div>
            </div>
            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 border-gray-600 relative">
              <span className="text-xl font-semibold text-white">552 ครั้ง</span>
              <span className="text-xs text-gray-400">ธุรกรรมรวม</span>
              <div className="absolute inset-[-4px] rounded-full border-4 border-transparent border-b-[var(--accent-gold)] border-l-[var(--accent-gold)] transform -rotate-12"></div>
            </div>
          </div>

          {/* รายการ Progress Bars */}
          <div className="space-y-3">
            {categoryStats.map((cat, idx) => (
              <div key={idx} className="flex items-center text-sm">
                <span className="w-16 text-gray-300">{cat.name}</span>
                <div className="flex-1 mx-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}></div>
                </div>
                <span className="w-12 text-right text-gray-400">{cat.percent}%</span>
                <span className="w-20 text-right font-medium text-white">{cat.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* แถวที่ 3: กล่องเปล่า และ Top รายจ่าย */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        
        {/* กล่องเปล่าซ้ายล่าง */}
        <div className="glass-card p-6 min-h-[300px] flex items-center justify-center border-dashed border-gray-600">
           <span className="text-gray-500">พื้นที่สำหรับกราฟเพิ่มเติม</span>
        </div>

        {/* กล่องขวา: Top รายจ่ายสูงสุด */}
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white">Top รายจ่ายสูงสุด</h3>
            <div className="flex border border-gray-600 rounded-lg overflow-hidden">
              {["ยอดรวม", "ครั้ง"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTopTab(tab)}
                  className={`px-4 py-1.5 text-xs ${topTab === tab ? "bg-[var(--accent-green)] text-black font-medium" : "text-gray-400 hover:text-white"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {topExpenses.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-4 bg-black/20 border border-gray-700 rounded-xl hover:border-gray-500 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-gray-500 font-bold w-4">{item.rank}</div>
                  <div className="text-2xl">{item.icon}</div>
                  <div>
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-xs text-gray-400">{item.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-300">{item.count}</div>
                  <div className="font-semibold text-[var(--accent-gold)]">{item.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}