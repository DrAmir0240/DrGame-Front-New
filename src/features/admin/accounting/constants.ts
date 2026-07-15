import type { InvoiceStatus, PaymentStatus, TransactionDirection, AccountSideType } from "./types";

export const invoiceStatusConfig: Record<InvoiceStatus, { label: string; color: string }> = {
  draft: { label: "پیش‌نویس", color: "bg-gray-100 text-gray-600 border-gray-200" },
  primary: { label: "صادر شده", color: "bg-blue-100 text-blue-700 border-blue-200" },
  finalize: { label: "نهایی", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  unpaid: { label: "پرداخت نشده", color: "bg-red-100 text-red-700 border-red-200" },
  partial: { label: "پرداخت ناقص", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "پرداخت شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export const directionConfig: Record<TransactionDirection, { label: string; color: string }> = {
  in: { label: "دریافت", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  out: { label: "پرداخت", color: "bg-red-100 text-red-700 border-red-200" },
};

export const accountSideTypeConfig: Record<AccountSideType, { label: string }> = {
  customer: { label: "مشتری" },
  supplier: { label: "تأمین‌کننده" },
  employee: { label: "کارمند" },
  other: { label: "سایر" },
};

export const invoiceStatusOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "primary", label: "صادر شده" },
  { value: "finalize", label: "نهایی" },
];

export const paymentStatusOptions = [
  { value: "all", label: "همه وضعیت پرداخت" },
  { value: "unpaid", label: "پرداخت نشده" },
  { value: "partial", label: "پرداخت ناقص" },
  { value: "paid", label: "پرداخت شده" },
];

export const directionOptions = [
  { value: "all", label: "همه جهت‌ها" },
  { value: "in", label: "دریافت" },
  { value: "out", label: "پرداخت" },
];

export const accountSideTypeOptions = [
  { value: "all", label: "همه انواع" },
  { value: "customer", label: "مشتری" },
  { value: "supplier", label: "تأمین‌کننده" },
  { value: "employee", label: "کارمند" },
  { value: "other", label: "سایر" },
];

export const accountingTabs = [
  { value: "reports", label: "گزارش‌های مالی" },
  { value: "daily", label: "دفتر روزانه" },
  { value: "accounting", label: "حسابداری" },
];
