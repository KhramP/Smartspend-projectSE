"use client";

export function Navbar() {
  return (
    <div className="relative">
      <div className="top-0 z-30 h-[50px] md:h-[77px] w-full border-b border-border flex items-center justify-end px-4">
        <button className="add-transaction-btn">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M7 13l3 3 7-9" stroke="#fff" strokeWidth="2.5" />
          </svg>
          + เพิ่มรายการ
        </button>
      </div>
    </div>
  );
}
