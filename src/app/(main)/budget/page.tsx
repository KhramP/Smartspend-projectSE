"use client";


const THEME_COLOR = "#2563be"; 
const BG_COLOR = "#f4f4f5";    
const CARD_BG = "#ffffff";     
const BORDER_COLOR = "#e4e4e7"; 
const TEXT_MAIN = "#09090b";   
const TEXT_SUB = "#71717a";   

const budgets = [
  { name: "อาหาร", used: 5407, total: 6000, reset: "1 เม.ย.", icon: "🍜", color: "#84cc16" },
  { name: "เดินทาง", used: 3131, total: 5000, reset: "1 เม.ย.", icon: "🚗", color: "#0ea5e9" },
  { name: "บันเทิง", used: 2561, total: 5000, reset: "1 เม.ย.", icon: "🎮", color: "#8b5cf6" },
  { name: "ช้อปปิ้ง", used: 1890, total: 1500, reset: "1 เม.ย.", icon: "🛍️", color: "#f43f5e" },
];

const totalBudget = 20000;
const totalUsed = 14230;
const remaining = totalBudget - totalUsed;
const overallPercent = (totalUsed / totalBudget) * 100;

export default function BudgetPage() {
  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
  };

  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN, fontFamily: "inherit" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>งบประมาณ</h1>
          <p style={{ color: TEXT_SUB, fontSize: "14px" }}>จัดการและติดตามการใช้จ่ายตามเป้าหมาย</p>
        </div>
        <button style={{
          background: "#2563eb", color: "#fff",
          padding: "12px 24px",
          border: "none",
          borderRadius: "14px",
          fontWeight: 700, fontSize: "14px", cursor: "pointer",
          transition: "transform 0.2s",
        }}>
          + ตั้งงบใหม่
        </button>
      </div>

      {/* Overview card */}
      <div style={cardStyle}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0", marginBottom: "32px" }}>
          {[
            { label: "งบรวมเดือนนี้", value: `฿${totalBudget.toLocaleString()}`, color: TEXT_MAIN },
            { label: "ใช้ไปแล้ว", value: `฿${totalUsed.toLocaleString()}`, color: "#e11d48" },
            { label: "คงเหลือ", value: `฿${remaining.toLocaleString()}`, color: "#10b981" },
          ].map((item, i) => (
            <div key={item.label} style={{
              padding: "0 40px",
              borderLeft: i > 0 ? `1px solid ${BORDER_COLOR}` : "none",
            }}>
              <p style={{ color: TEXT_SUB, fontSize: "12px", fontWeight: 700, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>
                {item.label}
              </p>
              <p style={{ color: item.color, fontSize: "32px", fontWeight: 800 }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Main progress */}
        <div style={{ background: BG_COLOR, padding: "24px", borderRadius: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", alignItems: "center" }}>
            <span style={{ color: TEXT_MAIN, fontSize: "14px", fontWeight: 700 }}>ภาพรวมการใช้งบเดือนนี้</span>
            <span style={{ 
              background: overallPercent > 80 ? "#fff1f2" : "#f7fee7",
              color: overallPercent > 80 ? "#e11d48" : "#4d7c0f",
              padding: "4px 12px",
              borderRadius: "10px",
              fontSize: "13px", 
              fontWeight: 800 
            }}>
              {overallPercent.toFixed(1)}%
            </span>
          </div>
          <div style={{ height: "14px", background: BORDER_COLOR, borderRadius: "10px", overflow: "hidden" }}>
            <div style={{
              width: `${overallPercent}%`,
              height: "100%",
              background: overallPercent > 80 ? "#e11d48" : "#000",
              borderRadius: "10px",
              transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
            }} />
          </div>
        </div>
      </div>

      {/* Category Grid Header */}
      <h2 style={{ fontSize: "18px", fontWeight: 700, marginTop: "40px", marginBottom: "20px" }}>งบประมาณแยกตามหมวดหมู่</h2>

      {/* Category budget cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {budgets.map((b) => {
          const pct = (b.used / b.total) * 100;
          const isOver = pct > 100;
          const barColor = isOver ? "#e11d48" : b.color;

          return (
            <div key={b.name} style={{
              ...cardStyle,
              padding: "24px",
              borderColor: isOver ? "#fecaca" : BORDER_COLOR,
              background: isOver ? "#fffbfa" : CARD_BG,
            }}>
              {/* Icon + name */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
                <div style={{
                  width: "48px", height: "48px",
                  background: isOver ? "#fee2e2" : `${b.color}15`,
                  borderRadius: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "24px",
                }}>
                  {b.icon}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: TEXT_MAIN, fontWeight: 800, fontSize: "16px" }}>{b.name}</p>
                  <p style={{ color: TEXT_SUB, fontSize: "11px", fontWeight: 500 }}>รีเซ็ต {b.reset}</p>
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ color: TEXT_MAIN, fontSize: "24px", fontWeight: 800 }}>฿{b.used.toLocaleString()}</span>
                  <span style={{ color: TEXT_SUB, fontSize: "13px", fontWeight: 500 }}>/ ฿{b.total.toLocaleString()}</span>
                </div>
                
                {/* Progress */}
                <div style={{ height: "8px", background: "#f1f1f5", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{
                    width: `${Math.min(pct, 100)}%`,
                    height: "100%",
                    background: barColor,
                    borderRadius: "10px",
                    transition: "width 0.8s ease",
                  }} />
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                background: isOver ? "#e11d48" : "#f4f4f5",
                color: isOver ? "#fff" : TEXT_SUB,
                padding: "8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: 700,
              }}>
                {isOver ? "⚠ เกินงบประมาณ" : `เหลืออีก ฿${(b.total - b.used).toLocaleString()}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}