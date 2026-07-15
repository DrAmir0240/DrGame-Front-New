"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader, StatusBadge } from "@/components/shared";
import { usePayrollDetail } from "../../apis";
import { formatPrice } from "@/utils/format";
import PayrollDetailInfo from "../../components/PayrollDetailInfo";

interface Props {
  id: number;
}

export default function PayrollDetailPage({ id }: Props) {
  const router = useRouter();
  const { data: payroll, isLoading } = usePayrollDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-neutral-100 rounded animate-pulse w-48" />
        <div className="h-64 bg-neutral-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!payroll) {
    return <div className="text-center py-20 text-muted-foreground">فیش حقوقی یافت نشد</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader title={`فیش حقوقی #${payroll.id}`} description={payroll.account_side?.name}>
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowRight className="w-4 h-4" /> بازگشت
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">اطلاعات فیش حقوقی</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">کارمند:</span>
                <p className="font-medium mt-1">{payroll.account_side?.name || "—"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">وضعیت پرداخت:</span>
                <div className="mt-1"><StatusBadge status={payroll.payment_status} /></div>
              </div>
              <div>
                <span className="text-muted-foreground">تاریخ ایجاد:</span>
                <p className="font-medium mt-1">{new Date(payroll.created_at).toLocaleDateString("fa-IR")}</p>
              </div>
            </div>
            {payroll.description && (
              <div>
                <span className="text-muted-foreground text-sm">توضیحات فاکتور:</span>
                <p className="mt-1 text-sm">{payroll.description}</p>
              </div>
            )}
          </div>

          {payroll.payroll_detail && <PayrollDetailInfo detail={payroll.payroll_detail} />}
        </div>

        <div className="space-y-6">
          <div className="bg-neutral-0 border border-neutral-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">خلاصه مالی</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">مبلغ کل:</span>
                <span className="font-bold text-lg">{formatPrice(payroll.amount)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-muted-foreground">پرداخت شده:</span>
                <span className="font-medium text-emerald-600">{formatPrice(payroll.paid_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">مانده:</span>
                <span className={`font-bold ${payroll.remaining_amount > 0 ? "text-red-600" : "text-emerald-600"}`}>
                  {formatPrice(payroll.remaining_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
