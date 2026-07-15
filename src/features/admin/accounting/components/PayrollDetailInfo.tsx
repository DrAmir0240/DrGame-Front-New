"use client";

import { formatPrice } from "@/utils/format";
import type { PayrollDetail } from "../types";

interface Props {
  detail: PayrollDetail;
}

export default function PayrollDetailInfo({ detail }: Props) {
  return (
    <div className="border border-neutral-200 rounded-lg p-4 space-y-4">
      <h4 className="text-sm font-semibold text-neutral-700 border-b pb-2">جزئیات فیش حقوقی</h4>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">حقوق پایه:</span><span className="font-medium">{formatPrice(detail.base_salary)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">اضافه‌کاری:</span><span className="font-medium">{formatPrice(detail.overtime_amount)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">پاداش:</span><span className="font-medium">{formatPrice(detail.bonus)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">حق مسکن:</span><span className="font-medium">{formatPrice(detail.housing_allowance)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">حق غذا:</span><span className="font-medium">{formatPrice(detail.food_allowance)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">حق ایاب و ذهاب:</span><span className="font-medium">{formatPrice(detail.transportation_allowance)}</span></div>
      </div>

      <div className="border-t pt-3 grid grid-cols-2 gap-3 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">بیمه:</span><span className="font-medium text-red-600">-{formatPrice(detail.insurance_deduction)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">مالیات:</span><span className="font-medium text-red-600">-{formatPrice(detail.tax_deduction)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">قرضه:</span><span className="font-medium text-red-600">-{formatPrice(detail.loan_deduction)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">سایر کسورات:</span><span className="font-medium text-red-600">-{formatPrice(detail.other_deductions)}</span></div>
      </div>

      <div className="border-t pt-3 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">روزهای کاری:</span><span>{detail.work_days} روز</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">ساعات اضافه‌کاری:</span><span>{detail.overtime_hours} ساعت</span></div>
        {detail.gross_salary !== undefined && <div className="flex justify-between border-t pt-2 font-bold"><span>مجموع حقوق ناخالص:</span><span>{formatPrice(detail.gross_salary)}</span></div>}
        {detail.total_deductions !== undefined && <div className="flex justify-between font-bold"><span>مجموع کسورات:</span><span className="text-red-600">-{formatPrice(detail.total_deductions)}</span></div>}
        {detail.net_salary !== undefined && <div className="flex justify-between text-lg font-bold text-emerald-600 border-t pt-2"><span>خالص دریافتی:</span><span>{formatPrice(detail.net_salary)}</span></div>}
      </div>

      {detail.description && <div className="border-t pt-3 text-sm"><span className="text-muted-foreground">توضیحات:</span><p className="mt-1">{detail.description}</p></div>}
    </div>
  );
}
