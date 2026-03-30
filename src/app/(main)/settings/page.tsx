"use client";

const THEME_COLOR = "#2563be";
const BG_COLOR = "#f4f4f5";
const CARD_BG = "#ffffff";
const BORDER_COLOR = "#e4e4e7";
const TEXT_MAIN = "#09090b";
const TEXT_SUB = "#71717a";

export default function SettingsPage() {
  const cardStyle = {
    background: CARD_BG,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.05)",
  };

  const inputStyle = {
    width: "100%",
    background: BG_COLOR,
    border: `1px solid ${BORDER_COLOR}`,
    borderRadius: "12px",
    padding: "12px 16px",
    color: TEXT_MAIN,
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box" as const,
    marginTop: "8px",
  };

  return (
    <div style={{ padding: "40px", background: BG_COLOR, minHeight: "100vh", color: TEXT_MAIN, fontFamily: "inherit" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-1px" }}>การตั้งค่า</h1>
        <p style={{ color: TEXT_SUB, fontSize: "14px" }}>จัดการข้อมูลส่วนตัวและปรับแต่งการใช้งานแอปพลิเคชัน</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }}>
        {/* Profile Section */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "20px" }}>👤</span> จัดการโปรไฟล์
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "#f1f5f9",
                border: `2px dashed ${BORDER_COLOR}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
              }}
            >
              🙂
            </div>
            <div>
              <button
                style={{
                  padding: "10px 20px",
                  background: "#2563eb",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                เปลี่ยนรูปโปรไฟล์
              </button>
              <p style={{ color: TEXT_SUB, fontSize: "12px" }}>รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {[
              { label: "ชื่อแสดงผล", value: "John K.", type: "text" },
              { label: "อีเมล", value: "john@example.com", type: "email" },
            ].map((f) => (
              <div key={f.label}>
                <label
                  style={{
                    color: TEXT_SUB,
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  {f.label}
                </label>
                <input defaultValue={f.value} type={f.type} style={inputStyle} />
              </div>
            ))}
          </div>
        </div>

        {/* System Preferences Section */}
        <div style={cardStyle}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "20px" }}>⚙️</span> การตั้งค่าระบบ
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Notification Toggle */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                background: BG_COLOR,
                borderRadius: "16px",
                border: `1px solid ${BORDER_COLOR}`,
              }}
            >
              <div>
                <p style={{ fontSize: "15px", fontWeight: 600 }}>แจ้งเตือนเมื่อใช้จ่ายเกินงบ</p>
                <p style={{ color: TEXT_SUB, fontSize: "13px" }}>รับการแจ้งเตือนเมื่อใช้เกิน 80% ของงบที่ตั้งไว้</p>
              </div>
              <div
                style={{
                  width: "48px",
                  height: "26px",
                  background: THEME_COLOR,
                  borderRadius: "20px",
                  position: "relative",
                  cursor: "pointer",
                  boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: "4px",
                    top: "4px",
                    width: "18px",
                    height: "18px",
                    background: "#000",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </div>

            {/* Currency Select */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                background: BG_COLOR,
                borderRadius: "16px",
                border: `1px solid ${BORDER_COLOR}`,
              }}
            >
              <div>
                <p style={{ fontSize: "15px", fontWeight: 600 }}>สกุลเงินหลัก</p>
                <p style={{ color: TEXT_SUB, fontSize: "13px" }}>สกุลเงินที่ใช้แสดงผลทั่วทั้งแอปพลิเคชัน</p>
              </div>
              <select
                style={{
                  background: "#fff",
                  border: `1px solid ${BORDER_COLOR}`,
                  borderRadius: "10px",
                  padding: "10px 16px",
                  color: TEXT_MAIN,
                  fontSize: "14px",
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option>บาท (THB)</option>
                <option>ดอลลาร์ (USD)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
          <button
            style={{
              flex: 2,
              padding: "18px",
              background: "#2563eb",
              border: "none",
              borderRadius: "16px",
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            บันทึกการเปลี่ยนแปลง
          </button>
          <button
            style={{
              flex: 1,
              padding: "18px",
              background: "transparent",
              border: `1px solid ${BORDER_COLOR}`,
              borderRadius: "16px",
              color: TEXT_SUB,
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            รีเซ็ตเป็นค่าเริ่มต้น
          </button>
        </div>

        {/* Danger Zone */}
        <div style={{ marginTop: "16px", padding: "20px", textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            ลบบัญชีและข้อมูลทั้งหมด
          </p>
        </div>
      </div>
    </div>
  );
}
