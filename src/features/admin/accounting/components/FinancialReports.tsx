"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { useReportIncome, useReportIncomeWeekly, useReportExpense, useReportExpenseWeekly, useReportNet, useRepairReport, useRepairReportWeekly, useSonyReport, useSonyReportWeekly, useProductReport, useProductReportWeekly, useProductReportByCategory } from "../apis";
import { formatPrice } from "@/utils/format";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const PIE_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#818cf8", "#6d28d9", "#7c3aed", "#4f46e5"];

function DateFilter({ filters, setFilters }: { filters: { start_date?: string; end_date?: string }; setFilters: (f: { start_date?: string; end_date?: string }) => void }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">از تاریخ</label>
        <input type="date" value={filters.start_date || ""} onChange={(e) => setFilters({ ...filters, start_date: e.target.value || undefined })} className="flex h-9 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-neutral-700">تا تاریخ</label>
        <input type="date" value={filters.end_date || ""} onChange={(e) => setFilters({ ...filters, end_date: e.target.value || undefined })} className="flex h-9 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm" />
      </div>
    </div>
  );
}

function WeeklyBarChart({ incomeData, expenseData, title }: { incomeData?: { weekday: string; total_amount: number }[]; expenseData?: { weekday: string; total_amount: number }[]; title: string }) {
  const chartData = incomeData?.map((item, index) => ({
    weekday: item.weekday,
    درآمد: item.total_amount,
    هزینه: expenseData?.[index]?.total_amount || 0,
  })) || [];

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="weekday" />
              <YAxis />
              <Tooltip formatter={(value) => formatPrice(Number(value))} />
              <Legend />
              <Bar dataKey="درآمد" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="هزینه" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function IncomeExpenseReports() {
  const [filters, setFilters] = useState<{ start_date?: string; end_date?: string }>({});
  const { data: income } = useReportIncome(filters);
  const { data: incomeWeekly } = useReportIncomeWeekly();
  const { data: expense } = useReportExpense(filters);
  const { data: expenseWeekly } = useReportExpenseWeekly();
  const { data: netReport } = useReportNet(filters);

  return (
    <div className="space-y-6">
      <DateFilter filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-emerald-600">درآمد کل</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-700">{formatPrice(income?.total_amount || 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">{income?.count || 0} تراکنش</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-red-600">هزینه کل</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-700">{formatPrice(expense?.total_amount || 0)}</p>
            <p className="text-xs text-muted-foreground mt-1">{expense?.count || 0} تراکنش</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-600">خالص مالی</CardTitle></CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${(netReport?.net || 0) >= 0 ? "text-emerald-700" : "text-red-700"}`}>
              {formatPrice(netReport?.net || 0)}
            </p>
          </CardContent>
        </Card>
      </div>
      <WeeklyBarChart incomeData={incomeWeekly} expenseData={expenseWeekly} title="نمودار هفتگی درآمد و هزینه" />
    </div>
  );
}

function RepairReports() {
  const [filters, setFilters] = useState<{ start_date?: string; end_date?: string }>({});
  const { data: report } = useRepairReport(filters);
  const { data: weekly } = useRepairReportWeekly();

  return (
    <div className="space-y-6">
      <DateFilter filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-600">تعداد سفارشات تعمیر</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{report?.count || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-600">مبلغ کل تعمیرات</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatPrice(report?.total_amount || 0)}</p></CardContent>
        </Card>
      </div>
      {weekly && (
        <Card>
          <CardHeader><CardTitle className="text-base">نمودار هفتگی سفارشات تعمیر</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly.map((w) => ({ weekday: w.weekday, تعداد: w.count, مبلغ: w.total_amount }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekday" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Bar dataKey="مبلغ" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ReportPieChart({ data, labelKey, valueKey, title }: { data: Record<string, unknown>[]; labelKey: string; valueKey: string; title: string }) {
  const chartData = data.map((item) => ({ name: String(item[labelKey]), value: Number(item[valueKey]), count: Number(item.count) }));
  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="value">
                {chartData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(value) => [`${formatPrice(Number(value))} (${((Number(value) / total) * 100).toFixed(1)}%)`, "مبلغ"]} />
              <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 space-y-1">
          {chartData.map((d, i) => (
            <div key={d.name} className="flex justify-between text-xs border-b pb-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name}
              </span>
              <span className="font-medium">{d.count} سفارش — {formatPrice(d.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SonyReports() {
  const [filters, setFilters] = useState<{ start_date?: string; end_date?: string }>({});
  const { data: report } = useSonyReport(filters);
  const { data: weekly } = useSonyReportWeekly();

  return (
    <div className="space-y-6">
      <DateFilter filters={filters} setFilters={setFilters} />

      {report?.summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-purple-600">تعداد کل اکانت سونی</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{report.summary.count}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-purple-600">مبلغ کل اکانت سونی</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{formatPrice(report.summary.total_amount)}</p></CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {report?.by_source && report.by_source.length > 0 && (
          <ReportPieChart data={report.by_source as unknown as Record<string, unknown>[]} labelKey="source_display" valueKey="total_amount" title="تفکیک بر اساس منبع" />
        )}
        {report?.by_type && report.by_type.length > 0 && (
          <ReportPieChart data={report.by_type as unknown as Record<string, unknown>[]} labelKey="type_display" valueKey="total_amount" title="تفکیک بر اساس نوع" />
        )}
        {report?.by_category && report.by_category.length > 0 && (
          <ReportPieChart data={report.by_category as unknown as Record<string, unknown>[]} labelKey="category_title" valueKey="total_amount" title="تفکیک بر اساس دسته‌بندی" />
        )}
        {report?.by_stage && report.by_stage.length > 0 && (
          <ReportPieChart data={report.by_stage as unknown as Record<string, unknown>[]} labelKey="stage_title" valueKey="total_amount" title="تفکیک بر اساس مرحله" />
        )}
      </div>

      {weekly && (
        <Card>
          <CardHeader><CardTitle className="text-base">نمودار هفتگی اکانت سونی</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly.map((w) => ({ weekday: w.weekday, تعداد: w.count, مبلغ: w.total_amount }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekday" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Bar dataKey="مبلغ" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProductReports() {
  const [filters, setFilters] = useState<{ start_date?: string; end_date?: string }>({});
  const { data: report } = useProductReport(filters);
  const { data: weekly } = useProductReportWeekly();
  const { data: byCategory } = useProductReportByCategory();

  return (
    <div className="space-y-6">
      <DateFilter filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-600">تعداد سفارشات کالا</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{report?.count || 0}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-600">مبلغ کل سفارشات کالا</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{formatPrice(report?.total_amount || 0)}</p></CardContent>
        </Card>
      </div>

      {byCategory && byCategory.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">تفکیک بر اساس مرحله</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {byCategory.map((c) => (
                <div key={c.category} className="flex justify-between border-b pb-2 text-sm">
                  <span>{c.category}</span>
                  <span className="font-medium">{c.count} سفارش — {formatPrice(c.total_amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {weekly && (
        <Card>
          <CardHeader><CardTitle className="text-base">نمودار هفتگی سفارشات کالا</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekly.map((w) => ({ weekday: w.weekday, تعداد: w.count, مبلغ: w.total_amount }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="weekday" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Bar dataKey="مبلغ" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function FinancialReports() {
  return (
    <Tabs dir="rtl" defaultValue="income-expense">
      <TabsList>
        <TabsTrigger value="income-expense">درآمد و هزینه</TabsTrigger>
        <TabsTrigger value="repair">تعمیرات</TabsTrigger>
        <TabsTrigger value="sony">اکانت سونی</TabsTrigger>
        <TabsTrigger value="product">کالا</TabsTrigger>
      </TabsList>
      <TabsContent value="income-expense"><IncomeExpenseReports /></TabsContent>
      <TabsContent value="repair"><RepairReports /></TabsContent>
      <TabsContent value="sony"><SonyReports /></TabsContent>
      <TabsContent value="product"><ProductReports /></TabsContent>
    </Tabs>
  );
}
