"use client";
import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import FinancialWidgets from "./components/FinancialWidgets";
import OrdersWidgets from "./components/OrdersWidgets";
import InventoryWidgets from "./components/InventoryWidgets";
import SonyWidgets from "./components/SonyWidgets";
import CustomersWidgets from "./components/CustomersWidgets";
import HrWidgets from "./components/HrWidgets";
import DashboardDateRange from "./components/DateRange";
import type { DateRange } from "./types";

export const DashboardPage = () => {
  const [range, setRange] = useState<DateRange>({});

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <PageHeader title="داشبورد" description="نمای کلی عملکرد سیستم" />
        <DashboardDateRange value={range} onChange={setRange} />
      </div>

      <Tabs dir="rtl" defaultValue="financial">
        <TabsList className="mb-4">
          <TabsTrigger value="financial">مالی</TabsTrigger>
          <TabsTrigger value="orders">سفارشات</TabsTrigger>
          <TabsTrigger value="inventory">انبار</TabsTrigger>
          <TabsTrigger value="sony">اکانت سونی</TabsTrigger>
          <TabsTrigger value="customers">مشتریان</TabsTrigger>
          <TabsTrigger value="hr">کارکنان</TabsTrigger>
        </TabsList>
        <TabsContent value="financial"><FinancialWidgets range={range} /></TabsContent>
        <TabsContent value="orders"><OrdersWidgets range={range} /></TabsContent>
        <TabsContent value="inventory"><InventoryWidgets range={range} /></TabsContent>
        <TabsContent value="sony"><SonyWidgets range={range} /></TabsContent>
        <TabsContent value="customers"><CustomersWidgets range={range} /></TabsContent>
        <TabsContent value="hr"><HrWidgets range={range} /></TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
