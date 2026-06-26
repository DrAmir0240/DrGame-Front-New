"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import type { Order } from "../../../types";
import { formatPrice } from "@/utils/format";

interface Props {
  order: Order;
}

export default function FinancialSummaryCard({ order }: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">خلاصه مالی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">جمع اقلام</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        {(order.discountAmount ?? 0) > 0 && (
          <div className="flex justify-between text-destructive">
            <span>تخفیف</span>
            <span>-{formatPrice(order.discountAmount ?? 0)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">مالیات</span>
          <span>{formatPrice(order.taxAmount)}</span>
        </div>
        <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold">
          <span>جمع کل</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
