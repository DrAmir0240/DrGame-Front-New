"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { useCreateSales, useUpdateSales, useAccountSidesDropdown, useCategoryDropdown } from "../apis";
import { toast } from "@/components/ui";
import type { Sales, SalesFormData } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: Sales | null;
}

export default function SalesFormDialog({ open, onClose, editItem }: Props) {
  const { data: accountSides = [] } = useAccountSidesDropdown();
  const { data: categories = [] } = useCategoryDropdown();
  const createSales = useCreateSales();
  const updateSales = useUpdateSales();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<SalesFormData>({
    defaultValues: { account_side: 0, amount: 0, discount: 0, status: "primary", description: "" },
  });

  const isPending = createSales.isPending || updateSales.isPending;

  useEffect(() => {
    if (editItem) {
      reset({
        account_side: editItem.account_side?.id || 0, amount: editItem.amount,
        discount: 0, status: "primary", description: editItem.description || "", category: editItem.category?.id || undefined,
      });
    } else {
      reset({ account_side: 0, amount: 0, discount: 0, status: "primary", description: "" });
    }
  }, [editItem, open, reset]);

  async function onFormSubmit(data: SalesFormData) {
    try {
      if (editItem) { await updateSales.mutateAsync({ id: editItem.id, ...data }); }
      else { await createSales.mutateAsync(data); }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.status === 400 ? "اطلاعات را به درستی وارد کنید" : "خطایی رخ داد");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()} title={editItem ? "ویرایش فاکتور فروش" : "فاکتور فروش جدید"}
      footer={<>
        <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
        <Button type="submit" form="sales-form" disabled={isPending}>{isPending ? "در حال ذخیره..." : editItem ? "ذخیره" : "ایجاد"}</Button>
      </>}>
      <form id="sales-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">طرف حساب <span className="text-red-500">*</span></label>
          <Controller name="account_side" control={control} rules={{ required: "طرف حساب الزامی است" }}
            render={({ field }) => (
              <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger><SelectValue placeholder="انتخاب طرف حساب" /></SelectTrigger>
                <SelectContent>
                  {accountSides.filter((s) => s.key !== "all").map((s) => <SelectItem key={s.key} value={s.key}>{s.value}</SelectItem>)}
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
          <Input label="توضیحات" {...register("description")} />
        </div>
      </form>
    </Dialog>
  );
}
