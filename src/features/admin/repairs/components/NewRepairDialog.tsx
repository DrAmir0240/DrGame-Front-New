"use client";

import { useState } from "react";
import { Button, Dialog, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import type { DeviceType, RepairFormData } from "../types";
import { deviceTypes } from "../constants";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RepairFormData) => void;
}

const initialForm: RepairFormData = {
  device_type: "console",
  device_model: "",
  issue_description: "",
  notes: "",
};

export default function NewRepairDialog({ open, onOpenChange, onSubmit }: Props) {
  const [form, setForm] = useState<RepairFormData>(initialForm);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm(initialForm);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onOpenChange(false)}
      title="سفارش تعمیر جدید"
      className="max-w-md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>انصراف</Button>
            <Button type="submit" form="repair-form" disabled={!form.issue_description}>ثبت</Button>
          </>
        }
      >
        <form id="repair-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>نوع دستگاه</Label>
          <Select value={form.device_type} onValueChange={(v) => setForm({ ...form, device_type: v as DeviceType })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(deviceTypes).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>مدل</Label>
          <Input value={form.device_model} onChange={(e) => setForm({ ...form, device_model: e.target.value })}
            placeholder="مثلاً PS5 Slim" />
        </div>
        <div className="space-y-2">
          <Label>شرح مشکل *</Label>
          <Textarea value={form.issue_description}
            onChange={(e) => setForm({ ...form, issue_description: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label>یادداشت</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
      </form>
    </Dialog>
  );
}
