"use client";

import { useState } from "react";
import { Button, Dialog, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { priorityConfig } from "../constants";
import type { Branch, Staff, TaskFormData, TaskPriority } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  staff: Staff[];
  branches: Branch[];
  isPending: boolean;
}

const defaultForm: TaskFormData = {
  title: "", description: "", priority: "normal", assigned_to_name: "",
  assigned_to_id: "", branch_id: "", due_date: "", tags: [],
};

export default function TaskFormDialog({ open, onClose, onSubmit, staff, branches, isPending }: Props) {
  const [form, setForm] = useState<TaskFormData>(defaultForm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ ...form, status: "todo" });
    setForm(defaultForm);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="تسک جدید"
      className="max-w-md"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
          <Button type="submit" form="task-form" disabled={isPending}>ایجاد</Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>عنوان *</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>توضیحات</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>اولویت</Label>
            <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskPriority })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(priorityConfig).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>مهلت</Label>
            <Input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>مسئول</Label>
            <Select value={form.assigned_to_id || ""} onValueChange={(v) => {
              const s = staff.find(x => x.id === v);
              setForm({ ...form, assigned_to_id: v, assigned_to_name: s?.full_name || "" });
            }}>
              <SelectTrigger><SelectValue placeholder="انتخاب..." /></SelectTrigger>
              <SelectContent>
                {staff.map(s => <SelectItem key={s.id} value={s.id}>{s.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>شعبه</Label>
            <Select value={form.branch_id || ""} onValueChange={(v) => setForm({ ...form, branch_id: v })}>
              <SelectTrigger><SelectValue placeholder="انتخاب..." /></SelectTrigger>
              <SelectContent>
                {branches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </form>
    </Dialog>
  );
}
