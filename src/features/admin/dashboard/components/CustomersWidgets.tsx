"use client";

import { Activity, AlertCircle, UserPlus, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DataTable, DataTableColumn, StatCard } from "@/components/shared";
import { useCustomersSummary, useTopCustomersByRevenue, useNewCustomersByDay } from "../apis";
import { formatPrice } from "@/utils/format";
import type { TopCustomerByRevenue, DateRange } from "../types";

export default function CustomersWidgets({ range }: { range: DateRange }) {
  const { data: summary } = useCustomersSummary(range);
  const { data: topCustomers = [] } = useTopCustomersByRevenue();
  const { data: newByDay = [] } = useNewCustomersByDay(range);

  const topCustomerRows: (TopCustomerByRevenue & { rank: number })[] = topCustomers.map((c, i) => ({ ...c, rank: i + 1 }));

  const columns: DataTableColumn<TopCustomerByRevenue & { rank: number }>[] = [
    {
      header: "رتبه",
      render: (c) => (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
          {c.rank}
        </span>
      ),
    },
    {
      header: "مشتری",
      render: (c) => (
        <div>
          <span className="font-medium">{c.customer_name}</span>
          <span className="mr-2 text-xs text-muted-foreground" dir="ltr">{c.customer_phone}</span>
        </div>
      ),
    },
    {
      header: "درآمد",
      render: (c) => <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatPrice(c.total_revenue)}</span>,
    },
    { header: "سفارش", render: (c) => c.order_count.toLocaleString("fa-IR") },
    { header: "فاکتور", render: (c) => c.invoice_count.toLocaleString("fa-IR") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="کل مشتریان"
          value={(summary?.current?.total_customers ?? 0).toLocaleString("fa-IR")}
          icon={Users}
          className="border-blue-200 bg-blue-50/50"
        />
        <StatCard
          title="مشتریان جدید"
          value={(summary?.current?.new_customers_in_period ?? 0).toLocaleString("fa-IR")}
          trend={summary?.change_pct?.new_customers_in_period}
          icon={UserPlus}
          className="border-emerald-200 bg-emerald-50/50"
        />
        <StatCard
          title="مشتریان فعال"
          value={(summary?.current?.active_customers_in_period ?? 0).toLocaleString("fa-IR")}
          trend={summary?.change_pct?.active_customers_in_period}
          icon={Activity}
          className="border-violet-200 bg-violet-50/50"
        />
        <StatCard
          title="مشتریان بدهکار"
          value={(summary?.current?.customers_with_debt ?? 0).toLocaleString("fa-IR")}
          icon={AlertCircle}
          className="border-red-200 bg-red-50/50"
        />
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">مشتریان جدید (روزانه)</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={newByDay.map((d) => ({ date: d.date, تعداد: d.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="تعداد" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">مشتریان برتر بر اساس درآمد</CardTitle></CardHeader>
        <CardContent>
          <DataTable columns={columns} data={topCustomerRows} emptyMessage="مشتری‌ای یافت نشد" />
        </CardContent>
      </Card>
    </div>
  );
}
