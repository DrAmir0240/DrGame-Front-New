import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; color: string }> = {
  available: { label: "موجود", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  sold: { label: "فروخته‌شده", color: "bg-blue-100 text-blue-700 border-blue-200" },
  returned: { label: "برگشتی", color: "bg-amber-100 text-amber-700 border-amber-200" },
  transferred: { label: "انتقال‌یافته", color: "bg-purple-100 text-purple-700 border-purple-200" },
  damaged: { label: "آسیب‌دیده", color: "bg-red-100 text-red-700 border-red-200" },
  pending: { label: "در انتظار", color: "bg-amber-100 text-amber-700 border-amber-200" },
  confirmed: { label: "تأیید شده", color: "bg-blue-100 text-blue-700 border-blue-200" },
  processing: { label: "در حال پردازش", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  ready: { label: "آماده", color: "bg-teal-100 text-teal-700 border-teal-200" },
  dispatched: { label: "ارسال شده", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  delivered: { label: "تحویل شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  completed: { label: "تکمیل شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  cancelled: { label: "لغو شده", color: "bg-red-100 text-red-700 border-red-200" },
  approved: { label: "تأیید شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  rejected: { label: "رد شده", color: "bg-red-100 text-red-700 border-red-200" },
  in_transit: { label: "در مسیر", color: "bg-blue-100 text-blue-700 border-blue-200" },
  unpaid: { label: "پرداخت نشده", color: "bg-red-100 text-red-700 border-red-200" },
  partial: { label: "ناقص", color: "bg-amber-100 text-amber-700 border-amber-200" },
  paid: { label: "پرداخت شده", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  received: { label: "دریافت شده", color: "bg-blue-100 text-blue-700 border-blue-200" },
  under_review: { label: "در حال بررسی", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  price_set: { label: "قیمت‌گذاری شده", color: "bg-purple-100 text-purple-700 border-purple-200" },
  in_repair: { label: "در حال تعمیر", color: "bg-orange-100 text-orange-700 border-orange-200" },
  repaired: { label: "تعمیر شده", color: "bg-teal-100 text-teal-700 border-teal-200" },
  b2c: { label: "عادی", color: "bg-blue-100 text-blue-700 border-blue-200" },
  b2b: { label: "سازمانی", color: "bg-purple-100 text-purple-700 border-purple-200" },
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge =({ status }: StatusBadgeProps) =>{
  const config = statusConfig[status] || { label: status, color: "bg-muted text-muted-foreground" };
  return (
    <Badge variant="outline" className={cn("text-xs border", config.color)}>
      {config.label}
    </Badge>
  );
}