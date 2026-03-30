"use client";

import "../../_components/GlobalLayout.css";

export default function CategoryPage() {
  // ข้อมูลจำลองสำหรับหมวดหมู่ต่างๆ ตามรูปภาพ
  const categories = [
    { name: "อาหาร", icon: "🍜", count: 42, amount: 5407, percent: 70 },
    { name: "เดินทาง", icon: "🚗", count: 18, amount: 3131, percent: 55 },
    { name: "บันเทิง", icon: "🎮", count: 8, amount: 2561, percent: 65 },
    { name: "ช้อปปิ้ง", icon: "🛍️", count: 5, amount: 1890, percent: 35 },
    { name: "สุขภาพ", icon: "🏥", count: 2, amount: 600, percent: 25 },
    { name: "การศึกษา", icon: "📚", count: 3, amount: 480, percent: 38 },
    { name: "ค่าน้ำไฟ", icon: "💡", count: 2, amount: 361, percent: 58 },
  ];

  return (
    <div className="p-10">
      <h2 className="text-2xl font-semibold text-white mb-6">หมวดหมู่</h2>
      
      {/* จัด Layout แบบ Grid 3 คอลัมน์ตามรูปภาพ */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px' 
      }}>
        {categories.map((cat) => (
          <div key={cat.name} className="category-card glass-card" style={{ padding: '24px' }}>
            <div className="category-header">
              <span className="category-icon" style={{ fontSize: '24px' }}>{cat.icon}</span>
              <div>
                <span className="category-title" style={{ display: 'block', fontSize: '18px' }}>{cat.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--muted-text)' }}>
                  {cat.count} รายการ {cat.name === "อาหาร" ? "• เดือนนี้" : ""}
                </span>
              </div>
            </div>
            <p className="category-amount" style={{ marginTop: '10px' }}>฿{cat.amount.toLocaleString()}</p>
            <div className="gold-progress-bar">
              <div className="gold-progress-fill" style={{ width: `${cat.percent}%` }}></div>
            </div>
          </div>
        ))}

        {/* ช่องเพิ่มหมวดหมู่ใหม่ */}
        <div 
          className="category-card glass-card" 
          style={{ 
            padding: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            borderStyle: 'dashed', // ทำให้ขอบเป็นเส้นประตามดีไซน์ปกติของปุ่มเพิ่ม
            borderColor: 'var(--glass-border)'
          }}
          onClick={() => alert("ฟังก์ชันเพิ่มหมวดหมู่ใหม่กำลังตามมาเร็วๆ นี้!")}
        >
          <div style={{ 
            fontSize: '40px', 
            color: 'var(--muted-text)',
            marginBottom: '8px'
          }}>+</div>
          <span style={{ color: 'var(--muted-text)', fontSize: '16px' }}>เพิ่มหมวดหมู่ใหม่</span>
        </div>
      </div>
    </div>
  );
}
