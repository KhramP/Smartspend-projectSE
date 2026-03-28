"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useUser } from "@/utils/user-global";
import { BarChart, Book, BookCopy, LogOut, LucideIcon, Menu, User, Wallet, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SIDEBAR_LINKS = [
  { href: "/", icon: BarChart, label: "ภาพรวม" },
  { href: "/transaction", icon: Book, label: "รายการใช้จ่าย" },
  { href: "/category", icon: BookCopy, label: "หมวดหมู่" },
] as const;

const PREMIUM_SIDEBAR_LINKS = [
  { href: "/analyse", icon: BarChart, label: "วิเคราะห์เชิงลึก" },
  { href: "/budget", icon: Book, label: "งบประมาณ" },
  { href: "/tax", icon: BookCopy, label: "คำนวณภาษี" },
  { href: "/history", icon: BookCopy, label: "ย้อนหลัง 2 ปี" },
] as const;

function SidebarLink({
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
  const isActive = usePathname() === href;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full gap-3",
        collapsed ? "justify-center px-2" : "justify-start",
        isActive && "bg-primary/10 text-primary",
      )}
      asChild
      onClick={onClick}
    >
      <Link href={href} title={collapsed ? label : undefined}>
        <Icon className="size-5 shrink-0" />
        {!collapsed && <span>{label}</span>}
      </Link>
    </Button>
  );
}

function SidebarContent({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { user, isLoading } = useUser();

  return (
    <>
      {/* Logo */}
      <div className={cn("p-6", collapsed ? "text-center px-3" : "text-center")}>
        <Link href="/" className="font-bold text-xl" onClick={onNavigate}>
          {collapsed ? "S" : "SmartSpend"}
        </Link>
      </div>

      <Separator />

      {/* Nav links */}
      <nav className="flex-1 space-y-1 p-3">
        <div>
          {!collapsed && <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">เมนูหลัก</p>}
          {SIDEBAR_LINKS.map((link) => (
            <SidebarLink key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>

        <div className="mt-8">
          {!collapsed && <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">พรีเมี่ยม</p>}
          {PREMIUM_SIDEBAR_LINKS.map((link) => (
            <SidebarLink key={link.href} {...link} collapsed={collapsed} onClick={onNavigate} />
          ))}
        </div>
      </nav>

      {/* Account section */}
      {user && (
        <div className="p-3">
          {!collapsed && <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">บัญชี</p>}
          <SidebarLink href="/theme" icon={User} label="ธีม" collapsed={collapsed} onClick={onNavigate} />
          <SidebarLink href="/settings" icon={Wallet} label="ตั้งค่า" collapsed={collapsed} onClick={onNavigate} />
          <Button
            variant="ghost"
            className={cn("w-full gap-3", collapsed ? "justify-center px-2" : "justify-start")}
            onClick={() => authClient.signOut()}
          >
            <LogOut className="size-5 shrink-0" />
            {!collapsed && <span>ล็อกเอาท์</span>}
          </Button>
        </div>
      )}

      {/* User profile footer */}
      <div className="border-t p-3">
        {isLoading ? null : !user ? (
          <div className={cn(collapsed ? "text-center" : "text-center")}>
            <Link href="/login" onClick={onNavigate}>
              <Button variant="outline" size="sm" className={collapsed ? "w-full px-2" : ""}>
                {collapsed ? <User className="size-4" /> : "Sign In"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "px-2")}>
            <Avatar className="size-9 shrink-0">
              <AvatarImage src="/images/default-avatar.png" alt="Avatar" />
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground">Free Plan</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export function SSideBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile drawer on route change during the render phase
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-50 flex items-center justify-center rounded-lg border border-border bg-background p-2 shadow-md md:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="size-5" />
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
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <button
          className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="size-5" />
        </button>
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-screen sticky top-0 w-64 flex-col border-r bg-muted/40">
        <SidebarContent />
      </aside>
    </>
  );
}
