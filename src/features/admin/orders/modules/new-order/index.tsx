"use client";

import { useMemo, useState } from "react";
import { Plus, ShoppingCart, Trash2 } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";

import { PageHeader } from "@/components/shared";

import { OrderForm, OrderItem } from "../../types";
import { mockBranches, mockCustomers, mockProducts } from "../../constants";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value);
}

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

  const updateItem = (
    index: number,
    field: keyof OrderItem,
    value: string | number,
  ) => {
    const newItems = [...items];

    (newItems[index] as Record<string, string | number>)[field] = value;

    if (field === "id") {
      const product = mockProducts.find((p) => p.id === value);

      if (product) {
        newItems[index].productName = product.name;
        newItems[index].unitPrice = product.sellPrice;
        newItems[index].totalPrice =
          product.sellPrice * newItems[index].quantity;
      }
    }

    if (field === "quantity" || field === "unitPrice") {
      newItems[index].totalPrice =
        newItems[index].quantity * newItems[index].unitPrice;
    }

    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات سفارش</CardTitle>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Select
                  value={form.orderType}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      orderType: v as OrderForm["orderType"],
                    })
                  }
                >
                  <SelectTrigger label="نوع سفارش">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="physical_sale">فروش کالا</SelectItem>

                    <SelectItem value="account_sale">فروش اکانت</SelectItem>

                    <SelectItem value="repair">تعمیرات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select
                  value={form.channel}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      channel: v as OrderForm["channel"],
                    })
                  }
                >
                  <SelectTrigger label="کانال">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="in_store">حضوری</SelectItem>

                    <SelectItem value="online">آنلاین</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select
                  value={form.branchId}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      branchId: v,
                    })
                  }
                >
                  <SelectTrigger label="شعبه">
                    <SelectValue placeholder="انتخاب..." />
                  </SelectTrigger>

                  <SelectContent>
                    {mockBranches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select
                  value={form.customerId}
                  onValueChange={(v) =>
                    setForm({
                      ...form,
                      customerId: v,
                    })
                  }
                >
                  <SelectTrigger label="مشتری">
                    <SelectValue placeholder="انتخاب..." />
                  </SelectTrigger>

                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>آیتم‌ها</CardTitle>

              <Button
                variant="outline"
                size="sm"
                onClick={addItem}
                className="border-neutral-300 shadow-none"
              >
                <Plus className="size-4" />
                افزودن
              </Button>
            </CardHeader>

            <CardContent className="space-y-3">
              {!items.length && (
                <p className="py-10 text-center text-muted-foreground">
                  آیتمی اضافه نشده
                </p>
              )}

              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-end gap-3 rounded-xl bg-neutral-100 p-4"
                >
                  <div className="flex-1 ">
                    <Select
                      value={item.id}
                      onValueChange={(v) => updateItem(index, "id", v)}
                    >
                      <SelectTrigger label="محصول">
                        <SelectValue placeholder="انتخاب..." />
                      </SelectTrigger>

                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-20 space-y-1">
                    <Label className="text-xs">تعداد</Label>

                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="w-32 space-y-1">
                    <Label className="text-xs">قیمت</Label>

                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(index, "unitPrice", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className="w-32">
                    <p className="text-xs text-muted-foreground">جمع</p>

                    <p className="font-semibold">
                      {formatPrice(item.totalPrice)} ت
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="size-4 text-error" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
                <Input
                  label="تخفیف"
                  type="number"
                  value={form.discountAmount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      discountAmount: Number(e.target.value),
                    })
                  }
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

          <Card>
            <CardHeader>
              <CardTitle>اطلاعات پیک</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Input
                placeholder="نام پیک"
                value={form.courierName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    courierName: e.target.value,
                  })
                }
              />

              <Input
                placeholder="شماره پیک"
                value={form.courierPhone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    courierPhone: e.target.value,
                  })
                }
              />

              <Input
                type="number"
                placeholder="هزینه پیک"
                value={form.courierFee}
                onChange={(e) =>
                  setForm({
                    ...form,
                    courierFee: Number(e.target.value),
                  })
                }
              />
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Textarea
              label="بادداشت"
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
            />
          </div>

          <Button
            type="submit"
            className="h-12 w-full gap-2"
            disabled={!items.length}
          >
            <ShoppingCart className="size-5" />
            ثبت سفارش
          </Button>
        </div>
      </form>
    </div>
  );
}
