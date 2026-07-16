"use client";

import { useState, useEffect, useRef } from "react";
import {
  Button,
  Dialog,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import type { Product, ProductFormData, ProductChoices } from "../types";

interface Props {
  open: boolean;
  editing: Product | null;
  choices: ProductChoices | null;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

export default function ProductFormDialog({
  open,
  editing,
  choices,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [minStock, setMinStock] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedSuppliers, setSelectedSuppliers] = useState<number[]>([]);
  const [mainImg, setMainImg] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description);
      setPrice(String(Number(editing.price)));
      setMinStock(String(editing.min_stock));
      setCategory(editing.category ? String(editing.category) : "all");
      setSelectedSuppliers(editing.supplier);
      setMainImg(null);
      setImgPreview(editing.main_img);
    } else {
      setTitle("");
      setDescription("");
      setPrice("");
      setMinStock("");
      setCategory("all");
      setSelectedSuppliers([]);
      setMainImg(null);
      setImgPreview(null);
    }
  }, [editing, open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setMainImg(file);
      setImgPreview(URL.createObjectURL(file));
    }
  }

  function toggleSupplier(id: number) {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (price) formData.append("price", price);
    if (minStock) formData.append("min_stock", minStock);
    if (category !== "all") formData.append("category", category);
    selectedSuppliers.forEach((s) => formData.append("supplier", String(s)));
    if (mainImg) formData.append("main_img", mainImg);

    onSubmit(formData);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش کالا" : "کالای جدید"}
      className="max-w-lg"
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
            form="product-form"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>
            عنوان <span className="text-destructive">*</span>
          </Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>توضیحات</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>قیمت (تومان)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>حداقل موجودی</Label>
            <Input
              type="number"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>دسته‌بندی</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">بدون دسته‌بندی</SelectItem>
              {choices?.categories.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>تامین‌کنندگان</Label>
          <div className="flex flex-wrap gap-2">
            {choices?.suppliers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSupplier(s.id)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                  selectedSuppliers.includes(s.id)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-neutral-200 hover:border-primary"
                }`}
              >
                {s.name}
              </button>
            ))}
            {(!choices?.suppliers || choices.suppliers.length === 0) && (
              <span className="text-sm text-muted-foreground">
                تامین‌کننده‌ای موجود نیست
              </span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>تصویر اصلی</Label>
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
