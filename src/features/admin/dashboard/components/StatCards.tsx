"use client";

import {
  Building2,
  CreditCard,
  Gamepad2,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { StatCard } from "@/components/shared";
import { accounts, branches, customersCount, mockOrders, productsCount, repairs } from "../constants";
import { getPendingOrdersCount, getTotalRevenue } from "../utils";
import { formatNumber, formatPrice } from "@/utils/format";

export default function StatCards() {
  const totalRevenue = getTotalRevenue(mockOrders);
  const pendingOrders = getPendingOrdersCount(mockOrders);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="کل فروش"
          value={formatPrice(totalRevenue)}
          icon={TrendingUp}
          trend={18}
          trendLabel="نسبت به ماه قبل"
        />
        <StatCard title="سفارش‌ها" value={formatNumber(1248)} icon={ShoppingCart} />
        <StatCard title="محصولات" value={formatNumber(productsCount)} icon={Package} />
        <StatCard title="مشتریان" value={formatNumber(customersCount)} icon={Users} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="اکانت‌های فعال"
          value={formatNumber(accounts.filter((a) => a.is_active).length)}
          icon={Gamepad2}
        />
        <StatCard
          title="تعمیرات فعال"
          value={formatNumber(repairs.filter((r) => !["completed", "cancelled"].includes(r.status)).length)}
          icon={Wrench}
        />
        <StatCard title="شعبه‌ها" value={formatNumber(branches.length)} icon={Building2} />
        <StatCard title="سفارش‌های معلق" value={formatNumber(pendingOrders)} icon={CreditCard} />
      </div>
    </>
  );
}
