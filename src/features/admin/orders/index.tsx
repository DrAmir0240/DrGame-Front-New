"use client";

import Link from "next/link";
import { Settings, Gamepad2, Package, Wrench } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui";

const sections = [
  {
    title: "کانفیگ سفارشات",
    description: "مدیریت دسته‌بندی‌ها، مراحل و اکشن‌ها",
    icon: Settings,
    href: "/admin/orders/config",
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "سفارشات اکانت سونی",
    description: "مشاهده و مدیریت سفارشات اکانت سونی",
    icon: Gamepad2,
    href: "/admin/orders/sony-account",
    color: "text-purple-600 bg-purple-50",
  },
  {
    title: "سفارشات کالا",
    description: "مشاهده و مدیریت سفارشات کالا",
    icon: Package,
    href: "/admin/orders/product",
    color: "text-green-600 bg-green-50",
  },
  {
    title: "سفارشات تعمیرات",
    description: "مشاهده و مدیریت سفارشات تعمیرات",
    icon: Wrench,
    href: "/admin/orders/repair",
    color: "text-amber-600 bg-amber-50",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="سفارش‌ها" description="مدیریت سفارشات و کانفیگ مراحل" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="hover:border-blue-200 hover:shadow-md transition-all cursor-pointer rounded-2xl">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${section.color}`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
