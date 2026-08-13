"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import type { BlogCategory } from "../../types";

interface FormValues {
  title: string;
  description: string;
}

interface Props {
  open: boolean;
  editing: BlogCategory | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

export function CategoryFormDialog({
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
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (editing) {
      reset({
        title: editing.title ?? "",
        description: editing.description ?? "",
      });
    } else {
      reset({ title: "", description: "" });
    }
  }, [editing, open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
      description="عنوان و توضیحات دسته‌بندی بلاگ"
      className="max-w-md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            انصراف
          </Button>
          <Button type="submit" form="blog-category-form" disabled={loading}>
            {loading ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "ایجاد"}
          </Button>
        </>
      }
    >
      <form
        id="blog-category-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="space-y-2">
          <Label htmlFor="title">عنوان</Label>
          <Input
            id="title"
            {...register("title", { required: "عنوان الزامی است" })}
            placeholder="مثلاً اخبار، آموزش، نقد و بررسی"
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">توضیحات</Label>
          <Textarea
            id="description"
            rows={3}
            {...register("description")}
            placeholder="توضیح کوتاه (اختیاری)"
          />
        </div>
      </form>
    </Dialog>
  );
}