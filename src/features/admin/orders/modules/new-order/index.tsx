"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { mockBranches, mockCustomers, mockProducts } from "../../constants";
import type { OrderForm, OrderItem } from "../../types";
import OrderInfoCard from "./components/OrderInfoCard";
import OrderItemsCard from "./components/OrderItemsCard";
import FinancialSummaryCard from "./components/FinancialSummaryCard";
import CourierInfoCard from "./components/CourierInfoCard";

export default function NewOrderPage() {
  const [form, setForm] = useState<OrderForm>({
    orderType: "physical_sale",
    channel: "in_store",
    branchId: "",
    customerId: "",
    discountAmount: 0,
    discountNote: "",
    notes: "",
    courierName: "",
    courierPhone: "",
    courierFee: 0,
  });

  const [items, setItems] = useState<OrderItem[]>([]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        itemType: "product",
      },
    ]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setItems((prev) => {
      const next = prev.map((item, i) => i === index ? { ...item, [field]: value } : item);

      if (field === "id" && typeof value === "string") {
        const product = mockProducts.find((p) => p.id === value);
        if (product) {
          next[index].productName = product.name;
          next[index].unitPrice = product.sellPrice;
          next[index].totalPrice = product.sellPrice * next[index].quantity;
        }
      }

      if (field === "quantity" || field === "unitPrice") {
        next[index].totalPrice = next[index].quantity * next[index].unitPrice;
      }

      return next;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.totalPrice, 0), [items]);
  const taxAmount = Math.round(subtotal * 0.09);
  const total = subtotal - form.discountAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = {
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
      ...form,
      subtotal,
      taxAmount,
      total,
      items,
      status: "pending",
      paymentStatus: "pending",
    };
    console.log(order);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="ثبت سفارش جدید" description="ثبت سفارش حضوری" />
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <OrderInfoCard form={form} branches={mockBranches} customers={mockCustomers} onChange={setForm} />
          <OrderItemsCard items={items} products={mockProducts} onAdd={addItem} onUpdate={updateItem} onRemove={removeItem} />
        </div>
        <div className="space-y-6">
          <FinancialSummaryCard
            subtotal={subtotal}
            discountAmount={form.discountAmount}
            taxAmount={taxAmount}
            total={total}
            onDiscountChange={(v) => setForm({ ...form, discountAmount: v })}
          />
          <CourierInfoCard
            courierName={form.courierName}
            courierPhone={form.courierPhone}
            courierFee={form.courierFee}
            notes={form.notes}
            onCourierChange={(field, value) => setForm({ ...form, [field]: value })}
            onNotesChange={(v) => setForm({ ...form, notes: v })}
          />
          <Button type="submit" className="h-12 w-full gap-2" disabled={!items.length}>
            <ShoppingCart className="size-5" /> ثبت سفارش
          </Button>
        </div>
      </form>
    </div>
  );
}
