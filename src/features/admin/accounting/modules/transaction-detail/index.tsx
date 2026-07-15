"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader, StatusBadge } from "@/components/shared";
import { useDailyTransactionDetail } from "../../apis";
import { formatPrice } from "@/utils/format";

interface Props {
  id: number;
}

export default function TransactionDetailPage({ id }: Props) {
  const router = useRouter();
  const { data: transaction, isLoading } = useDailyTransactionDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-neutral-100 rounded animate-pulse w-48" />
        <div className="h-64 bg-neutral-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!transaction) {
    return <div className="text-center py-20 text-muted-foreground">تراکنش یافت نشد</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`تراکنش #${transaction.id}`} description={transaction.account_side?.name}>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">اطلاعات تراکنش</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">طرف حساب:</span>
              <p className="font-medium mt-1">{transaction.account_side?.name || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">حساب بانکی:</span>
              <p className="font-medium mt-1">{transaction.bank_account?.title || "—"}</p>
            </div>
            <div>
              <span className="text-muted-foreground">جهت:</span>
              <div className="mt-1"><StatusBadge status={transaction.direction} /></div>
            </div>
            <div>
              <span className="text-muted-foreground">تاریخ ایجاد:</span>
              <p className="font-medium mt-1">{new Date(transaction.created_at).toLocaleDateString("fa-IR")}</p>
            </div>
          </div>

          {transaction.description && (
            <div>
              <span className="text-muted-foreground text-sm">توضیحات:</span>
              <p className="mt-1 text-sm">{transaction.description}</p>
            </div>
          )}
        </div>

        <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold border-b pb-2 mb-4">جزئیات مالی</h3>
          <div className="text-center p-6 rounded-xl bg-neutral-50">
            <span className="text-sm text-muted-foreground">مبلغ تراکنش</span>
            <p className={`text-3xl font-bold mt-2 ${transaction.direction === "in" ? "text-emerald-600" : "text-red-600"}`}>
              {transaction.direction === "in" ? "+" : "-"}{formatPrice(transaction.amount)}
            </p>
            <div className="mt-2">
              <StatusBadge status={transaction.direction} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
