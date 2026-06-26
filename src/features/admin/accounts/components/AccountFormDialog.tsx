"use client";

import { useState, useEffect } from "react";
import { Button, Dialog, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch, Textarea } from "@/components/ui";
import type { AccountType, GameAccount } from "../types";
import { typeLabels } from "../constants";

interface Props {
  open: boolean;
  editing: GameAccount | null;
  form: {
    name: string;
    email: string;
    password_encrypted: string;
    account_type: AccountType;
    total_capacity: string;
    notes: string;
    is_active: boolean;
  };
  onFormChange: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function AccountFormDialog({ open, editing, form, onFormChange, onSubmit, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش اکانت" : "اکانت جدید"}
      className="max-w-lg"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
          <Button type="submit" form="account-form">{editing ? "ذخیره" : "ایجاد"}</Button>
        </>
      }
    >
      <form id="account-form" onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>نام اکانت</Label>
            <Input value={form.name} onChange={(e) => onFormChange({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>ایمیل</Label>
            <Input value={form.email} onChange={(e) => onFormChange({ ...form, email: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>رمز</Label>
            <Input type="password" value={form.password_encrypted}
              onChange={(e) => onFormChange({ ...form, password_encrypted: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>نوع</Label>
            <Select value={form.account_type}
              onValueChange={(v) => onFormChange({ ...form, account_type: v as AccountType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(typeLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>ظرفیت</Label>
            <Input type="number" value={form.total_capacity}
              onChange={(e) => onFormChange({ ...form, total_capacity: e.target.value })} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>یادداشت</Label>
            <Textarea value={form.notes} onChange={(e) => onFormChange({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <Label>فعال</Label>
            <Switch checked={form.is_active} onCheckedChange={(v) => onFormChange({ ...form, is_active: v })} />
          </div>
        </div>
      </form>
    </Dialog>
  );
}
