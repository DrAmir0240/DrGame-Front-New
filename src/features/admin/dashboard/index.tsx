"use client";
import StatusBadge from "@/components/shared/StatusBadge";
import {
  Package,
  ShoppingCart,
  Users,
  Gamepad2,
  Wrench,
  TrendingUp,
  Building2,
  CreditCard,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PageHeader, StatCard } from "@/components/shared";


const COLORS = ["#8B5CF6", "#6366F1", "#A855F7", "#7C3AED", "#C084FC"];

function formatNumber(num: number) {
  if (!num) return "۰";
  return new Intl.NumberFormat("fa-IR").format(num);
}

export const DashboardPage = () => {
  // Mock Data
  const orders = [
    {
      id: "1",
      order_number: "ORD-1001",
      order_type: "physical_sale",
      status: "completed",
      total: 12500000,
    },
    {
      id: "2",
      order_number: "ORD-1002",
      order_type: "account_sale",
      status: "pending",
      total: 3800000,
    },
    {
      id: "3",
      order_number: "ORD-1003",
      order_type: "repair",
      status: "completed",
      total: 950000,
    },
    {
      id: "4",
      order_number: "ORD-1004",
      order_type: "xbox_sale",
      status: "pending",
      total: 7600000,
    },
    {
      id: "5",
      order_number: "ORD-1005",
      order_type: "physical_sale",
      status: "completed",
      total: 4500000,
    },
    {
      id: "6",
      order_number: "ORD-1006",
      order_type: "account_sale",
      status: "completed",
      total: 2100000,
    },
  ];

  const products = new Array(587).fill({});
  const customers = new Array(3421).fill({});

  const accounts = [
    { is_active: true },
    { is_active: true },
    { is_active: true },
    { is_active: true },
    { is_active: false },
    { is_active: true },
    { is_active: true },
    { is_active: true },
  ];

  const repairs = [
    { status: "pending" },
    { status: "in_progress" },
    { status: "completed" },
    { status: "pending" },
    { status: "cancelled" },
    { status: "in_progress" },
  ];

  const branches = [
    { name: "شعبه مرکزی" },
    { name: "شعبه ولیعصر" },
    { name: "شعبه ستارخان" },
    { name: "شعبه تجریش" },
    { name: "شعبه کرج" },
  ];

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const orderTypeData = [
    {
      name: "فروش کالا",
      value: orders.filter((o) => o.order_type === "physical_sale").length,
    },
    {
      name: "فروش اکانت",
      value: orders.filter((o) => o.order_type === "account_sale").length,
    },
    {
      name: "تعمیرات",
      value: orders.filter((o) => o.order_type === "repair").length,
    },
    {
      name: "Xbox",
      value: orders.filter((o) => o.order_type === "xbox_sale").length,
    },
  ];

  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader title="داشبورد" description="نمای کلی عملکرد سیستم" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="کل فروش"
          value={`${formatNumber(totalRevenue)} تومان`}
          icon={TrendingUp}
          trend={18}
          trendLabel="نسبت به ماه قبل"
        />

        <StatCard
          title="سفارش‌ها"
          value={formatNumber(1248)}
          icon={ShoppingCart}
        />

        <StatCard
          title="محصولات"
          value={formatNumber(products.length)}
          icon={Package}
        />

        <StatCard
          title="مشتریان"
          value={formatNumber(customers.length)}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="اکانت‌های فعال"
          value={formatNumber(accounts.filter((a) => a.is_active).length)}
          icon={Gamepad2}
        />

        <StatCard
          title="تعمیرات فعال"
          value={formatNumber(
            repairs.filter(
              (r) => !["completed", "cancelled"].includes(r.status),
            ).length,
          )}
          icon={Wrench}
        />

        <StatCard
          title="شعبه‌ها"
          value={formatNumber(branches.length)}
          icon={Building2}
        />

        <StatCard
          title="سفارش‌های معلق"
          value={formatNumber(pendingOrders)}
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle>آخرین سفارش‌ها</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        {order.order_number}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {order.order_type === "physical_sale"
                          ? "فروش کالا"
                          : order.order_type === "account_sale"
                            ? "فروش اکانت"
                            : order.order_type === "repair"
                              ? "تعمیرات"
                              : "Xbox"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />

                    <span className="text-sm font-semibold">
                      {formatNumber(order.total)} ت
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>توزیع سفارش‌ها</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={orderTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  paddingAngle={4}
                >
                  {orderTypeData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip formatter={(value: number) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-2 mt-4">
              {orderTypeData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />

                    <span>{item.name}</span>
                  </div>

                  <span className="font-medium">
                    {formatNumber(item.value)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
