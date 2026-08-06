"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { GameCategory } from "../../types";

interface FormValues {
  title: string;
  description: string;
}

interface Props {
  open: boolean;
  editing: GameCategory | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; description: string }) => Promise<void>;
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
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    reset({
      title: editing?.title ?? "",
      description: editing?.description ?? "",
    });
  }, [editing, open, reset]);

  const submit = async (values: FormValues) => {
    await onSubmit({ title: values.title.trim(), description: values.description.trim() });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش دسته‌بندی بازی" : "دسته‌بندی بازی جدید"}
      description="نام دسته‌بندی بازی‌های فروشگاه را وارد کنید"
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
            form="game-category-form"
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
        id="game-category-form"
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

        <div>
          <label className="mb-2 block text-sm font-medium">توضیحات</label>
          <textarea
            rows={3}
            className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-secondary-600"
            {...register("description")}
          />
        </div>
      </form>
    </Dialog>
  );
}
