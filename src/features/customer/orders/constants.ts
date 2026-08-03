import {
  Package,
  Gamepad2,
  Wrench,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Loader2,
} from "lucide-react";
import type { OrderType, OrderStatus } from "./types";

export const orderTypeConfig: Record<
  OrderType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }
> = {
  product: {
    label: "محصول",
    icon: Package,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  sony: {
    label: "اکانت سونی",
    icon: Gamepad2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  repair: {
    label: "تعمیرات",
    icon: Wrench,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
};

export const orderStatusConfig: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: "در انتظار",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: Clock,
  },
  processing: {
    label: "در حال پردازش",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: Loader2,
  },
  confirmed: {
    label: "تأیید شده",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    icon: CheckCircle2,
  },
  preparing: {
    label: "آماده‌سازی",
    color: "text-violet-700",
    bg: "bg-violet-50",
    icon: Package,
  },
  shipped: {
    label: "ارسال شده",
    color: "text-sky-700",
    bg: "bg-sky-50",
    icon: Truck,
  },
  delivered: {
    label: "تحویل شده",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  completed: {
    label: "تکمیل شده",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "لغو شده",
    color: "text-rose-700",
    bg: "bg-rose-50",
    icon: XCircle,
  },
  rejected: {
    label: "رد شده",
    color: "text-rose-700",
    bg: "bg-rose-50",
    icon: XCircle,
  },
};

export const orderTypeFilters: { value: OrderType | "all"; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "product", label: "محصول" },
  { value: "sony", label: "اکانت سونی" },
  { value: "repair", label: "تعمیرات" },
];