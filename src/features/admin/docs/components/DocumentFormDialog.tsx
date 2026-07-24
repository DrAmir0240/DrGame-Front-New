"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { toast } from "@/components/ui";

interface Category {
  id: number;
  title: string;
}

interface SubCategory {
  id: number;
  title: string;
  category: number;
}

interface Props {
  open: boolean;
  editing: any | null;
  categories: Category[];
  subCategories: SubCategory[];
  onClose: () => void;
  onSaved: () => void;
  onSubmit: (formData: FormData) => Promise<any>;
}

export default function DocumentFormDialog({ open, editing, categories, subCategories, onClose, onSaved, onSubmit }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<{
    title: string;
    category: number | null;
    sub_category: number | null;
  }>({
    defaultValues: { title: "", category: null, sub_category: null },
  });

  const selectedMainCategory = watch("category");
  const filteredSubCategories = selectedMainCategory
    ? subCategories.filter((sc) => sc.category === selectedMainCategory)
    : [];

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          title: editing.title ?? "",
          category: editing.main_category_id ?? null,
          sub_category: editing.category ?? null,
        });
      } else {
        reset({ title: "", category: null, sub_category: null });
      }
      setFile(null);
    }
  }, [editing, open, reset]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  async function onFormSubmit(data: { title: string; category: number | null; sub_category: number | null }) {
    if (!data.sub_category) {
      toast.error("زیردسته‌بندی را انتخاب کنید");
      return;
    }
    if (!editing && !file) {
      toast.error("فایل سند را انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", String(data.sub_category));
    if (file) formData.append("file", file);

    try {
      await onSubmit(formData);
      onSaved();
    } catch {
      toast.error("خطایی رخ داد");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش سند" : "سند جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" form="document-form" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="document-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="عنوان"
          placeholder="عنوان سند..."
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />

        <Select
          value={selectedMainCategory ? String(selectedMainCategory) : ""}
          onValueChange={(v) => {
            setValue("category", Number(v));
            setValue("sub_category", null);
          }}
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

        <Select
          value={watch("sub_category") ? String(watch("sub_category")) : ""}
          onValueChange={(v) => setValue("sub_category", Number(v))}
          disabled={!selectedMainCategory}
        >
          <SelectTrigger label="زیردسته‌بندی" />
          <SelectContent>
            {filteredSubCategories.map((sc) => (
              <SelectItem key={sc.id} value={String(sc.id)}>
                {sc.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">فایل سند</label>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
            {editing && !file ? "تغییر فایل" : "انتخاب فایل"}
          </Button>
          {file && <span className="text-xs text-neutral-500 mr-2">{file.name}</span>}
          {editing && !file && editing.file && (
            <a href={editing.file} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 mr-2 hover:underline">
              مشاهده فایل فعلی
            </a>
          )}
        </div>
      </form>
    </Dialog>
  );
}
