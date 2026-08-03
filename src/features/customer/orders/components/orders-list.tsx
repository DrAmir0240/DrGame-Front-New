"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "./order-card";
import { OrdersEmptyState } from "./order-empty";
import type { OrderBase, PaginatedResponse } from "../types";

interface Props {
  data?: PaginatedResponse<OrderBase>;
  isLoading?: boolean;
  isFetching?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function OrdersList({
  data,
  isLoading,
  isFetching,
  page,
  onPageChange,
}: Props) {
  const orders = data?.results ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!orders.length) {
    return <OrdersEmptyState />;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={`${order.type}-${order.id}`} order={order} />
      ))}

      {(data?.next || data?.previous) && (
        <div className="flex justify-center gap-3 pt-4">
          <Button
            variant="outline"
            disabled={!data?.previous || isFetching}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            قبلی
          </Button>
          <Button
            variant="outline"
            disabled={!data?.next || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}