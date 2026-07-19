"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Dialog, Input, Textarea } from "@/components/ui";
import { toast } from "@/components/ui";
import { useCreateB2BProfile, useUpdateB2BProfile } from "../apis";
import type { B2BProfile, B2BProfileFormData } from "../types";

interface Props {
  open: boolean;
  customerId: number;
  editing?: B2BProfile | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function B2BFormDialog({
  open,
  customerId,
  editing,
  onClose,
  onSaved,
}: Props) {
  const createB2b = useCreateB2BProfile();
  const updateB2b = useUpdateB2BProfile();
  const isPending = createB2b.isPending || updateB2b.isPending;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<B2BProfileFormData>({
    defaultValues: {
      business_title: "",
      debt_amount_max: 0,
      uni_id: 0,
      discount: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (editing) {
      reset({
        business_title: editing.business_title,
        debt_amount_max: editing.debt_amount_max,
        uni_id: editing.uni_id,
        discount: editing.discount,
        description: editing.description ?? "",
      });
    } else {
      reset({
        business_title: "",
        debt_amount_max: 0,
        uni_id: 0,
        discount: 0,
        description: "",
      });
    }
  }, [editing, open, reset]);

  async function onFormSubmit(data: B2BProfileFormData) {
    try {
      if (editing) {
        await updateB2b.mutateAsync({ customerId, data });
      } else {
        await createB2b.mutateAsync({ customerId, data });
      }
      onSaved();
    } catch (err: any) {
      toast.error(err?.response?.status === 400 ? "اطلاعات را به درستی وارد کنید" : "خطایی رخ داد");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش پروفایل تجاری" : "پروفایل تجاری جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" form="b2b-form" disabled={isPending} className="flex-1">
            {isPending ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="b2b-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="عنوان تجاری"
          required
          placeholder="نام شرکت یا کسب‌وکار"
          error={errors.business_title?.message}
          {...register("business_title", { required: "عنوان تجاری الزامی است" })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="سقف بدهی (تومان)"
            type="number"
            min={0}
            error={errors.debt_amount_max?.message}
            {...register("debt_amount_max", { valueAsNumber: true })}
          />
          <Input
            label="کد یکتا"
            type="number"
            min={0}
            error={errors.uni_id?.message}
            {...register("uni_id", { valueAsNumber: true })}
          />
        </div>
        <Input
          label="درصد تخفیف"
          type="number"
          min={0}
          max={100}
          error={errors.discount?.message}
          {...register("discount", { valueAsNumber: true })}
        />
        <Textarea
          label="توضیحات"
          placeholder="توضیحات قرارداد..."
          {...register("description")}
        />
      </form>
    </Dialog>
  );
}
