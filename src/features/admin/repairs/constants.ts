import type { DeviceType, RepairOrder, RepairStatus } from "./types";

export const deviceTypes: Record<DeviceType, string> = {
  console: "کنسول",
  controller: "دسته بازی",
  other: "سایر",
};

export const statusActions: Partial<Record<RepairStatus, { label: string; next: RepairStatus }[]>> = {
  pending: [{ label: "دریافت شد", next: "received" }],
  received: [{ label: "بررسی", next: "under_review" }],
  under_review: [{ label: "قیمت‌گذاری", next: "price_set" }],
  price_set: [{ label: "تأیید مشتری", next: "approved" }],
  approved: [{ label: "شروع تعمیر", next: "in_repair" }],
  in_repair: [{ label: "تعمیر شد", next: "repaired" }],
  repaired: [{ label: "تکمیل", next: "completed" }],
};

export const initialRepairs: RepairOrder[] = [
  { id: 1, created_date: "2025-06-01T10:00:00", device_type: "console", device_model: "PS5 Slim", issue_description: "روشن نمیشه", notes: "", technician_price: 500000, final_price: 800000, status: "received" },
  { id: 2, created_date: "2025-06-02T12:00:00", device_type: "controller", device_model: "DualSense", issue_description: "دریفت آنالوگ", notes: "", technician_price: null, final_price: null, status: "under_review" },
];

export function formatPrice(n: number | null | undefined) {
  return n ? new Intl.NumberFormat("fa-IR").format(n) + " ت" : "—";
}
