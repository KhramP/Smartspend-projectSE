"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Calculator,
  Check,
  Clock,
  Crown,
  FolderOpen,
  LayoutDashboard,
  Lock,
  Palette,
  PiggyBank,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import "@/app/_components/GlobalLayout.css";

const FREE_PERKS = [
  { icon: LayoutDashboard, label: "ภาพรวมรายรับ-รายจ่าย" },
  { icon: BookOpen, label: "บันทึกรายการใช้จ่าย" },
  { icon: FolderOpen, label: "ดูหมวดหมู่การใช้จ่าย" },
  { icon: Palette, label: "เปลี่ยนธีมสี" },
  { icon: Settings, label: "ตั้งค่าโปรไฟล์" },
];

const PREMIUM_PERKS = [
  { icon: BarChart3, label: "วิเคราะห์เชิงลึก: กราฟ, แนวโน้ม, Insight" },
  { icon: PiggyBank, label: "ตั้งงบประมาณ: จัดการงบรายหมวดหมู่" },
  { icon: Calculator, label: "คำนวนภาษี: คำนวณภาษีอัตโนมัติ" },
  { icon: Clock, label: "ย้อนหลัง 2 ปี: ดาวน์โหลด CSV / PDF" },
];

export function PremiumClient({ isPro }: { isPro: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 flex flex-col items-center">
      {/* Success / Canceled banners */}
      {success && (
        <div className="w-full max-w-3xl mb-6 p-4 rounded-2xl border border-green-500/30 bg-green-500/10 flex items-center gap-3">
          <Check className="size-5 text-green-400 shrink-0" />
          <p className="text-green-300 text-sm font-medium">ชำระเงินสำเร็จ! คุณเป็นสมาชิก Premium แล้ว 🎉</p>
          <button onClick={() => router.replace("/premium")} className="ml-auto text-green-400 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      )}
      {canceled && (
        <div className="w-full max-w-3xl mb-6 p-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 flex items-center gap-3">
          <X className="size-5 text-yellow-400 shrink-0" />
          <p className="text-yellow-300 text-sm font-medium">การชำระเงินถูกยกเลิก คุณสามารถลองอีกครั้งได้</p>
          <button onClick={() => router.replace("/premium")} className="ml-auto text-yellow-400 hover:text-white">
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 mb-4">
          <Crown className="size-4 text-[var(--accent-gold)]" />
          <span className="text-sm font-bold text-[var(--accent-gold)]">PREMIUM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">อัปเกรดเป็น Premium</h1>
        <p className="text-gray-400 max-w-lg mx-auto">ปลดล็อกเครื่องมือทั้งหมดเพื่อจัดการการเงินของคุณอย่างมืออาชีพ</p>
      </div>

      {/* Plans comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-10">
        {/* Free Plan */}
        <div className="glass-card p-6 md:p-8 border-gray-700 flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center">
              <Sparkles className="size-5 text-gray-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ฟรี</h3>
              <p className="text-xs text-gray-400">สมาชิกพื้นฐาน</p>
            </div>
          </div>
          <div className="mb-6">
            <span className="text-3xl font-bold text-white">฿0</span>
            <span className="text-gray-400 text-sm ml-1">/ ตลอดชีพ</span>
          </div>
          <div className="space-y-3">
            {FREE_PERKS.map((perk) => (
              <div key={perk.label} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
                  <Check className="size-3.5 text-gray-400" />
                </div>
                <span className="text-sm text-gray-300">{perk.label}</span>
              </div>
            ))}
            {/* {PREMIUM_PERKS.map((perk) => (
              <div key={perk.label} className="flex items-center gap-3 opacity-40">
                <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                  <Lock className="size-3 text-gray-500" />
                </div>
                <span className="text-sm text-gray-500 line-through">{perk.label.split(" — ")[0]}</span>
              </div>
            ))} */}
          </div>
          <div className="mt-auto pt-8">
            <div className="w-full py-3 rounded-xl text-center text-sm font-medium text-gray-400 border border-gray-600 bg-black/20">
              แผนปัจจุบัน
            </div>
          </div>
        </div>

        {/* Premium Plan */}
        <div className="glass-card p-6 md:p-8 relative overflow-hidden border-[var(--accent-gold)]/30 shadow-[0_0_30px_rgba(255,215,0,0.08)] flex flex-col">
          {/* Glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent-gold)]/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-gold)]/20 flex items-center justify-center">
                <Crown className="size-5 text-[var(--accent-gold)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Premium</h3>
                <p className="text-xs text-[var(--accent-gold)]">ปลดล็อกทุกฟีเจอร์</p>
              </div>
              {isPro && (
                <span className="ml-auto px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs font-bold text-green-400">
                  ACTIVE
                </span>
              )}
            </div>
            <div className="mb-6">
              <span className="text-3xl font-bold text-white">฿350</span>
              <span className="text-gray-400 text-sm ml-1">/ ครั้งเดียว</span>
              <span className="block text-xs text-gray-500 mt-1">≈ $10 USD</span>
            </div>
            <div className="space-y-3">
              {FREE_PERKS.map((perk) => (
                <div key={perk.label} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-green)]/20 flex items-center justify-center shrink-0">
                    <Check className="size-3.5 text-[var(--accent-green)]" />
                  </div>
                  <span className="text-sm text-gray-300">{perk.label}</span>
                </div>
              ))}
              {PREMIUM_PERKS.map((perk) => (
                <div key={perk.label} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center shrink-0">
                    <Crown className="size-3.5 text-[var(--accent-gold)]" />
                  </div>
                  <span className="text-sm text-white font-medium">{perk.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-8">
              {isPro ? (
                <div className="w-full py-3 rounded-xl text-center text-sm font-bold text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/10">
                  ✓ คุณเป็นสมาชิก Premium แล้ว
                </div>
              ) : (
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-black bg-[var(--accent-gold)] hover:brightness-110 transition-all duration-200 shadow-[0_0_20px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "กำลังเตรียมการชำระเงิน..." : "สมัคร Premium"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment info */}
      {!isPro && (
        <div className="glass-card p-6 w-full max-w-3xl text-center">
          <p className="text-gray-400 text-sm">
            💳 ชำระเงินผ่าน <span className="text-white font-medium">PromptPay QR Code</span> ผ่าน Stripe
          </p>
          <p className="text-gray-500 text-xs mt-2">
            ปลอดภัย 100% ระบบจะเปิดใช้งาน Premium ให้อัตโนมัติหลังชำระเงินสำเร็จ
          </p>
        </div>
      )}
    </div>
  );
}
