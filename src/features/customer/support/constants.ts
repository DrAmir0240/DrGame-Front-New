import {
  CircleDot,
  Clock,
  Loader2,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  User,
  Package,
  HelpCircle,
} from "lucide-react";
import type { TicketCategory, TicketStatus, TicketPriority } from "./types";

export const categoryConfig: Record<
  TicketCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  order: {
    label: "سفارش",
    icon: Package,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  payment: {
    label: "پرداخت",
    icon: CreditCard,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  account: {
    label: "حساب کاربری",
    icon: User,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  general: {
    label: "عمومی",
    icon: HelpCircle,
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
};

export const statusConfig: Record<
  TicketStatus,
  { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  open: {
    label: "باز",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: CircleDot,
  },
  in_progress: {
    label: "در حال بررسی",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: Loader2,
  },
  waiting: {
    label: "منتظر پاسخ",
    color: "text-violet-700",
    bg: "bg-violet-50",
    icon: Clock,
  },
  closed: {
    label: "بسته شده",
    color: "text-gray-600",
    bg: "bg-gray-100",
    icon: CheckCircle2,
  },
};

export const priorityConfig: Record<
  TicketPriority,
  { label: string; color: string; bg: string }
> = {
  low: {
    label: "کم",
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
  medium: {
    label: "متوسط",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  high: {
    label: "بالا",
    color: "text-rose-700",
    bg: "bg-rose-50",
  },
};

export const statusFilters: { value: TicketStatus | "all"; label: string }[] = [
  { value: "all", label: "همه" },
  { value: "open", label: "باز" },
  { value: "in_progress", label: "در حال بررسی" },
  { value: "waiting", label: "منتظر پاسخ" },
  { value: "closed", label: "بسته" },
];

export const categoryOptions: { value: TicketCategory; label: string }[] = [
  { value: "order", label: "سفارش" },
  { value: "payment", label: "پرداخت" },
  { value: "account", label: "حساب کاربری" },
  { value: "general", label: "عمومی" },
];