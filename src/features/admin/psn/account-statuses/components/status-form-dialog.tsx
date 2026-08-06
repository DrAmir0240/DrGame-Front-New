"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Label } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { AccountStatus } from "../../types";

interface FormValues {
  title: string;
}

interface Props {
  open: boolean;
  editing: AccountStatus | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

export function StatusFormDialog({
  open,
  editing,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { title: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset({ title: editing?.title ?? "" });
  }, [editing, open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش وضعیت" : "وضعیت جدید"}
      description="عنوان وضعیت اکانت را وارد کنید"
      className="max-w-md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            انصراف
          </Button>
          <Button type="submit" form="account-status-form" disabled={loading}>
            {loading ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد"}
          </Button>
        </>
      }
    >
      <form
        id="account-status-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="title">عنوان</Label>
          <Input
            id="title"
            {...register("title", { required: "عنوان الزامی است" })}
            placeholder="مثلاً فعال، مسدود، رزرو شده"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>
      </form>
    </Dialog>
  );
}