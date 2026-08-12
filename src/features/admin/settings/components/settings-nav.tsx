"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const SETTINGS_SECTIONS = [
  { href: "/admin/settings", label: "نمای کلی", exact: true },
  { href: "/admin/settings/permissions", label: "پرمیشن‌ها" },
  { href: "/admin/settings/roles", label: "نقش‌ها" },
  { href: "/admin/settings/employee-roles", label: "نقش‌های کارمند" },
  { href: "/admin/settings/sony-order-categories", label: "دسته‌بندی سونی" },
  { href: "/admin/settings/sell-methods", label: "روش‌های فروش" },
  { href: "/admin/settings/product-order-categories", label: "دسته‌بندی کالا" },
  { href: "/admin/settings/repair-order-categories", label: "دسته‌بندی تعمیر" },
  { href: "/admin/settings/sony-banks", label: "بانک‌های سونی" },
  { href: "/admin/settings/bank-accounts", label: "حساب‌های بانکی" },
  { href: "/admin/settings/invoice-categories", label: "دسته‌بندی فاکتور" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-neutral-200 bg-card p-2 dark:border-neutral-700">
      {SETTINGS_SECTIONS.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-background"
                : "text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
