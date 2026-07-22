"use client";

import { PageHeader } from "@/components/shared";
import EmployeeOrdersTab from "@/features/admin/orders/modules/employee-orders/components/EmployeeOrdersTab";

export default function SonyAccountOrders() {
  return (
    <div className="space-y-6">
      <PageHeader title="سفارشات اکانت سونی" description="مدیریت سفارشات اکانت سونی" />
      <EmployeeOrdersTab orderPrefix="sony-account" />
    </div>
  );
}
