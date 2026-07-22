"use client";

import { useState, useEffect } from "react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import type { StageAction, OrderPrefix } from "../../../types";
import { actionTypeLabels, getTargetFieldOptions } from "../../../constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isPending: boolean;
  editItem?: StageAction | null;
  stageId: number;
  orderPrefix: OrderPrefix;
}

export default function ActionFormModal({ open, onClose, onSubmit, isPending, editItem, stageId, orderPrefix }: Props) {
  const [form, setForm] = useState({
    title: "",
    action_type: "manual_confirm",
    description: "",
    is_required: true,
    order: 1,
    target_field: "",
  });

  const targetFieldOptions = getTargetFieldOptions(orderPrefix, form.action_type);
  const showTargetField = targetFieldOptions !== null;

  useEffect(() => {
    if (open) {
      if (editItem) {
        setForm({
          title: editItem.title,
          action_type: editItem.action_type,
          description: editItem.description || "",
          is_required: editItem.is_required,
          order: editItem.order,
          target_field: editItem.target_field || "",
        });
      } else {
        setForm({
          title: "",
          action_type: "manual_confirm",
          description: "",
          is_required: true,
          order: 1,
          target_field: "",
        });
      }
    }
  }, [open, editItem]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = {
      stage: stageId,
      title: form.title,
      action_type: form.action_type,
      description: form.description,
      is_required: form.is_required,
      order: form.order,
    };
    if (showTargetField && form.target_field) {
      payload.target_field = form.target_field;
    }
    onSubmit(payload);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editItem ? "ویرایش اکشن" : "اکشن جدید"}
      className="max-w-md"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">انصراف</Button>
          <Button type="submit" form="action-form" disabled={isPending} className="flex-1">
            {editItem ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="action-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="عنوان"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">نوع اکشن</label>
          <Select value={form.action_type} onValueChange={(v) => setForm({ ...form, action_type: v, target_field: "" })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(actionTypeLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {showTargetField && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">فیلد هدف</label>
            <Select value={form.target_field} onValueChange={(v) => setForm({ ...form, target_field: v })}>
              <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
              <SelectContent>
                {Object.entries(targetFieldOptions).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
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
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              checked={form.is_required}
              onChange={(e) => setForm({ ...form, is_required: e.target.checked })}
              className="h-4 w-4 rounded border-neutral-300"
            />
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-200">اجباری</label>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
