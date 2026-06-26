"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatPrice } from "@/utils/format";

interface Props {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  onDiscountChange: (value: number) => void;
}

export default function FinancialSummaryCard({ subtotal, discountAmount, taxAmount, total, onDiscountChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>خلاصه مالی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">جمع اقلام</span>
          <span>{formatPrice(subtotal)} </span>
        </div>
        <div className="space-y-2">
          <input
            className="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
            placeholder="تخفیف"
            type="number"
            value={discountAmount}
            onChange={(e) => onDiscountChange(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">مالیات</span>
          <span>{formatPrice(taxAmount)} ت</span>
        </div>
        <div className="flex justify-between border-t border-neutral-200 pt-4 text-lg font-bold">
          <span>جمع کل</span>
          <span>{formatPrice(total)} ت</span>
        </div>
      </CardContent>
    </Card>
  );
}
