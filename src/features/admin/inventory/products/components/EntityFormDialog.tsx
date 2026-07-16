"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  Input,
  Label,
} from "@/components/ui";
import type { ProductEntity, EntityFormData } from "../types";

interface Props {
  open: boolean;
  editing: ProductEntity | null;
  productId: number;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

export default function EntityFormDialog({
  open,
  editing,
  productId,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<EntityFormData>({
    uni_id: "",
    color: "",
    main_img: null,
  });
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setForm({
        uni_id: editing.uni_id,
        color: editing.color,
        main_img: editing.main_img,
      });
      setImgPreview(editing.main_img);
    } else {
      setForm({ uni_id: "", color: "", main_img: null });
      setImgPreview(null);
    }
  }, [editing, open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, main_img: file });
      setImgPreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("uni_id", form.uni_id);
    formData.append("product", String(productId));
    if (form.color) formData.append("color", form.color);
    if (form.main_img && form.main_img instanceof File) {
      formData.append("main_img", form.main_img);
    }
    onSubmit(formData);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش موجودی" : "موجودی جدید"}
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
            form="entity-form"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="entity-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>
            شناسه یکتا (uni_id) <span className="text-destructive">*</span>
          </Label>
          <Input
            value={form.uni_id}
            onChange={(e) => setForm({ ...form, uni_id: e.target.value })}
            placeholder="مثلاً PS5-DE-01"
            required
          />
        </div>
        <div className="space-y-2">
          <Label>رنگ</Label>
          <Input
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            placeholder="مثلاً سفید"
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
