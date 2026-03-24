"use client";

import "./GlobalLayout.css"

export function DashBoard() {
  const categories = [
    { name: "อาหาร", icon: "🍜", amount: "฿5,407" },
    { name: "เดินทาง", icon: "🚗", amount: "฿3,210" },
  ];

  const transactions = [
    { date: "12 Mar 2026", name: "ข้าวกลางวัน", category: "อาหาร", amount: "฿120" },
    { date: "11 Mar 2026", name: "ข้าวกลางวัน", category: "อาหาร", amount: "฿120" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 className="logo-text">DashBoard</h1>
        
      </div>

      <div className="stat-grid">
        <div className="stat-card glass-card">
          <p className="stat-label">รายรับเดือนนี้</p>
          <h3 className="stat-value">$35,000</h3>
        </div>
        <div className="stat-card glass-card">
          <p className="stat-label">รายจ่ายเดือนนี้</p>
          <h3 className="stat-value">$28,500</h3>
        </div>
        <div className="stat-card glass-card">
          <p className="stat-label">ยอดคงเหลือ</p>
          <h3 className="stat-value">$6,500</h3>
        </div>
        <div className="stat-card glass-card">
          <p className="stat-label">หมวดหมู่ยอดนิยม</p>
          <h3 className="stat-value">อาหาร</h3>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "start" }}>
        <div className="category-grid">
          {categories.map((c) => (
            <div key={c.name} className="category-card glass-card">
              <div className="category-header">
                <span className="category-icon">{c.icon}</span>
                <span className="category-title">{c.name}</span>
              </div>
              <p className="category-amount">{c.amount}</p>
              <div className="gold-progress-bar">
                <div className="gold-progress-fill" style={{ width: "70%" }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="transaction-section glass-card">
          <div className="premium-btn-group">
            <button className="btn-premium">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M7 13l3 3 7-9" stroke="#fff" strokeWidth="2.5" />
              </svg>{" "}
              ทั้งหมด
            </button>
            <button className="btn-premium">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M7 13l3 3 7-9" stroke="#fff" strokeWidth="2.5" />
              </svg>{" "}
              รายจ่าย
            </button>
            <button className="btn-premium">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M7 13l3 3 7-9" stroke="#fff" strokeWidth="2.5" />
              </svg>{" "}
              รายรับ
            </button>
          </div>

          <table className="transaction-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>รายการ</th>
                <th>หมวดหมู่</th>
                <th>จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, index) => (
                <tr key={index}>
                  <td>{t.date}</td>
                  <td>{t.name}</td>
                  <td>{t.category}</td>
                  <td>{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
