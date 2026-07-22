"use client";

import { useState, useEffect } from "react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import type { StageListItem, OrderPrefix } from "../../../types";

interface RoleOption {
  id: number;
  role_name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
  editItem?: StageListItem | null;
  categoryId: number;
  roles: RoleOption[];
}

export default function StageFormModal({ open, onClose, onSubmit, isPending, editItem, categoryId, roles }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    order: 1,
    employee_role: "",
    is_start: false,
    is_end: false,
  });

  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          title: editItem.title,
          description: editItem.description || "",
          order: editItem.order,
          employee_role: String(editItem.employee_role),
          is_start: editItem.is_start,
          is_end: editItem.is_end,
        });
      } else {
        setForm({
          title: "",
          description: "",
          order: 1,
          employee_role: "",
          is_start: false,
          is_end: false,
        });
      }
    }
  }, [open, editItem]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      category: categoryId,
      title: form.title,
      description: form.description,
      order: form.order,
      employee_role: Number(form.employee_role),
      is_start: form.is_start,
      is_end: form.is_end,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editItem ? "ویرایش مرحله" : "مرحله جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">انصراف</Button>
          <Button type="submit" form="stage-form" disabled={isPending} className="flex-1">
            {editItem ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="stage-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="عنوان"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <Input
          label="توضیحات"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ترتیب"
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">نقش کارمند</label>
            <Select value={form.employee_role} onValueChange={(v) => setForm({ ...form, employee_role: v })}>
              <SelectTrigger><SelectValue placeholder="انتخاب نقش" /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)}>{r.role_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_start}
              onChange={(e) => setForm({ ...form, is_start: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">مرحله اول</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_end}
              onChange={(e) => setForm({ ...form, is_end: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">مرحله آخر</label>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
