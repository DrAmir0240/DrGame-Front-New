"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Gamepad2,
  ChevronDown,
  ChevronLeft,
  Menu,
  X,
  WalletMinimal,
  Star,
  ShoppingCart,
  User,
  Headset,

} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";

const menuItems = [
  { label: "پنل کاربری", icon: User, path: "/profile" },
  { label: "کیف پول", icon: WalletMinimal , path: "/wallet" },
  { label: "علاقمندی ها", icon: Star, path: "wishlist" },
  { label: "سفارشات من", icon: ShoppingCart, path: "/orders" },
  { label: "پشتیبانی", icon: Headset , path: "/support" },
  // {
  //   label: "انبارداری",
  //   icon: Package,
  //   children: [
  //     { label: "کالاها", path: "/admin/inventory/products" },
  //     { label: "تامین‌کنندگان", path: "/admin/inventory/suppliers" },
  //     { label: "دسته‌بندی‌ها", path: "/admin/inventory/categories" },
  //     { label: "گردش انبار", path: "/admin/inventory/movements" },
  //   ],
  // },

];

function SidebarItem({ item, collapsed }: any) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const hasChildren = item.children?.length > 0;

  const isActive = item.path === pathname;

  const isChildActive =
    hasChildren && item.children.some((c: any) => c.path === pathname);

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
            "hover:bg-sidebar-accent",
            open || isChildActive
              ? "text-neutral-0 bg-[#211736]"
              : "text-sidebar-foreground/70",
          )}
        >
          <item.icon className="w-5 h-5 shrink-0" />

          {!collapsed && (
            <>
              <span className="flex-1 text-right">{item.label}</span>

              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  open && "rotate-180",
                )}
              />
            </>
          )}
        </button>

        {!collapsed && open && (
          <div className="mr-4 mt-1 space-y-0.5 border-r border-sidebar-border pr-3">
            {item.children.map((child: any) => (
              <Link
                key={child.path}
                href={child.path}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm transition-all",
                  "hover:bg-sidebar-accent",
                  pathname === child.path
                    ? "text-blue-600 bg-[#211736] font-medium"
                    : "text-sidebar-foreground/60",
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.path}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
        "hover:bg-[#211736]",
        isActive
          ? "text-blue-600 bg-[#211736] font-medium"
          : "text-sidebar-foreground/70",
      )}
    >
      <item.icon className="w-5 h-5 shrink-0" />

      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 right-3 z-50 md:hidden bg-card shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 right-0 h-screen bg-[#0B031C]   z-40 flex flex-col transition-all duration-300 border-l border-sidebar-border",
          collapsed ? "w-[70px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-4 flex items-center gap-3 border-b border-neutral-700 text-neutral-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <Gamepad2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>

          {!collapsed && (
            <div>
              <h1 className="font-bold text-sidebar-foreground text-base">
                دکترگیم
              </h1>
              <p className="text-xs text-neutral-400">
                سیستم مدیریت یکپارچه
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-hide  text-neutral-300">
          {menuItems.map((item, i) => (
            <SidebarItem key={i} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center p-3 border-t border-neutral-700 text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 transition-transform",
              collapsed && "rotate-180",
            )}
          />
        </button>
      </aside>
    </>
  );
};
