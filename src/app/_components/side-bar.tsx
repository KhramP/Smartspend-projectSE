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
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center px-2" : "",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className={cn("shrink-0", collapsed ? "size-5" : "size-4.5")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

function SectionLabel({ children, collapsed }: { children: React.ReactNode; collapsed?: boolean }) {
  if (collapsed) return null;
  return (
    <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">{children}</p>
  );
}

function SidebarInner({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { user, isLoading } = useUser();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className={cn("flex items-center gap-2 px-5 py-5", collapsed && "justify-center px-3")}>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          S
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight">SmartSpend</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          <SectionLabel collapsed={collapsed}>เมนูหลัก</SectionLabel>
          {MAIN_LINKS.map((link) => (
            <NavItem key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>

        <div className="space-y-1">
          <SectionLabel collapsed={collapsed}>
            <span className="flex items-center gap-1.5">
              พรีเมี่ยม
              <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">PRO</span>
            </span>
          </SectionLabel>
          {PREMIUM_LINKS.map((link) => (
            <NavItem key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>

        <div className="space-y-1">
          <SectionLabel collapsed={collapsed}>บัญชี</SectionLabel>
          {ACCOUNT_LINKS.map((link) => (
            <NavItem key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>
      </nav>

      {/* User section */}
      <div className="border-t border-border p-3">
        {isLoading ? (
          <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2", collapsed && "justify-center")}>
            <div className="size-9 animate-pulse rounded-full bg-muted" />
            {!collapsed && <div className="h-4 w-24 animate-pulse rounded bg-muted" />}
          </div>
        ) : !user ? (
          <Link href="/login" onClick={onNavigate}>
            <div
              className={cn(
                "flex items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
                collapsed && "px-2",
              )}
            >
              {collapsed ? "→" : "เข้าสู่ระบบ"}
            </div>
          </Link>
        ) : (
          <div className="space-y-2">
            <div className={cn("flex items-center gap-3 rounded-xl px-3 py-2", collapsed && "justify-center px-2")}>
              <Avatar className="size-9 shrink-0 ring-2 ring-border">
                <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
              </Avatar>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate">{user.name}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => authClient.signOut()}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10",
                collapsed && "justify-center px-2",
              )}
            >
              <LogOut className="size-4.5 shrink-0" />
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
        className="fixed top-4 left-4 z-40 flex items-center justify-center rounded-xl border border-border bg-background p-2 shadow-sm md:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="size-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          className="absolute right-3 top-5 rounded-lg p-1 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(false)}
        >
          <X className="size-5" />
        </button>
        <SidebarInner onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen sticky top-0 flex-col border-r border-border bg-background transition-all duration-300 ease-in-out",
          collapsed ? "w-18" : "w-64",
        )}
      >
        <SidebarInner collapsed={collapsed} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors hover:bg-muted"
        >
          {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
        </button>
      </aside>
    </>
  );
}
