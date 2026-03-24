"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useUser } from "@/utils/user-global";
import { BarChart, Book, BookCopy, LogOut, LucideIcon, User, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_LINKS = [
  { href: "/overview", icon: BarChart, label: "ภาพรวม" },
  { href: "/expenses", icon: Book, label: "รายการใช้จ่าย" },
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
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}) {
  const isActive = usePathname() === href;

  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn("w-full justify-start gap-3", isActive && "bg-brand/20 text-brand")}
      asChild
      onClick={onClick}
    >
      <Link href={href}>
        <Icon className="size-5" />
        {label}
      </Link>
    </Button>
  );
}

export function SSideBar() {
  const { user, isLoading } = useUser();

  return (
    <aside className="flex h-screen sticky top-0 w-64 flex-col border-r bg-muted/40">
      <div className="p-6 text-center">
        <Link href="/" className="font-bold text-xl">
          Logo
        </Link>
      </div>

      <Separator />

      <nav className="flex-1 space-y-1 p-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">เมนูหลัก</p>
          {SIDEBAR_LINKS.map((link) => (
            <SidebarLink key={link.href} {...link} />
          ))}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">เมนูพรีเมี่ยม</p>
          {PREMIUM_SIDEBAR_LINKS.map((link) => (
            <SidebarLink key={link.href} {...link} />
          ))}
        </div>
      </nav>

      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground px-3 mb-2">บัญชี</p>
        <SidebarLink href="/theme" icon={User} label="ธีม" />
        <SidebarLink href="/settings" icon={Wallet} label="ตั้งค่า" />
        <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => authClient.signOut()}>
          <LogOut className="size-5" />
          ล็อกเอาท์
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-muted-foreground border-t">
        {isLoading ? null : !user ? (
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        ) : (
          <div className="flex flex-row justify-center items-center gap-5">
            <Avatar className="w-12 h-12">
              <AvatarImage src={"/images/default-avatar.png"} alt="Default Avatar" />
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-lg">{user?.name}</span>
              <span className="text-lg">Free Plan</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
