import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import type { WalletTransactionType } from "./types";

export const typeConfig: Record<
  WalletTransactionType,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
    isPositive: boolean;
  }
> = {
  charge_admin: {
    label: "شارژ توسط ادمین",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    isPositive: true,
  },
  charge_gateway: {
    label: "شارژ آنلاین",
    icon: CreditCard,
    color: "text-blue-600",
    bg: "bg-blue-50",
    isPositive: true,
  },
  debit_order: {
    label: "پرداخت سفارش",
    icon: ArrowUpRight,
    color: "text-rose-600",
    bg: "bg-rose-50",
    isPositive: false,
  },
  refund: {
    label: "برگشت وجه",
    icon: RefreshCcw,
    color: "text-amber-600",
    bg: "bg-amber-50",
    isPositive: true,
  },
};

export const statusLabel: Record<string, string> = {
  success: "موفق",
  pending: "در انتظار",
  failed: "ناموفق",
};

export const quickAmounts = [50_000, 100_000, 200_000, 500_000, 1_000_000];