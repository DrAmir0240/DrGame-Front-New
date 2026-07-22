import type { OrderPrefix } from "./types";

export const orderPrefixLabels: Record<OrderPrefix, string> = {
  "sony-account": "اکانت سونی",
  "repair": "تعمیرات",
  "product": "کالا",
};

export const sourceLabels: Record<string, string> = {
  telegram: "تلگرام",
  website: "وبسایت",
  in_person: "حضوری",
};

export const orderTypeLabels: Record<string, string> = {
  by_customer: "مشتری",
  by_employee: "کارمند",
};

export const actionTypeLabels: Record<string, string> = {
  update_order_field: "ویرایش فیلد سفارش",
  update_order_item_field: "ویرایش فیلد آیتم",
  manual_confirm: "تایید دستی",
  add_note: "افزودن یادداشت",
};

export const sonyAccountCategoryTypeLabels: Record<string, string> = {
  buy: "خرید",
  rent: "اجاره",
};

export const sonyAccountCapacityLabels: Record<string, string> = {
  "1": "آفلاین",
  "2": "آنلاین + آفلاین",
  "3": "آنلاین",
};

export const sonyAccountOrderFields: Record<string, string> = {
  description: "توضیحات",
};

export const sonyAccountItemFields: Record<string, string> = {
  sony_account: "اکانت سونی",
  is_done: "انجام شده",
};

export const repairOrderFields: Record<string, string> = {
  description: "توضیحات",
  repair_fee: "هزینه تعمیر",
  final_amount: "مبلغ نهایی",
};

export const productOrderFields: Record<string, string> = {
  description: "توضیحات",
};

export function getTargetFieldOptions(
  orderPrefix: OrderPrefix,
  actionType: string
): Record<string, string> | null {
  if (actionType === "update_order_field") {
    if (orderPrefix === "sony-account") return sonyAccountOrderFields;
    if (orderPrefix === "repair") return repairOrderFields;
    if (orderPrefix === "product") return productOrderFields;
  }
  if (actionType === "update_order_item_field") {
    if (orderPrefix === "sony-account") return sonyAccountItemFields;
    return null;
  }
  return null;
}

// ── Legacy constants (used by existing old-order modules) ──

import type { Branch, Customer, Order, OrderStatus, Product } from "./types";

export const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  confirmed: "تأیید",
  processing: "پردازش",
  ready: "آماده",
  dispatched: "ارسال",
  delivered: "تحویل",
  completed: "تکمیل",
  cancelled: "لغو",
};

export const statusFilterOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "pending", label: "در انتظار" },
  { value: "confirmed", label: "تأیید شده" },
  { value: "processing", label: "پردازش" },
  { value: "completed", label: "تکمیل" },
  { value: "cancelled", label: "لغو" },
];

export const legacyOrderTypeLabels: Record<string, string> = {
  physical_sale: "فروش کالا",
  account_sale: "فروش اکانت",
  repair: "تعمیرات",
  xbox_sale: "فروش Xbox",
  nintendo_sale: "فروش Nintendo",
};

export const mockBranches: Branch[] = [
  { id: "1", name: "شعبه مرکزی" },
  { id: "2", name: "شعبه غرب" },
];

export const mockCustomers: Customer[] = [
  { id: "1", fullName: "علی رضایی" },
  { id: "2", fullName: "محمد احمدی" },
  { id: "3", fullName: "سارا کریمی" },
];

export const mockOrders: Order[] = [
  {
    id: "1", orderNumber: "ORD-1001", orderType: "physical_sale", customerId: "1", branchId: "1",
    total: 1250000, status: "completed", paymentStatus: "paid", createdAt: "2025-08-18T14:20:00",
    createdDate: "2025-08-17T10:30:00",
    items: [{ id: "1", productName: "DualSense Controller", quantity: 1, unitPrice: 1250000, totalPrice: 1250000 }],
    subtotal: 1250000, discountAmount: 0, taxAmount: 0, courierName: "Ali", courierPhone: "09120000000", courierFee: 50000,
  },
  {
    id: "2", orderNumber: "ORD-1002", orderType: "account_sale", customerId: "2", branchId: "2",
    total: 850000, status: "processing", paymentStatus: "pending", createdDate: "2025-08-17T10:30:00",
    createdAt: "2025-08-16T18:15:00", items: [],
  },
  {
    id: "3", orderNumber: "ORD-1003", orderType: "repair", customerId: "3", branchId: "1",
    total: 450000, status: "pending", paymentStatus: "pending", createdDate: "2025-08-16T18:15:00",
    createdAt: "2025-08-16T18:15:00", items: [],
  },
];

export const mockProducts: Product[] = [
  { id: "1", name: "DualSense Controller", sellPrice: 1250000 },
  { id: "2", name: "PS5 Game", sellPrice: 850000 },
];
