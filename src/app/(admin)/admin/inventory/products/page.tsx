"use client";

import { PageHeader } from "@/components/shared";
import ProductsPage from "@/features/admin/inventory/products";

export default function ProductsRoute() {
  return (
    <div className="space-y-6">
      <ProductsPage />
    </div>
  );
}
