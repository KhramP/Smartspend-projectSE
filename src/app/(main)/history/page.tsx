"use client";

import { useState } from "react";
import "../../_components/GlobalLayout.css";

export default function HistoryPage() {
  // รายชื่อเดือนภาษาไทย
  const months = [
    "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  // ปีที่ต้องการแสดง (2024 และ 2025 ตามรูป)
  const years = [2024, 2025];

  // State สำหรับเก็บเดือนที่ถูกเลือก (ตัวอย่าง: { "2024-ม.ค.": true })
  const [selectedMonths, setSelectedMonths] = useState<Record<string, boolean>>({});

  const toggleMonth = (year: number, month: string) => {
    const key = `${year}-${month}`;
    setSelectedMonths((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="p-10">
      <div className="glass-card p-10 min-h-[600px] flex flex-col">
        <h2 className="text-xl text-gray-400 mb-8">เลือกเดือนที่คุณต้องการ</h2>

        <div className="flex-1 space-y-12">
          {years.map((year) => (
            <div key={year}>
              <h3 className="text-4xl font-light text-gray-500 mb-6">{year}</h3>
              
              {/* ตารางเลือกเดือน 6 คอลัมน์ 2 แถว */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(6, 1fr)", 
                gap: "24px" 
              }}>
                {months.map((month) => {
                  const isSelected = selectedMonths[`${year}-${month}`];
                  return (
                    <div 
                      key={month} 
                      onClick={() => toggleMonth(year, month)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      {/* Custom Checkbox */}
                      <div className={`w-8 h-8 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected 
                        ? "bg-[var(--accent-green)] border-[var(--accent-green)]" 
                        : "border-gray-600 group-hover:border-gray-400"
                      }`}>
                        {isSelected && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3">
                            <path d="M20 6L9 17L4 12"></path>
                          </svg>
                        )}
                      </div>
                      <span className={`text-xl ${isSelected ? "text-white" : "text-gray-400"}`}>
                        {month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ปุ่ม Action ด้านล่าง */}
        <div className="flex gap-10 mt-12">
          <button 
            className="btn-save" 
            style={{ 
              flex: 1, 
              padding: "24px", 
              fontSize: "24px", 
              borderRadius: "40px",
              background: "transparent",
              border: "1px solid #666",
              color: "#fff"
            }}
            onClick={() => console.log("Selected:", selectedMonths)}
          >
            ส่งคำขอ
          </button>
          <button 
            className="btn-cancel" 
            style={{ 
              flex: 1, 
              padding: "24px", 
              fontSize: "24px", 
              borderRadius: "40px",
              border: "1px solid #666"
            }}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}