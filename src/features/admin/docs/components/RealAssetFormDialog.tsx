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

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}

interface Props {
  open: boolean;
  editing: any | null;
  categories: Category[];
  subCategories: SubCategory[];
  employees: Employee[];
  onClose: () => void;
  onSaved: () => void;
  onSubmit: (formData: FormData) => Promise<any>;
}

export default function RealAssetFormDialog({ open, editing, categories, subCategories, employees, onClose, onSaved, onSubmit }: Props) {
  const [image, setImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<{
    title: string;
    category: number | null;
    sub_category: number | null;
    employee: number | null;
    price: string;
  }>({
    defaultValues: { title: "", category: null, sub_category: null, employee: null, price: "" },
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
          employee: editing.employee ?? null,
          price: editing.price ? String(editing.price) : "",
        });
        setImgPreview(editing.image);
      } else {
        reset({ title: "", category: null, sub_category: null, employee: null, price: "" });
        setImgPreview(null);
      }
      setImage(null);
    }
  }, [editing, open, reset]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setImage(f);
      setImgPreview(URL.createObjectURL(f));
    }
  }

  async function onFormSubmit(data: { title: string; category: number | null; sub_category: number | null; employee: number | null; price: string }) {
    if (!data.sub_category) {
      toast.error("زیردسته‌بندی را انتخاب کنید");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("category", String(data.sub_category));
    if (image) formData.append("image", image);
    if (data.employee) formData.append("employee", String(data.employee));
    if (data.price) formData.append("price", data.price);

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
      title={editing ? "ویرایش دارایی" : "دارایی جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" form="realasset-form" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="realasset-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="عنوان"
          placeholder="عنوان دارایی..."
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

        <Select
          value={watch("employee") ? String(watch("employee")) : ""}
          onValueChange={(v) => setValue("employee", Number(v))}
        >
          <SelectTrigger label="کارمند مسئول (اختیاری)" />
          <SelectContent>
            <SelectItem value="none">بدون کارمند</SelectItem>
            {employees.map((emp) => (
              <SelectItem key={emp.id} value={String(emp.id)}>
                {emp.first_name} {emp.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          label="قیمت (اختیاری)"
          placeholder="قیمت..."
          type="number"
          {...register("price")}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">تصویر (اختیاری)</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={() => fileRef.current?.click()}>
              انتخاب تصویر
            </Button>
            {imgPreview && (
              <img src={imgPreview} alt="preview" className="w-12 h-12 rounded-lg object-cover border" />
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
}
