import type { OrderStatus } from "../../types";

export const statusFlow: OrderStatus[] = [
  "pending", "confirmed", "processing", "ready", "dispatched", "delivered", "completed",
];

export const statusLabels: Record<OrderStatus, string> = {
  pending: "در انتظار",
  confirmed: "تأیید",
  processing: "پردازش",
  ready: "آماده",
  dispatched: "ارسال",
  delivered: "تحویل",
  completed: "تکمیل",
  cancelled: "لغو",
};

