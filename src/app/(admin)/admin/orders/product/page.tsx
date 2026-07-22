"use client";

import { PageHeader } from "@/components/shared";
import EmployeeOrdersTab from "@/features/admin/orders/modules/employee-orders/components/EmployeeOrdersTab";

export default function ProductOrders() {
  return (
    <div className="space-y-6">
      <PageHeader title="سفارشات کالا" description="مدیریت سفارشات کالا" />
      <EmployeeOrdersTab orderPrefix="product" />
    </div>
  );
}
