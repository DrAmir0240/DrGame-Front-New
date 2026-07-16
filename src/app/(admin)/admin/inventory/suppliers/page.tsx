"use client";

import { PageHeader } from "@/components/shared";
import SuppliersPage from "@/features/admin/inventory/suppliers";

export default function SuppliersRoute() {
  return (
    <div className="space-y-6">
      <PageHeader title="تامین‌کنندگان" description="مدیریت تامین‌کنندگان کالا" />
      <SuppliersPage />
    </div>
  );
}
