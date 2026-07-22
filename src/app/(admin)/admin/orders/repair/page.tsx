"use client";

import { PageHeader } from "@/components/shared";
import EmployeeOrdersTab from "@/features/admin/orders/modules/employee-orders/components/EmployeeOrdersTab";

export default function RepairOrders() {
  return (
    <div className="space-y-6">
      <PageHeader title="سفارشات تعمیرات" description="مدیریت سفارشات تعمیرات" />
      <EmployeeOrdersTab orderPrefix="repair" />
    </div>
  );
}
