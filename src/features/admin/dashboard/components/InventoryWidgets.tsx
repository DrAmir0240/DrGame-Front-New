"use client";

import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  Boxes,
  PackageX,
  ShoppingCart,
} from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { DataTable, DataTableColumn, StatCard } from "@/components/shared";
import {
  useInventorySummary,
  useLowStockProducts,
  useTopSellingProducts,
  usePurchaseOrdersSummary,
  useMovementsByReason,
} from "../apis";
import { formatPrice } from "@/utils/format";
import TrendBadge from "./TrendBadge";
import type {
  LowStockProduct,
  TopSellingProduct,
  MovementByReasonItem,
  DateRange,
} from "../types";

const PIE_COLORS = [
  "#3b82f6",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#ef4444",
  "#6366f1",
  "#14b8a6",
];

const STATUS_LABELS: Record<string, string> = {
  draft: "پیش‌نویس",
  confirmed: "تایید شده",
  received: "دریافت شده",
  cancelled: "لغو شده",
};

const STATUS_BADGE: Record<string, string> = {
  draft:
    "bg-neutral-100 text-neutral-600 dark:bg-neutral-700/40 dark:text-neutral-300",
  confirmed: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  received:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  cancelled: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
};

export default function InventoryWidgets({ range }: { range: DateRange }) {
  const { data: summary } = useInventorySummary(range);
  const { data: lowStock = [] } = useLowStockProducts();
  const { data: topSelling = [] } = useTopSellingProducts();
  const { data: purchaseOrders } = usePurchaseOrdersSummary(range);
  const { data: movements = [], isLoading: movementsLoading } =
    useMovementsByReason(range);

  const maxSold = Math.max(1, ...topSelling.map((p) => p.total_quantity_sold));
  const movementPie = movements.map((m) => ({
    name: m.reason_display,
    value: m.current_quantity,
  }));

  const topSellingRows: (TopSellingProduct & { rank: number })[] = topSelling
    .slice(0, 10)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  const lowStockColumns: DataTableColumn<LowStockProduct>[] = [
    {
      header: "محصول",
      render: (p) => (
        <div>
          <span className="font-medium">{p.title}</span>
          <span className="mr-2 text-xs text-muted-foreground">
            {p.category_title}
          </span>
        </div>
      ),
    },
    {
      header: "موجودی فعلی",
      render: (p) =>
        p.stock === 0 ? (
          <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 dark:bg-red-500/15 dark:text-red-400">
            اتمام
          </span>
        ) : (
          <span className="font-semibold">{p.stock}</span>
        ),
    },
    {
      header: "حداقل موجودی",
      render: (p) => (
        <span className="text-muted-foreground">{p.min_stock}</span>
      ),
    },
    {
      header: "کمبود",
      render: (p) => (
        <span className="font-bold text-red-600 dark:text-red-400">
          {p.deficit}
        </span>
      ),
    },
  ];

  const topSellingColumns: DataTableColumn<
    TopSellingProduct & { rank: number }
  >[] = [
    {
      header: "رتبه",
      render: (p) => (
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
          {p.rank}
        </span>
      ),
    },
    {
      header: "محصول",
      render: (p) => <span className="font-medium">{p.product_title}</span>,
    },
    {
      header: "تعداد فروش",
      render: (p) => (
        <span className="font-semibold">
          {p.total_quantity_sold.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "درآمد",
      render: (p) => (
        <span className="font-medium text-emerald-600 dark:text-emerald-400">
          {formatPrice(p.total_revenue)}
        </span>
      ),
    },
    {
      header: "سفارش",
      render: (p) => (
        <span className="text-muted-foreground">
          {p.order_count.toLocaleString("fa-IR")}
        </span>
      ),
    },
  ];

  const movementsColumns: DataTableColumn<MovementByReasonItem>[] = [
    {
      header: "دلیل",
      render: (m) => <span className="font-medium">{m.reason_display}</span>,
    },
    {
      header: "تعداد رکورد",
      render: (m) => m.current_count.toLocaleString("fa-IR"),
    },
    {
      header: "تعداد کالا",
      render: (m) => (
        <span className="font-semibold">
          {m.current_quantity.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "قبلی",
      render: (m) => (
        <span className="text-muted-foreground">
          {m.previous_quantity.toLocaleString("fa-IR")}
        </span>
      ),
    },
    {
      header: "تغییر",
      render: (m) => <TrendBadge change_pct={m.change_pct} />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="کل محصولات"
          value={(summary?.current?.total_products ?? 0).toLocaleString(
            "fa-IR",
          )}
          icon={Boxes}
          className="border-blue-200 bg-blue-50/50"
        />
        <StatCard
          title="کم‌موجودی"
          value={(summary?.current?.low_stock_count ?? 0).toLocaleString(
            "fa-IR",
          )}
          icon={AlertTriangle}
          className="border-amber-200 bg-amber-50/50"
        />
        <StatCard
          title="اتمام موجودی"
          value={(summary?.current?.out_of_stock_count ?? 0).toLocaleString(
            "fa-IR",
          )}
          icon={PackageX}
          className="border-red-200 bg-red-50/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="ورودی انبار"
          value={(summary?.current?.total_movement_in ?? 0).toLocaleString(
            "fa-IR",
          )}
          trend={summary?.change_pct?.total_movement_in}
          icon={ArrowDownToLine}
          className="border-emerald-200 bg-emerald-50/50"
        />
        <StatCard
          title="خروجی انبار"
          value={(summary?.current?.total_movement_out ?? 0).toLocaleString(
            "fa-IR",
          )}
          trend={summary?.change_pct?.total_movement_out}
          icon={ArrowUpFromLine}
          className="border-amber-200 bg-amber-50/50"
        />
        <StatCard
          title="سفارشات خرید"
          value={`${(summary?.current?.purchase_orders_count ?? 0).toLocaleString("fa-IR")} سفارش`}
          trend={summary?.change_pct?.purchase_orders_count}
          trendLabel={formatPrice(summary?.current?.purchase_orders_value ?? 0)}
          icon={ShoppingCart}
          className="border-violet-200 bg-violet-50/50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">محصولات کم‌موجودی</CardTitle>
            <Button
              variant="outline"
              size="sm"
              href="/admin/inventory/purchase-orders"
            >
              ثبت سفارش خرید
            </Button>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={lowStockColumns}
              data={lowStock.slice(0, 10)}
              emptyMessage="کالای رو به اتمام نیست"
              rowClassName={(p) =>
                p.stock === 0
                  ? "bg-red-50/70 hover:bg-red-50 dark:bg-red-500/10"
                  : p.stock <= p.min_stock
                    ? "bg-amber-50/70 hover:bg-amber-50 dark:bg-amber-500/10"
                    : undefined
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">پرفروش‌ترین محصولات</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={topSellingColumns}
              data={topSellingRows}
              emptyMessage="داده‌ای موجود نیست"
            />

            <div className="mt-5 space-y-3">
              {topSellingRows.map((p) => (
                <div key={p.product_id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{p.product_title}</span>
                    <span>{p.total_quantity_sold.toLocaleString("fa-IR")}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-teal-500"
                      style={{
                        width: `${(p.total_quantity_sold / maxSold) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              حرکات انبار — به تفکیک دلیل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={movementsColumns}
              data={movements}
              emptyMessage="حرکتی ثبت نشده است"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ترکیب حرکات انبار</CardTitle>
          </CardHeader>
          <CardContent>
            {movementPie.length === 0 ? (
              <div className="flex h-[250px] items-center justify-center rounded-xl border border-dashed border-neutral-200 text-center text-sm text-muted-foreground">
                {movementsLoading
                  ? "در حال بارگذاری…"
                  : "حرکتی برای این بازه ثبت نشده است"}
              </div>
            ) : (
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={movementPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {movementPie.map((_, i) => (
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
        <CardHeader>
          <CardTitle className="text-base">وضعیت سفارشات خرید</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {purchaseOrders &&
              Object.entries(purchaseOrders).map(([status, m]) => (
                <div
                  key={status}
                  className="rounded-xl border p-4 transition-shadow hover:shadow-sm"
                >
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[status] ?? ""}`}
                  >
                    {STATUS_LABELS[status] ?? status}
                  </span>
                  <p className="mt-3 text-xl font-bold">
                    {m.count.toLocaleString("fa-IR")} سفارش
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatPrice(m.total_amount)}
                  </p>
                  <div className="mt-2">
                    <TrendBadge change_pct={m.change_pct} />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
