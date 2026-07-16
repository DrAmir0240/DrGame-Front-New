"use client";

import { PageHeader } from "@/components/shared";
import MovementsPage from "@/features/admin/inventory/movements";

export default function MovementsRoute() {
  return (
    <div className="space-y-6">
      <PageHeader title="گردش انبار" description="مدیریت گردش ورود و خروج کالا" />
      <MovementsPage />
    </div>
  );
}
