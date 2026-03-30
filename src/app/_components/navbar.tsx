"use client";

import { useState } from "react";
import { AddTransactionModal } from "./add-transaction-form";

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      <div className="top-0 z-30 h-[50px] md:h-[77px] w-full bg-zinc-100 border-b border-border flex items-center justify-end px-4 pl-14 md:pl-4">
        <button
          className="flex items-center gap-2 rounded-xl border-none bg-blue-700 px-3 py-2.5 sm:px-5 sm:py-3.5 text-sm sm:text-base font-semibold text-white cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            width="20"
            height="20"
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
          เพิ่มรายการ
        </button>
      </div>
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
