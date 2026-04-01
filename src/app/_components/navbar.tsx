"use client";

import { useState } from "react";
import { AddTransactionModal } from "./add-transaction-form";
import "@/app/_components/GlobalLayout.css";

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      <div
        className="top-0 z-30 h-[56px] md:h-[64px] w-full flex items-center justify-end px-4 sm:px-6 pl-14 md:pl-6 border-b border-[var(--glass-border)]"
        style={{ background: "rgba(10, 10, 10, 0.6)", backdropFilter: "blur(20px)" }}
      >
        <button
          className="add-transaction-btn !rounded-[20px] !py-2.5 !px-5 text-sm font-semibold text-black hover:brightness-110 transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">เพิ่มรายการ</span>
        </button>
      </div>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
