"use client";

import { useState, useEffect } from "react";
import { Button, Dialog, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from "@/components/ui";
import type { Game, GameFormData, GamePlatform } from "../types";
import { platformLabels } from "../constants";

interface Props {
  open: boolean;
  editing: Game | null;
  onClose: () => void;
  onSubmit: (data: GameFormData, editing: Game | null) => void;
}

const defaultForm: GameFormData = {
  name: "",
  platform: "ps",
  price: "",
  is_active: true,
};

export default function GameFormDialog({ open, editing, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<GameFormData>(defaultForm);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        platform: editing.platform,
        price: String(editing.price),
        is_active: editing.is_active,
      });
    } else {
      setForm(defaultForm);
    }
  }, [editing, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form, editing);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش بازی" : "بازی جدید"}
      className="max-w-md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={onClose}>انصراف</Button>
            <Button type="submit" form="game-form">{editing ? "ذخیره" : "ایجاد"}</Button>
          </>
        }
      >
        <form id="game-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>نام بازی</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>پلتفرم</Label>
          <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v as GamePlatform })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["ps", "xbox", "nintendo"] as GamePlatform[]).map((p) => (
                <SelectItem key={p} value={p}>{platformLabels[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>قیمت</Label>
          <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
          <Label>فعال</Label>
        </div>
      </form>
    </Dialog>
  );
}
