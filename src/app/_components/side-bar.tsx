"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useUser } from "@/utils/user-global";
import {
  BarChart3,
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Menu,
  Palette,
  PiggyBank,
  Settings,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import "@/app/_components/GlobalLayout.css";

const MAIN_LINKS = [
  { href: "/", icon: LayoutDashboard, label: "ภาพรวม" },
  { href: "/transaction", icon: BookOpen, label: "รายการใช้จ่าย" },
  { href: "/category", icon: FolderOpen, label: "หมวดหมู่" },
] as const;

const PREMIUM_LINKS = [
  { href: "/analyse", icon: BarChart3, label: "วิเคราะห์เชิงลึก" },
  { href: "/budget", icon: PiggyBank, label: "งบประมาณ" },
  { href: "/tax", icon: Calculator, label: "คำนวนภาษี" },
  { href: "/history", icon: Clock, label: "ย้อนหลัง 2 ปี" },
] as const;

const ACCOUNT_LINKS = [
  { href: "/theme", icon: Palette, label: "ธีม" },
  { href: "/settings", icon: Settings, label: "ตั้งค่า" },
] as const;

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onClick}
      className={cn(
        "menu-item group justify-start! mb-2! gap-3 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center! px-2!" : "",
        isActive ? "active" : "",
      )}
    >
      <Icon className={cn("shrink-0", collapsed ? "size-5" : "size-[18px]")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return null;
  return (
    <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-text)]">{children}</p>
  );
}

function SidebarInner({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { user, isLoading } = useUser();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn("logo-section !flex-row gap-3 !mb-6 px-2 pt-6", collapsed && "!justify-center")}>
        <svg className="logo-icon !mb-0" width="32" height="32" viewBox="0 0 40 40" fill="none">
          <rect width="40" height="40" rx="12" fill="var(--accent-green)" />
          <text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="20"
            fontWeight="700"
            fill="#000"
          >
            S
          </text>
        </svg>
        {!collapsed && <span className="text-lg font-bold text-white tracking-tight">SmartSpend</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-6">
        <div>
          <SectionLabel collapsed={collapsed}>เมนูหลัก</SectionLabel>
          {MAIN_LINKS.map((link) => (
            <NavItem key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>

        <div>
          <SectionLabel collapsed={collapsed}>
            <span className="flex items-center gap-1.5">
              พรีเมี่ยม
              <span className="rounded-full bg-[var(--accent-gold)]/20 px-1.5 py-0.5 text-[9px] font-bold text-[var(--accent-gold)]">
                PRO
              </span>
            </span>
          </SectionLabel>
          {PREMIUM_LINKS.map((link) => (
            <NavItem key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>

        <div>
          <SectionLabel collapsed={collapsed}>บัญชี</SectionLabel>
          {ACCOUNT_LINKS.map((link) => (
            <NavItem key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-[var(--glass-border)] p-3 mt-auto">
        {isLoading ? (
          <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2", collapsed && "justify-center")}>
            <div className="size-9 animate-pulse rounded-full bg-white/10" />
            {!collapsed && <div className="h-4 w-24 animate-pulse rounded bg-white/10" />}
          </div>
        ) : !user ? (
          <Link href="/login" onClick={onNavigate}>
            <div
              className={cn(
                "flex items-center justify-center rounded-[20px] bg-[var(--accent-green)] px-3 py-2.5 text-sm font-semibold text-black transition-all hover:brightness-110",
                collapsed && "px-2",
              )}
            >
              {collapsed ? "→" : "เข้าสู่ระบบ"}
            </div>
          </Link>
        ) : (
          <div className="space-y-2">
            <div className={cn("user-profile-box", collapsed && "!justify-center !px-2 !gap-0")}>
              <Avatar className="user-avatar size-9 shrink-0">
                <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
              </Avatar>
              {!collapsed && (
                <div className="user-details min-w-0">
                  <span className="user-name truncate">{user.name}</span>
                  <span className="user-plan truncate">{user.email}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => authClient.signOut()}
              className={cn(
                "flex w-full items-center gap-3 rounded-[20px] px-3 py-2 text-sm font-medium text-red-400 border border-transparent transition-all hover:border-red-500/30 hover:bg-red-500/10",
                collapsed && "justify-center px-2",
              )}
            >
              <LogOut className="size-[18px] shrink-0" />
              {!collapsed && <span>ออกจากระบบ</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SSideBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-4 left-4 z-40 flex items-center justify-center rounded-xl border border-[var(--glass-border)] bg-black/40 backdrop-blur-md p-2 shadow-lg md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5 text-white" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[var(--glass-border)] transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ background: "var(--sidebar-gradient)" }}
      >
        <button
          className="absolute right-3 top-5 rounded-lg p-1 text-gray-400 hover:text-white transition"
          onClick={() => setMobileOpen(false)}
        >
          <X className="size-5" />
        </button>
        <SidebarInner onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen sticky top-0 flex-col border-r border-[var(--glass-border)] transition-all duration-300 ease-in-out relative",
          collapsed ? "w-[72px]" : "w-[240px]",
        )}
        style={{ background: "var(--sidebar-gradient)" }}
      >
        <SidebarInner collapsed={collapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 z-10 flex size-6 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[#1a1a1a] shadow-md transition-colors hover:bg-white/10"
        >
          {collapsed ? (
            <ChevronRight className="size-3.5 text-gray-400" />
          ) : (
            <ChevronLeft className="size-3.5 text-gray-400" />
          )}
        </button>
      </aside>
    </>
  );
}
