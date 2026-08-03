"use client";

import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrdersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-50">
        <Package className="h-10 w-10 text-violet-400" />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        هنوز سفارشی ثبت نکرده‌اید
      </h3>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        از فروشگاه محصولات، اکانت سونی یا خدمات تعمیرات را سفارش دهید
      </p>

      <Button href="/store" className="mt-6 rounded-xl">
        رفتن به فروشگاه
      </Button>
    </div>
  );
}