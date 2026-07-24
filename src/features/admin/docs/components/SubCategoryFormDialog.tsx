"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { toast } from "@/components/ui";

interface Category {
  id: number;
  title: string;
}

interface Props {
  open: boolean;
  title: string;
  categories: Category[];
  parentCategoryId?: number | null;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string; category: number }) => Promise<void>;
}

export default function SubCategoryFormDialog({ open, title, categories, parentCategoryId, onClose, onSubmit }: Props) {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<{
    title: string;
    description: string;
    category: number | null;
  }>({
    defaultValues: { title: "", description: "", category: null },
  });

  const selectedCategory = watch("category");

  useEffect(() => {
    if (open) {
      reset({ title: "", description: "", category: parentCategoryId ?? null });
    }
  }, [open, parentCategoryId, reset]);

  async function onFormSubmit(data: { title: string; description: string; category: number | null }) {
    if (!data.category) {
      toast.error("دسته‌بندی اصلی را انتخاب کنید");
      return;
    }
    try {
      await onSubmit({
        title: data.title,
        description: data.description || undefined,
        category: data.category,
      });
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
          <Button type="submit" form="subcategory-form" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </div>
      }
    >
      <form id="subcategory-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="عنوان"
          placeholder="عنوان زیردسته‌بندی..."
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />
        <Textarea
          label="توضیحات"
          placeholder="توضیحات (اختیاری)..."
          {...register("description")}
        />
        <Select
          value={selectedCategory ? String(selectedCategory) : ""}
          onValueChange={(v) => setValue("category", Number(v))}
        >
          <SelectTrigger label="دسته‌بندی اصلی" />
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={String(cat.id)}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    </Dialog>
  );
}
