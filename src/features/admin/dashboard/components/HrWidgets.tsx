"use client";

import { Banknote, FileText, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DataTable, DataTableColumn, StatCard } from "@/components/shared";
import { useCommissionSummary, usePayrollSummary, useOrderActions } from "../apis";
import { formatPrice } from "@/utils/format";
import TrendBadge from "./TrendBadge";
import type { CommissionSummaryItem, OrderActionItem, DateRange } from "../types";

export default function HrWidgets({ range }: { range: DateRange }) {
  const { data: commissions = [] } = useCommissionSummary();
  const { data: payroll } = usePayrollSummary(range);
  const { data: orderActions = [] } = useOrderActions();

  const commissionColumns: DataTableColumn<CommissionSummaryItem>[] = [
    {
      header: "کارمند",
      render: (c) => <span className="font-medium">{c.employee_name}</span>,
    },
    {
      header: "تسویه‌شده",
      render: (c) => <span className="font-medium text-emerald-600 dark:text-emerald-400">{formatPrice(c.settled_commission)}</span>,
    },
    {
      header: "تسویه‌نشده",
      render: (c) =>
        c.unsettled_commission > 0 ? (
          <span className="font-medium text-amber-600 dark:text-amber-400">{formatPrice(c.unsettled_commission)}</span>
        ) : (
          <span className="text-muted-foreground">{formatPrice(c.unsettled_commission)}</span>
        ),
    },
    { header: "تغییر", render: (c) => <TrendBadge change_pct={c.change_pct} /> },
  ];

  const actionColumns: DataTableColumn<OrderActionItem>[] = [
    {
      header: "کارمند",
      render: (a) => <span className="font-medium">{a.employee_name}</span>,
    },
    {
      header: "سون",
      render: (a) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-500/15 dark:text-blue-400">
          {a.sony_action_count.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "تعمیر",
      render: (a) => (
        <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
          {a.repair_action_count.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "کالا",
      render: (a) => (
        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
          {a.product_action_count.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "مجموع",
      render: (a) => <span className="font-bold">{a.total_count.toLocaleString("fa-IR")}</span>,
    },
    { header: "تغییر", render: (a) => <TrendBadge change_pct={a.change_pct} /> },
  ];

  return (
    <div className="space-y-6">
     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="فیش‌های حقوقی"
          value={`${(payroll?.current?.payroll_count ?? 0).toLocaleString("fa-IR")} فیش`}
          trend={payroll?.change_pct?.payroll_count}
          icon={FileText}
          className="border-blue-200 bg-blue-50/50"
        />
        <StatCard
          title="مجموع حقوق خالص"
          value={formatPrice(payroll?.current?.total_net_salary ?? 0)}
          trend={payroll?.change_pct?.total_net_salary}
          icon={Banknote}
          className="border-emerald-200 bg-emerald-50/50"
        />
        <StatCard
          title="کمیسیون پرداختی"
          value={formatPrice(payroll?.current?.total_commission_paid ?? 0)}
          trend={payroll?.change_pct?.total_commission_paid}
          icon={Percent}
          className="border-violet-200 bg-violet-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">کمیسیون کارکنان</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={commissionColumns} data={commissions} emptyMessage="کمیسیونی ثبت نشده است" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">اقدامات کارکنان روی سفارش‌ها</CardTitle></CardHeader>
          <CardContent>
            <DataTable columns={actionColumns} data={orderActions} emptyMessage="اقدامی ثبت نشده است" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
