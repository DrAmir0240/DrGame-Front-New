"use client";

import { ShoppingCart } from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import type { DashboardOrder } from "../types";
import { orderTypeLabel } from "../constants";
import { formatPrice } from "@/utils/format";

interface Props {
  orders: DashboardOrder[];
}

export default function RecentOrdersCard({ orders }: Props) {
  return (
    <Card className="lg:col-span-2 rounded-2xl">
      <CardHeader>
        <CardTitle>آخرین سفارش‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {orderTypeLabel[order.order_type]}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={order.status} />
                <span className="text-sm font-semibold">
                  {formatPrice(order.total)} 
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
