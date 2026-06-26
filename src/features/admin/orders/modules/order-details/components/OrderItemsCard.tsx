"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { Order } from "../../../types";
import { formatPrice } from "@/utils/format";

interface Props {
  order: Order;
}

export default function OrderItemsCard({ order }: Props) {
  return (
    <Card className="lg:col-span-2 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">آیتم‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        {order.items?.length ? (
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 bg-neutral-100 rounded-xl"
              >
                <div>
                  <p className="font-medium text-sm">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <span className="font-semibold text-sm">
                  {formatPrice(item.totalPrice)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-6">بدون آیتم</p>
        )}
      </CardContent>
    </Card>
  );
}
