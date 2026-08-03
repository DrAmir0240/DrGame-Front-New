"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { useOrders } from "@/features/customer/orders/apis";

import type { OrderType } from "@/features/customer/orders/types";
import { OrdersFilter } from "./components/order-filter";
import { OrdersList } from "./components/orders-list";

export default function OrdersPage() {
  const [type, setType] = useState<OrderType | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useOrders({
    type,
    page,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">
          <Package className="h-6 w-6 text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">سفارش‌های من</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {data?.count
              ? `${data.count.toLocaleString("fa-IR")} سفارش`
              : "پیگیری وضعیت سفارش‌ها"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <OrdersFilter
          value={type}
          onChange={(v) => {
            setType(v);
            setPage(1);
          }}
        />
      </div>

      <OrdersList
        data={data}
        isLoading={isLoading}
        isFetching={isFetching}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
}
