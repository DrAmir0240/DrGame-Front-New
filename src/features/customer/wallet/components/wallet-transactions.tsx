// src/features/customer/wallet/components/TransactionsList.tsx
"use client";

import { Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionItem } from "./transaction-item";
import type { WalletTransaction } from "../types";
import type { PaginatedResponse } from "../types";

interface Props {
  data?: PaginatedResponse<WalletTransaction>;
  isLoading?: boolean;
  isFetching?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export function TransactionsList({
  data,
  isLoading,
  isFetching,
  page,
  onPageChange,
}: Props) {
  const transactions = data?.results ?? [];

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <History className="h-5 w-5 text-gray-500" />
        <h2 className="text-lg font-semibold text-gray-900">
          تاریخچه تراکنش‌ها
        </h2>
        {data?.count !== undefined && (
          <span className="text-sm text-gray-400">
            ({data.count.toLocaleString("fa-IR")})
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center text-gray-500">
          هنوز تراکنشی ثبت نشده است
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      )}

      {data && (data.next || data.previous) && (
        <div className="mt-8 flex justify-center gap-3">
          <Button
            variant="outline"
            disabled={!data.previous || isFetching}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            قبلی
          </Button>
          <Button
            variant="outline"
            disabled={!data.next || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}