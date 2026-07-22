"use client";

import { useState } from "react";
import moment from "moment";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui";
import type { OrderCard, OrderPrefix } from "../../../types";
import { formatPrice } from "@/utils/format";
import OrderDetailModal from "./OrderDetailModal";

interface Props {
  orders: OrderCard[];
  orderPrefix: OrderPrefix;
  isLoading?: boolean;
}

export default function OrdersStageList({ orders, orderPrefix, isLoading }: Props) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground py-4">در حال بارگذاری سفارشات...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">سفارشی در این مرحله موجود نیست</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border border-neutral-200 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => setSelectedOrderId(order.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-muted-foreground">#{order.id}</span>
              {order.pending_actions_count > 0 && (
                <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">
                  {order.pending_actions_count} اکشن
                </span>
              )}
            </div>
            <h4 className="text-sm font-medium mb-1">{order.customer_name}</h4>
            {order.category_title && (
              <p className="text-xs text-muted-foreground mb-1">{order.category_title}</p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-muted-foreground">
                {moment(order.created_at).format("YYYY/MM/DD")}
              </span>
              {order.amount != null && (
                <span className="text-xs font-semibold">{formatPrice(order.amount)}</span>
              )}
              {order.repair_fee != null && (
                <span className="text-xs font-semibold">{formatPrice(order.repair_fee)}</span>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <Button variant="ghost" size="sm" className="h-6 gap-1 text-xs">
                <Eye className="w-3 h-3" /> مشاهده
              </Button>
            </div>
          </div>
        ))}
      </div>

      <OrderDetailModal
        open={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
        orderPrefix={orderPrefix}
      />
    </>
  );
}
