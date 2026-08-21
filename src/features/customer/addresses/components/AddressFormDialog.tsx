"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dialog, Input, Textarea, Switch } from "@/components/ui";
import { useCreateAddress, useUpdateAddress } from "../apis";
import type { Address } from "../types";

interface FormValues {
  title: string;
  receiver_name: string;
  receiver_phone: string;
  province: string;
  city: string;
  address: string;
  postal_code: string;
  is_default: boolean;
}

const EMPTY: FormValues = {
  title: "",
  receiver_name: "",
  receiver_phone: "",
  province: "",
  city: "",
  address: "",
  postal_code: "",
  is_default: false,
};

interface Props {
  open: boolean;
  editing: Address | null;
  customerId?: number | null;
  onClose: () => void;
  onSaved?: () => void;
}

export default function AddressFormDialog({ open, editing, customerId, onClose, onSaved }: Props) {
  const createAddress = useCreateAddress(customerId);
  const updateAddress = useUpdateAddress(customerId);
  const isPending = createAddress.isPending || updateAddress.isPending;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: EMPTY });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          title: editing.title,
          receiver_name: editing.receiver_name,
          receiver_phone: editing.receiver_phone,
          province: editing.province,
          city: editing.city,
          address: editing.address,
          postal_code: editing.postal_code,
          is_default: editing.is_default,
        });
      } else {
        reset(EMPTY);
      }
    }
  }, [editing, open, reset]);

  async function onFormSubmit(data: FormValues) {
    try {
      if (editing) {
        await updateAddress.mutateAsync({ id: editing.id, ...data });
      } else {
        await createAddress.mutateAsync(data);
      }
      onSaved?.();
      onClose();
    } catch {
      // toast handled in hook
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش آدرس" : "آدرس جدید"}
      className="max-w-lg"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" form="address-form" disabled={isPending} className="flex-1">
            {isPending ? "در حال ذخیره..." : editing ? "ذخیره" : "افزودن"}
          </Button>
        </div>
      }
    >
      <form id="address-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="عنوان"
          placeholder="مثلاً خانه، محل کار"
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />
        <Input
          label="نام گیرنده"
          placeholder="نام و نام خانوادگی گیرنده"
          error={errors.receiver_name?.message}
          {...register("receiver_name", { required: "نام گیرنده الزامی است" })}
        />
        <Input
          label="موبایل گیرنده"
          placeholder="09xxxxxxxxx"
          maxLength={11}
          dir="ltr"
          className="text-left"
          autoComplete="tel"
          error={errors.receiver_phone?.message}
          {...register("receiver_phone", {
            required: "موبایل گیرنده الزامی است",
            pattern: { value: /^09\d{9}$/, message: "شماره موبایل معتبر نیست" },
          })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="استان"
            placeholder="استان"
            error={errors.province?.message}
            {...register("province", { required: "استان الزامی است" })}
          />
          <Input
            label="شهر"
            placeholder="شهر"
            error={errors.city?.message}
            {...register("city", { required: "شهر الزامی است" })}
          />
        </div>
        <Textarea
          label="نشانی کامل"
          placeholder="خیابان، کوچه، پلاک..."
          error={errors.address?.message}
          {...register("address", { required: "نشانی الزامی است" })}
        />
        <Input
          label="کد پستی"
          placeholder="کد پستی ۱۰ رقمی"
          maxLength={10}
          dir="ltr"
          className="text-left"
          error={errors.postal_code?.message}
          {...register("postal_code", {
            required: "کد پستی الزامی است",
            pattern: { value: /^\d{10}$/, message: "کد پستی باید ۱۰ رقم باشد" },
          })}
        />
        <Controller
          control={control}
          name="is_default"
          render={({ field }) => (
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Switch checked={!!field.value} onCheckedChange={field.onChange} />
              <span className="text-sm">تنظیم به عنوان آدرس پیش‌فرض</span>
            </label>
          )}
        />
      </form>
    </Dialog>
  );
}
