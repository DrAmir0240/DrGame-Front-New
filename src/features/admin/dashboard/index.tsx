"use client";
import { PageHeader } from "@/components/shared";
import { mockOrders } from "./constants";
import StatCards from "./components/StatCards";
import RecentOrdersCard from "./components/RecentOrdersCard";
import OrderDistributionCard from "./components/OrderDistributionCard";
import { getOrderTypeData } from "./utils";

export const DashboardPage = () => {
  const orderTypeData = getOrderTypeData(mockOrders);
  const recentOrders = mockOrders.slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader title="داشبورد" description="نمای کلی عملکرد سیستم" />
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrdersCard orders={recentOrders} />
        <OrderDistributionCard data={orderTypeData} />
      </div>
    </div>
  );
};

export default DashboardPage;
