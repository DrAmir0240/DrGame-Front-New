"use client";

import { useState, useEffect } from "react";
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
import type { Supplier, SupplierFormData } from "../types";
import type { SupplierType } from "../../shared/types";

interface Props {
  open: boolean;
  editing: Supplier | null;
  onClose: () => void;
  onSubmit: (data: SupplierFormData, editing: Supplier | null) => void;
  loading?: boolean;
}

const defaultForm: SupplierFormData = {
  name: "",
  type: "real",
  phone: "",
  address: "",
  account_number: "",
  sheba: "",
  national_id: "",
  tax_id: "",
  description: "",
};

export default function SupplierFormDialog({
  open,
  editing,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const [form, setForm] = useState<SupplierFormData>(defaultForm);

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        type: editing.type,
        phone: editing.phone,
        address: editing.address,
        account_number: editing.account_number,
        sheba: editing.sheba,
        national_id: editing.national_id,
        tax_id: editing.tax_id,
        description: editing.description,
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
      title={editing ? "ویرایش تامین‌کننده" : "تامین‌کننده جدید"}
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
            form="supplier-form"
            disabled={loading}
            className="flex-1"
          >
            {loading ? "در حال ذخیره..." : editing ? "ذخیره" : "ایجاد"}
          </Button>
        </div>
      }
    >
      <form id="supplier-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>
            نام <span className="text-destructive">*</span>
          </Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>نوع</Label>
          <Select
            value={form.type}
            onValueChange={(v) =>
              setForm({ ...form, type: v as SupplierType })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="real">حقیقی</SelectItem>
              <SelectItem value="legal">حقوقی</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>تلفن</Label>
          <Input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>آدرس</Label>
          <Textarea
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>شماره حساب</Label>
            <Input
              value={form.account_number}
              onChange={(e) =>
                setForm({ ...form, account_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>شماره شبا</Label>
            <Input
              value={form.sheba}
              onChange={(e) => setForm({ ...form, sheba: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>کد ملی / شناسه ملی</Label>
            <Input
              value={form.national_id}
              onChange={(e) =>
                setForm({ ...form, national_id: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>شناسه مالیاتی</Label>
            <Input
              value={form.tax_id}
              onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
            />
          </div>
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
      </form>
    </Dialog>
  );
}
