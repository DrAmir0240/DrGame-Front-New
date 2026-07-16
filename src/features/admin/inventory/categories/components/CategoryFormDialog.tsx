"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  Input,
  Label,
  Textarea,
} from "@/components/ui";
import type { ProductCategory, CategoryFormData } from "../types";

interface Props {
  open: boolean;
  editing: ProductCategory | null;
  onClose: () => void;
  onSubmit: (data: CategoryFormData, editing: ProductCategory | null) => void;
  loading?: boolean;
}

const defaultForm: CategoryFormData = {
  title: "",
  description: "",
  img: null,
};

export default function CategoryFormDialog({
  open,
  editing,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<CategoryFormData>(defaultForm);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        description: editing.description,
        img: editing.img,
      });
      setImgPreview(editing.img);
    } else {
      setForm(defaultForm);
      setImgPreview(null);
    }
  }, [editing, open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, img: file });
      setImgPreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form, editing);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="category-form"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>
            عنوان <span className="text-destructive">*</span>
          </Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>توضیحات</Label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label>تصویر</Label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              انتخاب تصویر
            </Button>
            {imgPreview && (
              <img
                src={imgPreview}
                alt="preview"
                className="w-12 h-12 rounded-lg object-cover border"
              />
            )}
          </div>
        </div>
      </form>
    </Dialog>
  );
}
