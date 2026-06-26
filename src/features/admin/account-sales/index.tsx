"use client";

import { PageHeader } from "@/components/shared";
import AccountSalesTable from "./components/AccountSalesTable";

export default function AccountSalesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="لاگ فروش اکانت" description="تاریخچه فروش‌های اکانت" />
      <AccountSalesTable />
    </div>
  );
}
