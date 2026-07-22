"use client";

import { useState, useEffect } from "react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import type { Category, OrderPrefix } from "../../../types";
import { sonyAccountCategoryTypeLabels, sonyAccountCapacityLabels } from "../../../constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
  editItem?: Category | null;
  orderPrefix: OrderPrefix;
}

export default function CategoryFormModal({ open, onClose, onSubmit, isPending, editItem, orderPrefix }: Props) {
  const isSony = orderPrefix === "sony-account";

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "buy",
    account_capacity: "2",
    rent_time_days: "",
  });

  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          title: editItem.title,
          description: editItem.description || "",
          type: editItem.type || "buy",
          account_capacity: editItem.account_capacity || "2",
          rent_time_days: editItem.rent_time_days != null ? String(editItem.rent_time_days) : "",
        });
      } else {
        setForm({
          title: "",
          description: "",
          type: "buy",
          account_capacity: "2",
          rent_time_days: "",
        });
      }
    }
  }, [open, editItem]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSony) {
      onSubmit({
        title: form.title,
        type: form.type,
        account_capacity: form.account_capacity,
        rent_time_days: form.type === "rent" && form.rent_time_days ? Number(form.rent_time_days) : null,
      });
    } else {
      onSubmit({
        title: form.title,
        description: form.description,
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editItem ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">انصراف</Button>
          <Button type="submit" form="category-form" disabled={isPending} className="flex-1">
            {editItem ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="عنوان"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        {!isSony && (
          <Input
            label="توضیحات"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        )}
        {isSony && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">نوع</label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(sonyAccountCategoryTypeLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">ظرفیت اکانت</label>
              <Select value={form.account_capacity} onValueChange={(v) => setForm({ ...form, account_capacity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(sonyAccountCapacityLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.type === "rent" && (
              <Input
                label="تعداد روز اجاره"
                type="number"
                value={form.rent_time_days}
                onChange={(e) => setForm({ ...form, rent_time_days: e.target.value })}
              />
            )}
          </>
        )}
      </form>
    </Dialog>
  );
}
