"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useCreateIncome, useUpdateIncome, useAccountSidesDropdown, useCategoryDropdown } from "../apis";
import { toast } from "@/components/ui";
import type { Income, IncomeFormData } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: Income | null;
}

export default function IncomeFormDialog({ open, onClose, editItem }: Props) {
  const { data: accountSides = [] } = useAccountSidesDropdown();
  const { data: categories = [] } = useCategoryDropdown();
  const createIncome = useCreateIncome();
  const updateIncome = useUpdateIncome();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<IncomeFormData>({
    defaultValues: { account_side: 0, amount: 0, discount: 0, status: "draft", description: "" },
  });

  const isPending = createIncome.isPending || updateIncome.isPending;

  useEffect(() => {
    if (editItem) {
      reset({ account_side: editItem.account_side?.id || 0, amount: editItem.amount, discount: editItem.discount, status: editItem.status, description: editItem.description || "", category: editItem.category?.id || undefined });
    } else {
      reset({ account_side: 0, amount: 0, discount: 0, status: "draft", description: "" });
    }
  }, [editItem, open, reset]);

  async function onFormSubmit(data: IncomeFormData) {
    try {
      if (editItem) { await updateIncome.mutateAsync({ id: editItem.id, ...data }); }
      else { await createIncome.mutateAsync(data); }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.status === 400 ? "اطلاعات را به درستی وارد کنید" : "خطایی رخ داد");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()} title={editItem ? "ویرایش درآمد" : "درآمد جدید"} className="max-w-lg"
      footer={<>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        <Button type="submit" form="income-form" disabled={isPending}>{isPending ? "در حال ذخیره..." : editItem ? "ذخیره" : "ایجاد"}</Button>
      </>}>
      <form id="income-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">طرف حساب <span className="text-red-500">*</span></label>
          <Controller name="account_side" control={control} rules={{ required: "طرف حساب الزامی است" }}
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger><SelectValue placeholder="انتخاب طرف حساب" /></SelectTrigger>
                <SelectContent>
                  {accountSides.map((s) => <SelectItem key={s.key} value={s.key}>{s.value}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
          {errors.account_side && <p className="text-xs text-red-500">{errors.account_side.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">دسته‌بندی</label>
          <Controller name="category" control={control}
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger><SelectValue placeholder="انتخاب دسته‌بندی" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.key} value={c.key}>{c.value}</SelectItem>)}
                </SelectContent>
              </Select>
            )} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="مبلغ" type="number" error={errors.amount?.message} {...register("amount", { required: "مبلغ الزامی است", valueAsNumber: true })} />
          <Input label="تخفیف" type="number" {...register("discount", { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">وضعیت</label>
          <Controller name="status" control={control} render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">پیش‌نویس</SelectItem>
                <SelectItem value="primary">صادر شده</SelectItem>
                <SelectItem value="finalize">نهایی</SelectItem>
              </SelectContent>
            </Select>
          )} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">توضیحات</label>
          <textarea {...register("description")} rows={2} className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-600" />
        </div>
      </form>
    </Dialog>
  );
}
