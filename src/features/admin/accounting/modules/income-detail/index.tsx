"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader, StatusBadge } from "@/components/shared";
import { useIncomeDetail } from "../../apis";
import { formatPrice } from "@/utils/format";

interface Props {
  id: number;
}

export default function IncomeDetailPage({ id }: Props) {
  const router = useRouter();
  const { data: income, isLoading } = useIncomeDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-neutral-100 rounded animate-pulse w-48" />
        <div className="h-64 bg-neutral-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!income) {
    return <div className="text-center py-20 text-muted-foreground">درآمد یافت نشد</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`درآمد #${income.id}`} description={income.account_side?.name}>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">اطلاعات درآمد</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">طرف حساب:</span>
                <p className="font-medium mt-1">{income.account_side?.name || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">وضعیت:</span>
                <div className="mt-1"><StatusBadge status={income.status} /></div>
              </div>
              <div>
                <span className="text-muted-foreground">وضعیت پرداخت:</span>
                <div className="mt-1"><StatusBadge status={income.payment_status} /></div>
              </div>
              <div>
                <span className="text-muted-foreground">تاریخ ایجاد:</span>
                <p className="font-medium mt-1">{new Date(income.created_at).toLocaleDateString("fa-IR")}</p>
              </div>
            </div>

            {income.description && (
              <div>
                <span className="text-muted-foreground text-sm">توضیحات:</span>
                <p className="mt-1 text-sm">{income.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">خلاصه مالی</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">مبلغ کل:</span>
                <span className="font-bold text-lg">{formatPrice(income.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">تخفیف:</span>
                <span className="font-medium">{formatPrice(income.discount)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground">پرداخت شده:</span>
                <span className="font-medium text-emerald-600">{formatPrice(income.paid_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مانده:</span>
                <span className={`font-bold ${income.remaining_amount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {formatPrice(income.remaining_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
