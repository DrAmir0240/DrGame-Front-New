import type { RequestStatus, PaymentStatus, InvoiceStatus } from "./types";

export const LIMIT = 10;

export const hrManagementTabs = [
  { value: "resumes", label: "استخدام" },
  { value: "arrivals", label: "حضور و غیاب" },
  { value: "requests", label: "درخواست‌ها" },
  { value: "payrolls", label: "فیش حقوقی" },
  { value: "overtimes", label: "اضافه‌کاری" },
];

export const requestStatusConfig: Record<RequestStatus, { label: string; color: string }> = {
  waiting: { label: "در انتظار بررسی", color: "bg-amber-100 text-amber-700 border-amber-200" },
  accepted: { label: "تایید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200" },
};

export const requestStatusOptions = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "waiting", label: "در انتظار بررسی" },
  { value: "accepted", label: "تایید شده" },
  { value: "rejected", label: "رد شده" },
];

export const paymentStatusConfig: Record<PaymentStatus, { label: string; color: string }> = {
  unpaid: { label: "پرداخت نشده", color: "bg-red-100 text-red-700 border-red-200" },
  partial: { label: "پرداخت جزئی", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "پرداخت شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export const invoiceStatusConfig: Record<InvoiceStatus, { label: string; color: string }> = {
  draft: { label: "پیش‌نویس", color: "bg-gray-100 text-gray-600 border-gray-200" },
  primary: { label: "صادر شده", color: "bg-blue-100 text-blue-700 border-blue-200" },
  finalize: { label: "نهایی", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export const overtimeApprovedConfig: Record<string, { label: string; color: string }> = {
  true: { label: "تایید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  false: { label: "در انتظار", color: "bg-amber-100 text-amber-700 border-amber-200" },
};
