"use client";

import { useState } from "react";
import "../../_components/GlobalLayout.css";

export default function TransactionPage() {
  // ข้อมูลจำลองสำหรับสถิติแถวบน
  const stats = [
    { label: "รายจ่ายเดือนนี้", value: "฿15,000" },
    { label: "รายได้เดือนนี้", value: "฿35,000" },
    { label: "เฉลี่ยต่อวัน", value: "฿500" },
    { label: "จำนวนรายการ", value: "42" },
  ];

  return (
    <div className="p-10">
      {/* แถวสถิติ (Stats Cards) */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-6 text-center">
            <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
            <h3 className="text-xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* แถบเครื่องมือกรองข้อมูล (Filter Tools) */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        {/* ช่องค้นหา */}
        <div className="glass-card flex items-center px-4 py-1" style={{ flex: 1, minWidth: "300px" }}>
          <input
            type="text"
            placeholder="ค้นหาชื่อรายการ..."
            className="bg-transparent border-none outline-none text-white w-full py-2"
          />
          <button className="text-[var(--accent-green)] font-medium px-4 border-l border-white/10 ml-2">ค้นหา</button>
        </div>

        {/* ปุ่มประเภทรายการ */}
        <div className="flex gap-2">
          {["ทั้งหมด", "รายจ่าย", "รายรับ"].map((type) => (
            <button key={type} className="btn-premium" style={{ background: "transparent", borderColor: "#444" }}>
              {type}
            </button>
          ))}
        </div>

        {/* ตัวเลือกหมวดหมู่และวันที่ */}
        <button className="btn-premium" style={{ background: "transparent", borderColor: "#444" }}>
          หมวดหมู่
        </button>
        <button className="btn-premium" style={{ background: "transparent", borderColor: "#444" }}>
          วันที่
        </button>
      </div>

      {/* ตารางแสดงรายการ */}
      <div className="glass-card overflow-hidden">
        <table className="transaction-table" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>วันที่</th>
              <th>รายการ</th>
              <th>หมวดหมู่</th>
              <th>จำนวนเงิน</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "100px" }} className="text-gray-500">
                ยังไม่มีข้อมูลรายการ
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
