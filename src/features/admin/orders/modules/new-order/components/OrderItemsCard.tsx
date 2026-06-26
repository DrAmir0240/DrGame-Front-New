"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import type { OrderItem, Product } from "../../../types";
import { formatPrice } from "@/utils/format";

interface Props {
  items: OrderItem[];
  products: Product[];
  onAdd: () => void;
  onUpdate: (index: number, field: any, value: string | number) => void;
  onRemove: (index: number) => void;
}

export default function OrderItemsCard({ items, products, onAdd, onUpdate, onRemove }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>آیتم‌ها</CardTitle>
        <Button variant="outline" size="sm" onClick={onAdd} className="border-neutral-300 shadow-none">
          <Plus className="size-4" /> افزودن
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {!items.length && (
          <p className="py-10 text-center text-muted-foreground">آیتمی اضافه نشده</p>
        )}
        {items.map((item, index) => (
          <div key={item.id} className="flex items-end gap-3 rounded-xl bg-neutral-100 p-4">
            <div className="flex-1">
              <Select value={item.id} onValueChange={(v) => onUpdate(index, "id", v)}>
                <SelectTrigger label="محصول">
                  <SelectValue placeholder="انتخاب..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-20 space-y-1">
              <Label className="text-xs">تعداد</Label>
              <Input type="number" min={1} value={item.quantity}
                onChange={(e) => onUpdate(index, "quantity", Number(e.target.value))} />
            </div>
            <div className="w-32 space-y-1">
              <Label className="text-xs">قیمت</Label>
              <Input type="number" value={item.unitPrice}
                onChange={(e) => onUpdate(index, "unitPrice", Number(e.target.value))} />
            </div>
            <div className="w-32">
              <p className="text-xs text-muted-foreground">جمع</p>
              <p className="font-semibold">{formatPrice(item.totalPrice)} ت</p>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={() => onRemove(index)}>
              <Trash2 className="size-4 text-error" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
