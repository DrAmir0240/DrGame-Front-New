"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileText,
  PiggyBank,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { DataTable, DataTableColumn, StatCard } from "@/components/shared";
import {
  useFinancialSummary,
  useFinancialIncome,
  useFinancialExpense,
  useFinancialInvoiceCategories,
  useWalletTransactions,
} from "../apis";
import { formatPrice } from "@/utils/format";
import TrendBadge from "./TrendBadge";
import type { InvoiceCategoryMetric, DateRange } from "../types";

const PIE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#818cf8",
  "#6d28d9",
  "#7c3aed",
  "#4f46e5",
];

const WALLET_ITEMS: { key: string; label: string }[] = [
  { key: "charge_admin", label: "شارژ توسط ادمین" },
  { key: "charge_gateway", label: "شارژ آنلاین" },
  { key: "debit_order", label: "کسر بابت سفارش" },
  { key: "refund", label: "برگشت وجه" },
];

interface WalletRow {
  id: string;
  label: string;
  count: number;
  total_amount: number;
  change_pct: number | null;
}

export default function FinancialWidgets({ range }: { range: DateRange }) {
  const { data: summary } = useFinancialSummary(range);
  const { data: income } = useFinancialIncome(range);
  const { data: expense } = useFinancialExpense(range);
  const { data: categories = [] } = useFinancialInvoiceCategories(range);
  const { data: wallet, isLoading: walletLoading } =
    useWalletTransactions(range);

  const chartData = Array.from(
    new Map(
      [...(income ?? []), ...(expense ?? [])].map((i) => [i.date, i.date]),
    ).keys(),
  ).map((date) => ({
    date,
    درآمد: income?.find((e) => e.date === date)?.amount ?? 0,
    هزینه: expense?.find((e) => e.date === date)?.amount ?? 0,
  }));

  const maxCategoryAmount = Math.max(
    1,
    ...categories.map((c) => c.current_amount),
  );

  const walletRows: WalletRow[] = wallet
    ? WALLET_ITEMS.map(({ key, label }) => {
        const v = wallet[key as keyof typeof wallet];
        return {
          id: key,
          label,
          count: v?.count ?? 0,
          total_amount: v?.total_amount ?? 0,
          change_pct: v?.change_pct ?? null,
        };
      })
    : [];

  const walletData = walletRows
    .filter((r) => r.total_amount > 0)
    .map((r) => ({ name: r.label, value: r.total_amount }));

  const categoryColumns: DataTableColumn<InvoiceCategoryMetric>[] = [
    {
      header: "دسته‌بندی",
      render: (c) => <span className="font-medium">{c.category_title}</span>,
    },
    {
      header: "تعداد فاکتور",
      render: (c) => c.current_count.toLocaleString("fa-IR"),
    },
    {
      header: "مبلغ کل",
      render: (c) => (
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {formatPrice(c.current_amount)}
        </span>
      ),
    },
    {
      header: "مبلغ قبلی",
      render: (c) => (
        <span className="text-muted-foreground">
          {formatPrice(c.previous_amount)}
        </span>
      ),
    },
    {
      header: "تغییر",
      render: (c) => <TrendBadge change_pct={c.change_pct} />,
    },
  ];

  const walletColumns: DataTableColumn<WalletRow>[] = [
    {
      header: "نوع تراکنش",
      render: (r) => <span className="font-medium">{r.label}</span>,
    },
    { header: "تعداد", render: (r) => r.count.toLocaleString("fa-IR") },
    {
      header: "مبلغ",
      render: (r) => (
        <span className="font-medium">{formatPrice(r.total_amount)}</span>
      ),
    },
    {
      header: "تغییر",
      render: (r) => <TrendBadge change_pct={r.change_pct} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <StatCard
    title="درآمد کل"
    value={formatPrice(summary?.current?.total_income ?? 0)}
    trend={summary?.change_pct?.total_income}
    icon={TrendingUp}
    className="border-emerald-200 bg-emerald-50/50"
  />

  <StatCard
    title="هزینه کل"
    value={formatPrice(summary?.current?.total_expense ?? 0)}
    trend={summary?.change_pct?.total_expense}
    icon={TrendingDown}
    className="border-red-200 bg-red-50/50"
  />

  <StatCard
    title="سود خالص"
    value={formatPrice(summary?.current?.net_profit ?? 0)}
    trend={summary?.change_pct?.net_profit}
    icon={PiggyBank}
    className="border-blue-200 bg-blue-50/50"
  />

  <StatCard
    title="تعداد فاکتور"
    value={`${(summary?.current?.invoice_count ?? 0).toLocaleString("fa-IR")} فاکتور`}
    trend={summary?.change_pct?.invoice_count}
    icon={FileText}
    className="border-violet-200 bg-violet-50/50"
  />

  <StatCard
    title="فاکتور پرداخت‌شده"
    value={(summary?.current?.paid_invoice_count ?? 0).toLocaleString("fa-IR")}
    trendLabel={`${summary?.current?.partial_invoice_count ?? 0} فاکتور جزئی`}
    icon={CheckCircle2}
    className="border-emerald-200 bg-emerald-50/50"
  />

  <StatCard
    title="فاکتور پرداخت‌نشده"
    value={(summary?.current?.unpaid_invoice_count ?? 0).toLocaleString("fa-IR")}
    icon={AlertCircle}
    className="border-red-200 bg-red-50/50"
  />
</div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">درآمد و هزینه روزانه</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatPrice(Number(value))} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="درآمد"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="هزینه"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            تفکیک فاکتورها بر اساس دسته‌بندی
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={categoryColumns}
            data={categories}
            emptyMessage="دسته‌بندی فاکتوری وجود ندارد"
          />

          <div className="mt-5 space-y-3">
            {categories.map((c) => (
              <div
                key={c.category_id ?? c.category_title}
                className="space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{c.category_title}</span>
                  <span>{formatPrice(c.current_amount)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-indigo-500 to-violet-500 transition-all"
                    style={{
                      width: `${(c.current_amount / maxCategoryAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">تراکنش‌های کیف پول</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={walletColumns}
              data={walletRows}
              isLoading={!wallet}
              emptyMessage="تراکنشی ثبت نشده است"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ترکیب مبلغ کیف پول</CardTitle>
          </CardHeader>
          <CardContent>
            {walletData.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center rounded-xl border border-dashed border-neutral-200 text-center text-sm text-muted-foreground">
                {walletLoading
                  ? "در حال بارگذاری…"
                  : "تراکنشی برای این بازه ثبت نشده است"}
              </div>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={walletData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {walletData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatPrice(Number(value))}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
