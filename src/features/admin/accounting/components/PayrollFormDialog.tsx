"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useCreatePayroll, useUpdatePayroll, useAccountSidesDropdown } from "../apis";
import { toast } from "@/components/ui";
import type { Payroll, PayrollFormData } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: Payroll | null;
}

const defaultPayrollDetail = {
  base_salary: 0, overtime_amount: 0, bonus: 0, housing_allowance: 0, food_allowance: 0,
  transportation_allowance: 0, insurance_deduction: 0, tax_deduction: 0, loan_deduction: 0,
  other_deductions: 0, work_days: 26, overtime_hours: 0, description: "",
};

export default function PayrollFormDialog({ open, onClose, editItem }: Props) {
  const { data: accountSides = [] } = useAccountSidesDropdown();
  const createPayroll = useCreatePayroll();
  const updatePayroll = useUpdatePayroll();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<PayrollFormData>({
    defaultValues: { account_side: 0, amount: 0, discount: 0, status: "primary", description: "", payroll_detail: defaultPayrollDetail },
  });

  const isPending = createPayroll.isPending || updatePayroll.isPending;

  useEffect(() => {
    if (editItem) {
      reset({
        account_side: editItem.account_side?.id || 0, amount: editItem.amount, discount: 0,
        status: "primary", description: editItem.description || "",
        payroll_detail: { ...defaultPayrollDetail, ...editItem.payroll_detail },
      });
    } else {
      reset({ account_side: 0, amount: 0, discount: 0, status: "primary", description: "", payroll_detail: defaultPayrollDetail });
    }
  }, [editItem, open, reset]);

  async function onFormSubmit(data: PayrollFormData) {
    try {
      if (editItem) { await updatePayroll.mutateAsync({ id: editItem.id, ...data }); }
      else { await createPayroll.mutateAsync(data); }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.status === 400 ? "اطلاعات را به درستی وارد کنید" : "خطایی رخ داد");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()} title={editItem ? "ویرایش فیش حقوقی" : "فیش حقوقی جدید"} className="max-w-2xl max-h-[85vh] overflow-y-auto"
      footer={<>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        <Button type="submit" form="payroll-form" disabled={isPending}>{isPending ? "در حال ذخیره..." : editItem ? "ذخیره" : "ایجاد"}</Button>
      </>}>
      <form id="payroll-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">کارمند <span className="text-red-500">*</span></label>
          <Controller name="account_side" control={control} rules={{ required: "کارمند الزامی است" }}
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger><SelectValue placeholder="انتخاب کارمند" /></SelectTrigger>
                <SelectContent>
                  {accountSides.filter((s) => s.key !== "all").map((s) => <SelectItem key={s.key} value={s.key}>{s.value}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          {errors.account_side && <p className="text-xs text-red-500">{errors.account_side.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="مبلغ کل" type="number" error={errors.amount?.message} {...register("amount", { required: "مبلغ الزامی است", valueAsNumber: true })} />
          <Input label="توضیحات فاکتور" {...register("description")} />
        </div>

        <div className="border border-neutral-200 rounded-lg p-4 space-y-4">
          <h4 className="text-sm font-semibold text-neutral-700 border-b pb-2">جزئیات حقوقی</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="حقوق پایه" type="number" {...register("payroll_detail.base_salary", { valueAsNumber: true })} />
            <Input label="اضافه‌کاری" type="number" {...register("payroll_detail.overtime_amount", { valueAsNumber: true })} />
            <Input label="پاداش" type="number" {...register("payroll_detail.bonus", { valueAsNumber: true })} />
            <Input label="حق مسکن" type="number" {...register("payroll_detail.housing_allowance", { valueAsNumber: true })} />
            <Input label="حق غذا" type="number" {...register("payroll_detail.food_allowance", { valueAsNumber: true })} />
            <Input label="حق ایاب و ذهاب" type="number" {...register("payroll_detail.transportation_allowance", { valueAsNumber: true })} />
          </div>
          <h4 className="text-sm font-semibold text-red-600 border-b pb-2">کسورات</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="بیمه" type="number" {...register("payroll_detail.insurance_deduction", { valueAsNumber: true })} />
            <Input label="مالیات" type="number" {...register("payroll_detail.tax_deduction", { valueAsNumber: true })} />
            <Input label="قرضه" type="number" {...register("payroll_detail.loan_deduction", { valueAsNumber: true })} />
            <Input label="سایر کسورات" type="number" {...register("payroll_detail.other_deductions", { valueAsNumber: true })} />
          </div>
          <h4 className="text-sm font-semibold text-blue-600 border-b pb-2">ساعات کاری</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="روزهای کاری" type="number" {...register("payroll_detail.work_days", { valueAsNumber: true })} />
            <Input label="ساعات اضافه‌کاری" type="number" {...register("payroll_detail.overtime_hours", { valueAsNumber: true })} />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
