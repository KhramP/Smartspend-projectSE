"use client";

import { useState } from "react";
import "../../_components/GlobalLayout.css";

export default function ThemePage() {
  // จำลอง State สำหรับค่าการตั้งค่าต่างๆ
  const [selectedColor, setSelectedColor] = useState("#9bd104ff"); // สีเขียวเลมอนเดิม
  const [cardStyle, setCardStyle] = useState("Glassmorphism");
  const [fontSize, setFontSize] = useState(16);

  // รายการสีหลัก (Accent Colors) ให้เลือก ตามสไตล์ในรูป
  const accentColors = [
    { name: "Lemon Green", value: "#9bd104ff" },
    { name: "Ocean Blue", value: "#38bdf8" },
    { name: "Royal Purple", value: "#a855f7" },
    { name: "Fiery Red", value: "#ef4444" },
    { name: "Sunset Orange", value: "#f97316" },
    { name: "Sakura Pink", value: "#ec4899" },
  ];

  // รายการสไตล์ของการ์ด
  const cardStyles = ["Glassmorphism", "Flat Dark", "Material Design", "Minimalist"];

  return (
    <div className="p-6 md:p-10 flex justify-center">
      {/* Container หลัก จัดกลางและจำลองหน้าจอมือถือ/แท็บเล็ตเพื่อให้ดู friendly ขึ้น */}
      <div className="glass-card w-full max-w-3xl p-6 md:p-8 shadow-2xl rounded-3xl border border-white/10">
        
        <p className="text-gray-400 mb-10 text-center text-lg">ปรับแต่งบรรยากาศและสไตล์การใช้งานในแบบที่คุณชอบ</p>
        
        <div className="space-y-12">
          
          {/* ส่วนที่ 1: เลือกสีหลัก (Accent Color) - ทำเป็นวงกลมตามรูป */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 rounded-full" style={{ background: selectedColor }}></div>
              สีหลักของแอป (Accent Color)
            </h3>
            <div className="flex flex-wrap gap-5 justify-center">
              {accentColors.map((color) => (
                <div 
                  key={color.name}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-14 h-14 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center border-4 ${
                    selectedColor === color.value 
                    ? "border-white scale-110 shadow-lg" 
                    : "border-transparent hover:border-white/30 hover:scale-105"
                  }`}
                  style={{ background: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M20 6L9 17L4 12"></path>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ส่วนที่ 2: สไตล์ของการ์ดและส่วนประกอบ (Card Style) - ทำเป็น List เลือก */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 rounded-full" style={{ background: selectedColor }}></div>
              สไตล์ของการ์ด (Card Style)
            </h3>
            <div className="space-y-3">
              {cardStyles.map((style) => (
                <div 
                  key={style}
                  onClick={() => setCardStyle(style)}
                  className={`flex justify-between items-center p-5 rounded-2xl cursor-pointer transition-colors border ${
                    cardStyle === style 
                    ? "bg-white/10 border-white/20" 
                    : "bg-black/20 border-transparent hover:bg-white/5 hover:border-white/10"
                  }`}
                >
                  <span className={`font-medium ${cardStyle === style ? "text-white" : "text-gray-300"}`}>
                    {style}
                  </span>
                  {/* Custom Radio Button */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    cardStyle === style ? "border-white" : "border-gray-600"
                  }`}>
                    {cardStyle === style && (
                      <div className="w-3.5 h-3.5 rounded-full" style={{ background: selectedColor }}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ส่วนที่ 3: ขนาดตัวอักษร (Font Size) - ทำเป็น Slider ตามรูป */}
          <section>
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-6 rounded-full" style={{ background: selectedColor }}></div>
              ขนาดตัวอักษร (Font Size)
            </h3>
            <div className="glass-card p-6 rounded-2xl bg-black/20 border border-white/10">
              <div className="flex items-center gap-6">
                <span className="text-sm text-gray-400">A</span>
                <input 
                  type="range" 
                  min="12" 
                  max="24" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full accent-white cursor-pointer"
                  style={{ '--accent-color': selectedColor } as React.CSSProperties} // ส่งค่าสีไปใช้ใน CSS
                />
                <span className="text-2xl text-white">A</span>
              </div>
              <p className="text-center mt-4 text-gray-300" style={{ fontSize: `${fontSize}px` }}>
                ตัวอย่างขนาดตัวอักษร: {fontSize}px
              </p>
            </div>
          </section>

        </div>

        {/* ปุ่ม Action ด้านล่าง - ปรับให้โค้งมนและเด่นชัดตามรูป */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-center">
          <button 
            className="btn-save shadow-lg transform hover:scale-105 transition-all duration-300" 
            style={{ 
              width: '280px', 
              padding: '18px', 
              fontSize: '18px', 
              borderRadius: '40px',
              background: selectedColor, // ใช้สีหลักที่เลือกเป็นพื้นหลังปุ่ม
              color: '#000', // สีตัวอักษรบนปุ่มเป็นสีดำเพื่อให้ตัดกัน
              fontWeight: 'bold'
            }}
          >
            บันทึกการตั้งค่าธีม
          </button>
        </div>
      </div>
    </div>
  );
}