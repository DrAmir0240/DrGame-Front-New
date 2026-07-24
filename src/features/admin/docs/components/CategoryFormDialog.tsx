"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Dialog, Input, Textarea } from "@/components/ui";
import { toast } from "@/components/ui";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
  initialData?: { title: string; description?: string } | null;
}

export default function CategoryFormDialog({ open, title, onClose, onSubmit, initialData }: Props) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{
    title: string;
    description: string;
  }>({
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset(initialData ?? { title: "", description: "" });
    }
  }, [open, initialData, reset]);

  async function onFormSubmit(data: { title: string; description: string }) {
    try {
      await onSubmit({ title: data.title, description: data.description || undefined });
      onClose();
    } catch {
      toast.error("خطایی رخ داد");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={title}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" form="category-form" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </div>
      }
    >
      <form id="category-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="عنوان"
          placeholder="عنوان دسته‌بندی..."
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />
        <Textarea
          label="توضیحات"
          placeholder="توضیحات (اختیاری)..."
          {...register("description")}
        />
      </form>
    </Dialog>
  );
}
