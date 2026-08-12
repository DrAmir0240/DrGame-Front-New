"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { ConfirmModal, DataTable, PageHeader } from "@/components/shared";
import { DataTableColumn } from "@/components/shared/data-table/data-table";
import { useSonyOrderCategories, useCreateSonyOrderCategory, useUpdateSonyOrderCategory, useDeleteSonyOrderCategory } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { SonyOrderCategory } from "../types";

const CAPACITY_LABELS: Record<string, string> = {
  "1": "Offline",
  "2": "Online + Offline",
  "3": "Online",
};

const CAPACITY_OPTIONS = Object.entries(CAPACITY_LABELS);

interface FormValues {
  title: string;
  type: "buy" | "rent";
  rent_time_days: string;
  account_capacity: string;
  base_price: string;
}

export default function SonyOrderCategoriesPage() {
  const { data: categories = [], isLoading } = useSonyOrderCategories();
  const createMutation = useCreateSonyOrderCategory();
  const updateMutation = useUpdateSonyOrderCategory();
  const deleteMutation = useDeleteSonyOrderCategory();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<SonyOrderCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SonyOrderCategory | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: "", type: "rent", rent_time_days: "", account_capacity: "2", base_price: "" },
  });

  const type = watch("type");

  useEffect(() => {
    if (openForm) {
      reset({
        title: editing?.title ?? "",
        type: editing?.type ?? "rent",
        rent_time_days: editing?.rent_time_days != null ? String(editing.rent_time_days) : "",
        account_capacity: editing?.account_capacity ?? "2",
        base_price: editing?.base_price != null ? String(editing.base_price) : "",
      });
    }
  }, [editing, openForm, reset]);

  const submit = async (values: FormValues) => {
    const payload = {
      title: values.title.trim(),
      type: values.type,
      rent_time_days: values.type === "rent" && values.rent_time_days ? Number(values.rent_time_days) : null,
      account_capacity: values.account_capacity || null,
      base_price: Number(values.base_price || 0),
    };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setOpenForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const columns: DataTableColumn<SonyOrderCategory>[] = [
    {
      header: "عنوان",
      render: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: "نوع",
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.type === "buy"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
          }`}
        >
          {row.type_display}
        </span>
      ),
    },
    {
      header: "مدت (روز)",
      render: (row) => (row.rent_time_days != null ? `${row.rent_time_days} روز` : "—"),
    },
    {
      header: "ظرفیت",
      render: (row) => row.account_capacity_display ?? row.account_capacity ?? "—",
    },
    {
      header: "قیمت پایه",
      render: (row) => <span className="text-muted-foreground">{new Intl.NumberFormat("fa-IR").format(row.base_price)} تومان</span>,
    },
    {
      header: "عملیات",
      render: (row) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => { setEditing(row); setOpenForm(true); }}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(row)}>
            <Trash2 className="h-4 w-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="دسته‌بندی سفارش سونی" description="مدیریت دسته‌بندی‌های خرید و اجاره اکانت سونی">
        <Button onClick={() => { setEditing(null); setOpenForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        emptyMessage="دسته‌بندی‌ای ثبت نشده است"
      />

      <Dialog
        open={openForm}
        onOpenChange={(v) => !v && setOpenForm(false)}
        title={editing ? "ویرایش دسته‌بندی سونی" : "دسته‌بندی سونی جدید"}
        className="max-w-md"
        footer={
          <div className="flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenForm(false)} disabled={saving}>
              انصراف
            </Button>
            <Button type="submit" form="sony-category-form" className="flex-1 gap-2" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : editing ? (
                "ذخیره تغییرات"
              ) : (
                "ایجاد"
              )}
            </Button>
          </div>
        }
      >
        <form id="sony-category-form" onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            id="title"
            label="عنوان"
            required
            error={errors.title?.message}
            {...register("title", { required: "عنوان الزامی است" })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">نوع</label>
            <Select value={type} onValueChange={(v) => setValue("type", v as "buy" | "rent")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rent">اجاره</SelectItem>
                <SelectItem value="buy">خرید</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "rent" && (
            <Input
              id="rent_time_days"
              label="مدت اجاره (روز)"
              type="number"
              placeholder="مثلا 30"
              {...register("rent_time_days")}
            />
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">ظرفیت اکانت</label>
            <Select value={watch("account_capacity")} onValueChange={(v) => setValue("account_capacity", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAPACITY_OPTIONS.map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            id="base_price"
            label="قیمت پایه (تومان)"
            type="number"
            required
            error={errors.base_price?.message}
            {...register("base_price", { required: "قیمت پایه الزامی است" })}
          />
        </form>
      </Dialog>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف دسته‌بندی"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={saving}
      />
    </div>
  );
}
