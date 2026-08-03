// src/features/customer/wallet/components/TransactionItem.tsx
"use client";

import { ArrowDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { typeConfig, statusLabel } from "../constants";
import type { WalletTransaction } from "../types";

interface Props {
  transaction: WalletTransaction;
}

export function TransactionItem({ transaction }: Props) {
  const config = typeConfig[transaction.type] ?? {
    label: transaction.type,
    icon: ArrowDownLeft,
    color: "text-gray-600",
    bg: "bg-gray-50",
    isPositive: true,
  };

  const Icon = config.icon;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 transition hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            config.bg
          )}
        >
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>

        <div>
          <p className="font-medium text-gray-900">{config.label}</p>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
            <span>
              {new Date(transaction.created_at).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span
              className={cn(
                transaction.status === "success" && "text-emerald-600",
                transaction.status === "pending" && "text-amber-600",
                transaction.status === "failed" && "text-rose-600"
              )}
            >
              {statusLabel[transaction.status] ?? transaction.status}
            </span>
          </div>
        </div>
      </div>

      <div className="text-left">
        <p
          className={cn(
            "font-semibold",
            config.isPositive ? "text-emerald-600" : "text-rose-600"
          )}
        >
          {config.isPositive ? "+" : "−"}
          {transaction.amount.toLocaleString("fa-IR")}
        </p>
        <p className="mt-0.5 text-xs text-gray-400">
          موجودی: {transaction.balance_after.toLocaleString("fa-IR")}
        </p>
      </div>
    </div>
  );
}