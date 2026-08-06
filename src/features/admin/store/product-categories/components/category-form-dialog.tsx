"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { StoreProductCategory } from "../../types";

interface FormValues {
  title: string;
}

interface Props {
  open: boolean;
  editing: StoreProductCategory | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string }) => Promise<void>;
}

export function CategoryFormDialog({
  open,
  editing,
  loading,
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
    reset({ title: editing?.title ?? "" });
  }, [editing, open, reset]);

  const submit = async (values: FormValues) => {
    await onSubmit({ title: values.title.trim() });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش دسته‌بندی کالا" : "دسته‌بندی کالا جدید"}
      description="نام دسته‌بندی محصولات فروشگاه را وارد کنید"
      className="max-w-md"
      footer={
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="product-category-form"
            className="flex-1 gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ذخیره...
              </>
            ) : editing ? (
              "ذخیره تغییرات"
            ) : (
              "ایجاد"
            )}
          </Button>
        </div>
      }
    >
      <form
        id="product-category-form"
        onSubmit={handleSubmit(submit)}
        className="space-y-4"
      >
        <Input
          id="title"
          label="عنوان"
          required
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />
      </form>
    </Dialog>
  );
}
