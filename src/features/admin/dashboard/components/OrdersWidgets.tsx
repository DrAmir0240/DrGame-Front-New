"use client";

import { Gamepad2, LayoutDashboard, Package, Wrench } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DataTable, DataTableColumn, StatCard } from "@/components/shared";
import { useOrdersSummary, useOrdersByDay, useSonyByCategory, useSonyBySource, useProductByCategory, useProductBySource, useRepairByCategory, useRepairBySource } from "../apis";
import { formatPrice } from "@/utils/format";
import TrendBadge from "./TrendBadge";
import type { SonyByCategoryItem, SonyBySourceItem, RepairByCategoryItem, RepairBySourceItem, ProductByCategoryItem, ProductBySourceItem, DateRange } from "../types";
import type { LucideIcon } from "lucide-react";

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ef4444", "#6366f1", "#14b8a6", "#f43f5e"];

const TYPE_BADGE: Record<string, { label: string; className: string }> = {
  rent: { label: "اجاره", className: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" },
  buy: { label: "خرید", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
};

const SOURCE_BADGE: Record<string, { label?: string; className: string }> = {
  website: { className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400" },
  telegram: { className: "bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400" },
  in_person: { className: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  online: { className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
};

function SourceBadge({ source, label }: { source: string; label: string }) {
  const cfg = SOURCE_BADGE[source];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg?.className ?? "bg-neutral-100 text-muted-foreground"}`}>
      {label}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_BADGE[type];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg?.className ?? "bg-neutral-100 text-muted-foreground"}`}>
      {cfg?.label ?? type}
    </span>
  );
}

export default function OrdersWidgets({ range }: { range: DateRange }) {
  const { data: summary } = useOrdersSummary(range);
  const { data: byDay = [] } = useOrdersByDay(range);
  const { data: sonyByCat = [] } = useSonyByCategory(range);
  const { data: sonyBySource = [] } = useSonyBySource(range);
  const { data: productByCat = [] } = useProductByCategory(range);
  const { data: productBySource = [] } = useProductBySource(range);
  const { data: repairByCat = [] } = useRepairByCategory(range);
  const { data: repairBySource = [] } = useRepairBySource(range);

  const orderCards: { key: "sony_account" | "repair" | "product" | "total"; label: string; icon: LucideIcon; className: string }[] = [
    { key: "sony_account", label: "اکانت سونی", icon: Gamepad2, className: "border-blue-200 bg-blue-50/50" },
    { key: "repair", label: "تعمیرات", icon: Wrench, className: "border-amber-200 bg-amber-50/50" },
    { key: "product", label: "کالا", icon: Package, className: "border-emerald-200 bg-emerald-50/50" },
    { key: "total", label: "مجموع", icon: LayoutDashboard, className: "border-violet-200 bg-violet-50/50" },
  ];

  const sonyCatPie = sonyByCat.map((d) => ({ name: d.category_title, value: d.current_count }));

  const sonyCatColumns: DataTableColumn<SonyByCategoryItem>[] = [
    {
      header: "دسته‌بندی",
      render: (d) => <span className="font-medium">{d.category_title}</span>,
    },
    { header: "نوع", render: (d) => <TypeBadge type={d.category_type} /> },
    { header: "تعداد", render: (d) => d.current_count.toLocaleString("fa-IR") },
    {
      header: "مبلغ",
      render: (d) => <span className="font-medium">{formatPrice(d.current_amount)}</span>,
    },
    { header: "تغییر", render: (d) => <TrendBadge change_pct={d.change_pct} /> },
  ];

  const sourceColumns: DataTableColumn<SonyBySourceItem>[] = [
    { header: "منبع", render: (d) => <SourceBadge source={d.source} label={d.source_display} /> },
    { header: "تعداد", render: (d) => d.current_count.toLocaleString("fa-IR") },
    { header: "مبلغ", render: (d) => <span className="font-medium">{formatPrice(d.current_amount)}</span> },
    { header: "تغییر", render: (d) => <TrendBadge change_pct={d.change_pct} /> },
  ];

  const repairCatColumns: DataTableColumn<RepairByCategoryItem>[] = [
    {
      header: "دسته",
      render: (d) => <span className="font-medium">{d.category_title}</span>,
    },
    { header: "تعداد", render: (d) => d.current_count.toLocaleString("fa-IR") },
    {
      header: "هزینه تعمیر",
      render: (d) => <span className="text-amber-600 dark:text-amber-400">{formatPrice(d.current_repair_fee)}</span>,
    },
    {
      header: "مبلغ نهایی",
      render: (d) => <span className="font-medium">{formatPrice(d.current_final_amount)}</span>,
    },
    { header: "تغییر", render: (d) => <TrendBadge change_pct={d.change_pct} /> },
  ];

  const repairSourceColumns: DataTableColumn<RepairBySourceItem>[] = [
    { header: "منبع", render: (d) => <SourceBadge source={d.source} label={d.source_display} /> },
    { header: "تعداد", render: (d) => d.current_count.toLocaleString("fa-IR") },
    { header: "تغییر", render: (d) => <TrendBadge change_pct={d.change_pct} /> },
  ];

  const productCatColumns: DataTableColumn<ProductByCategoryItem>[] = [
    {
      header: "دسته",
      render: (d) => <span className="font-medium">{d.category_title}</span>,
    },
    { header: "تعداد", render: (d) => d.current_count.toLocaleString("fa-IR") },
    {
      header: "مبلغ",
      render: (d) => <span className="font-medium">{formatPrice(d.current_amount)}</span>,
    },
    { header: "تغییر", render: (d) => <TrendBadge change_pct={d.change_pct} /> },
  ];

  const productSourceColumns: DataTableColumn<ProductBySourceItem>[] = [
    { header: "منبع", render: (d) => <SourceBadge source={d.source} label={d.source_display} /> },
    { header: "تعداد", render: (d) => d.current_count.toLocaleString("fa-IR") },
    { header: "تغییر", render: (d) => <TrendBadge change_pct={d.change_pct} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {orderCards.map(({ key, label, icon, className }) => {
          const m = summary?.[key];
          return (
            <StatCard
              key={key}
              title={label}
              value={`${(m?.count ?? 0).toLocaleString("fa-IR")} سفارش`}
              trend={m?.change_pct ?? null}
              trendLabel={formatPrice(m?.amount ?? 0)}
              icon={icon}
              className={className}
            />
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">سفارش‌های روزانه</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byDay.map((d) => ({ date: d.date, "اکانت سونی": d.sony_count, تعمیر: d.repair_count, کالا: d.product_count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="اکانت سونی" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="تعمیر" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="کالا" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">سفارش اکانت سونی — تفکیک دسته‌بندی</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DataTable columns={sonyCatColumns} data={sonyByCat} emptyMessage="دسته‌بندی وجود ندارد" />
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sonyCatPie} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={3} dataKey="value">
                    {sonyCatPie.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">سفارش اکانت سونی — منبع</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={sourceColumns} data={sonyBySource} emptyMessage="منبعی یافت نشد" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">سفارش تعمیر — دسته‌بندی</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={repairCatColumns} data={repairByCat} emptyMessage="دسته‌بندی وجود ندارد" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">سفارش تعمیر — منبع</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={repairSourceColumns} data={repairBySource} emptyMessage="منبعی یافت نشد" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">سفارش کالا — دسته‌بندی</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={productCatColumns} data={productByCat} emptyMessage="دسته‌بندی وجود ندارد" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">سفارش کالا — منبع</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={productSourceColumns} data={productBySource} emptyMessage="منبعی یافت نشد" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}