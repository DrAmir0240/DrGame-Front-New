"use client";

import { Activity, Crown, Gamepad2, History, Sparkles } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DataTable, DataTableColumn, StatCard } from "@/components/shared";
import { useSonyAccountsSummary, useSonyByRegion, useSonyByStatus, useTopUsedSonyAccounts } from "../apis";
import { formatPrice } from "@/utils/format";
import TrendBadge from "./TrendBadge";
import type { SonyByRegionItem, TopUsedSonyAccount, DateRange } from "../types";

const PIE_COLORS = ["#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#3b82f6", "#14b8a6"];

export default function SonyWidgets({ range }: { range: DateRange }) {
  const { data: summary } = useSonyAccountsSummary(range);
  const { data: byRegion = [] } = useSonyByRegion(range);
  const { data: byStatus = [], isLoading: byStatusLoading } = useSonyByStatus();
  const { data: topUsed = [] } = useTopUsedSonyAccounts();

  const regionColumns: DataTableColumn<SonyByRegionItem>[] = [
    {
      header: "ریجن",
      render: (r) => <span className="font-medium">{r.region_display ?? r.region}</span>,
    },
    { header: "تعداد", render: (r) => r.count.toLocaleString("fa-IR") },
    {
      header: "دارای Plus",
      render: (r) => (
        <span className="inline-flex rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-700 dark:bg-sky-500/15 dark:text-sky-400">
          {r.with_plus_count.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "میانگین قیمت",
      render: (r) => <span className="font-medium">{typeof r.avg_price === "number" ? formatPrice(r.avg_price) : r.avg_price}</span>,
    },
    { header: "سفارش این دوره", render: (r) => r.orders_in_period.toLocaleString("fa-IR") },
    { header: "تغییر", render: (r) => <TrendBadge change_pct={r.change_pct} /> },
  ];

  const topUsedRows: (TopUsedSonyAccount & { rank: number })[] = topUsed.map((a, i) => ({ ...a, rank: i + 1 }));

  const topUsedColumns: DataTableColumn<TopUsedSonyAccount & { rank: number }>[] = [
    {
      header: "#",
      render: (a) => (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-50 text-xs font-bold text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          {a.rank}
        </span>
      ),
    },
    {
      header: "نام کاربری",
      render: (a) => <span className="font-medium" dir="ltr">{a.username}</span>,
    },
    { header: "ریجن", render: (a) => a.region },
    {
      header: "Plus",
      render: (a) =>
        a.plus ? (
          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
            فعال
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: "وضعیت",
      render: (a) => (
        <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700/40 dark:text-neutral-300">
          {a.status_title}
        </span>
      ),
    },
    { header: "تعداد استفاده", render: (a) => a.use_count.toLocaleString("fa-IR") },
    {
      header: "قیمت",
      render: (a) => <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatPrice(a.price)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="کل اکانت‌ها"
          value={(summary?.current?.total_accounts ?? 0).toLocaleString("fa-IR")}
          icon={Gamepad2}
          className="border-violet-200 bg-violet-50/50"
        />
        <StatCard
          title="اکانت‌های فعال"
          value={(summary?.current?.active_accounts ?? 0).toLocaleString("fa-IR")}
          icon={Activity}
          className="border-emerald-200 bg-emerald-50/50"
        />
        <StatCard
          title="اکانت‌های Plus"
          value={(summary?.current?.accounts_with_plus ?? 0).toLocaleString("fa-IR")}
          icon={Crown}
          className="border-blue-200 bg-blue-50/50"
        />
        <StatCard
          title="اکانت جدید این دوره"
          value={(summary?.current?.new_accounts_in_period ?? 0).toLocaleString("fa-IR")}
          trend={summary?.change_pct?.new_accounts_in_period}
          icon={Sparkles}
          className="border-amber-200 bg-amber-50/50"
        />
        <StatCard
          title="اکانت‌های استفاده‌شده"
          value={(summary?.current?.accounts_used_in_period ?? 0).toLocaleString("fa-IR")}
          trend={summary?.change_pct?.accounts_used_in_period}
          icon={History}
          className="border-emerald-200 bg-emerald-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">تفکیک اکانت‌ها بر اساس ریجن</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={regionColumns} data={byRegion} emptyMessage="ریجن‌ای یافت نشد" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">وضعیت اکانت‌ها</CardTitle></CardHeader>
          <CardContent>
            {byStatus.length === 0 ? (
              <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-neutral-200 text-center text-sm text-muted-foreground">
                {byStatusLoading
                  ? "در حال بارگذاری…"
                  : "وضعیتی برای اکانت‌ها ثبت نشده است"}
              </div>
            ) : (
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byStatus.map((s) => ({
                        name: s.status_title,
                        value: s.count,
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {byStatus.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">پراستفاده‌ترین اکانت‌ها</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={topUsedColumns} data={topUsedRows} emptyMessage="اکانتی یافت نشد" />
        </CardContent>
      </Card>
    </div>
  );
}
