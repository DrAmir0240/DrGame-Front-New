"use client";

import { PageHeader } from "@/components/shared";
import CategoriesPage from "@/features/admin/inventory/categories";

export default function CategoriesRoute() {
  return (
    <div className="space-y-6">
      <PageHeader title="دسته‌بندی‌ها" description="مدیریت دسته‌بندی کالاها" />
      <CategoriesPage />
    </div>
  );
}
