// src/features/customer/wallet/components/WalletBalanceCard.tsx
"use client";

import { Wallet, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  balance: number;
  isLoading?: boolean;
  onChargeClick: () => void;
}

export function WalletBalanceCard({
  balance,
  isLoading,
  onChargeClick,
}: Props) {
  if (isLoading) {
    return <div className="h-52 animate-pulse rounded-3xl bg-gray-200" />;
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-6 text-white shadow-xl">
      <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/80">
            <Wallet className="h-5 w-5" />
            <span className="text-sm font-medium">کیف پول من</span>
          </div>
          <div className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-sm">
            فعال
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm text-white/70">موجودی فعلی</p>
          <h2 className="mt-1 text-4xl font-bold tracking-tight">
            {balance.toLocaleString("fa-IR")}
            <span className="mr-2 text-lg font-normal text-white/80">
              تومان
            </span>
          </h2>
        </div>

        <div className="mt-8">
          <Button
            onClick={onChargeClick}
            className="w-full gap-2 bg-white text-indigo-700 hover:bg-white/90"
          >
            <Plus className="h-4 w-4" />
            شارژ کیف پول
          </Button>
        </div>
      </div>
    </div>
  );
}