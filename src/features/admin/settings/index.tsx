"use client";

import Link from "next/link";
import { Settings2, KeyRound, ShieldCheck, Users2, Gamepad2, BadgePercent, Boxes, Wrench, Landmark, Banknote, ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { SettingsNav } from "./components/settings-nav";

const SECTIONS = [
  { href: "/admin/settings/permissions", icon: KeyRound, title: "پرمیشن‌ها", description: "لیست دسترسی‌های سیستم به تفکیک ماژول و اکشن" },
  { href: "/admin/settings/roles", icon: ShieldCheck, title: "نقش‌ها", description: "مدیریت نقش‌ها و پرمیشن‌های مرتبط" },
  { href: "/admin/settings/employee-roles", icon: Users2, title: "نقش‌های کارمند", description: "اختصاص نقش به کارمندان" },
  { href: "/admin/settings/sony-order-categories", icon: Gamepad2, title: "دسته‌بندی سفارش سونی", description: "مدیریت دسته‌بندی‌های خرید/اجاره اکانت سونی" },
  { href: "/admin/settings/sell-methods", icon: BadgePercent, title: "روش‌های فروش", description: "روش‌های فروش مرتبط با دسته‌بندی‌ها" },
  { href: "/admin/settings/product-order-categories", icon: Boxes, title: "دسته‌بندی کالا", description: "دسته‌بندی سفارشات کالا" },
  { href: "/admin/settings/repair-order-categories", icon: Wrench, title: "دسته‌بندی تعمیر", description: "دسته‌بندی سفارشات تعمیر" },
  { href: "/admin/settings/sony-banks", icon: Landmark, title: "بانک‌های سونی", description: "بانک‌های قابل استفاده در اکانت‌های سونی" },
  { href: "/admin/settings/bank-accounts", icon: Banknote, title: "حساب‌های بانکی", description: "حساب‌های بانکی شرکت" },
  { href: "/admin/settings/invoice-categories", icon: ReceiptText, title: "دسته‌بندی فاکتور", description: "دسته‌بندی فاکتورهای ورودی و خروجی" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="تنظیمات پلتفرم" description="مدیریت پرمیشن‌ها، نقش‌ها و تنظیمات دسته‌بندی‌ها" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5 text-primary" />
                  {title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-muted-foreground dark:border-neutral-700">
        <Settings2 className="h-4 w-4" />
        برای مدیریت هر بخش از منوی بالا یا کارت‌های بالا استفاده کنید.
      </div>
    </div>
  );
}
