"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/ui";
import { ConfirmModal, DataTable, PageHeader } from "@/components/shared";
import { DataTableColumn } from "@/components/shared/data-table/data-table";
import { useInvoiceCategories, useCreateInvoiceCategory, useUpdateInvoiceCategory, useDeleteInvoiceCategory } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { InvoiceCategory } from "../types";

interface FormValues {
  title: string;
  direction: "in" | "out";
  description: string;
}

export default function InvoiceCategoriesPage() {
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const { data: categories = [], isLoading } = useInvoiceCategories(
    directionFilter === "all" ? undefined : { direction: directionFilter }
  );
  const createMutation = useCreateInvoiceCategory();
  const updateMutation = useUpdateInvoiceCategory();
  const deleteMutation = useDeleteInvoiceCategory();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<InvoiceCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InvoiceCategory | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: "", direction: "out", description: "" },
  });

  useEffect(() => {
    reset({
      title: editing?.title ?? "",
      direction: editing?.direction ?? "out",
      description: editing?.description ?? "",
    });
  }, [editing, openForm, reset]);

  const submit = async (values: FormValues) => {
    const payload = {
      title: values.title.trim(),
      direction: values.direction,
      description: values.description.trim() || null,
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

  const columns: DataTableColumn<InvoiceCategory>[] = [
    {
      header: "عنوان",
      render: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: "جهت",
      render: (row) => (
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.direction === "in"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
          }`}
        >
          {row.direction_display}
        </span>
      ),
    },
    {
      header: "توضیحات",
      render: (row) => row.description ?? <span className="text-muted-foreground">—</span>,
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
      <PageHeader title="دسته‌بندی فاکتور" description="مدیریت دسته‌بندی فاکتورهای ورودی و خروجی">
        <Button onClick={() => { setEditing(null); setOpenForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          دسته‌بندی جدید
        </Button>
      </PageHeader>

      <Select value={directionFilter} onValueChange={setDirectionFilter}>
        <SelectTrigger label="فیلتر جهت" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه جهات</SelectItem>
          <SelectItem value="in">ورودی</SelectItem>
          <SelectItem value="out">خروجی</SelectItem>
        </SelectContent>
      </Select>

      <DataTable
        columns={columns}
        data={categories}
        isLoading={isLoading}
        emptyMessage="دسته‌بندی فاکتوری ثبت نشده است"
      />

      <Dialog
        open={openForm}
        onOpenChange={(v) => !v && setOpenForm(false)}
        title={editing ? "ویرایش دسته‌بندی فاکتور" : "دسته‌بندی فاکتور جدید"}
        className="max-w-md"
        footer={
          <div className="flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenForm(false)} disabled={saving}>
              انصراف
            </Button>
            <Button type="submit" form="invoice-category-form" className="flex-1 gap-2" disabled={saving}>
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
        <form id="invoice-category-form" onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            id="title"
            label="عنوان"
            required
            error={errors.title?.message}
            {...register("title", { required: "عنوان الزامی است" })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">جهت</label>
            <Select value={watch("direction")} onValueChange={(v) => setValue("direction", v as "in" | "out")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="out">خروجی</SelectItem>
                <SelectItem value="in">ورودی</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea id="description" label="توضیحات" {...register("description")} />
        </form>
      </Dialog>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف دسته‌بندی فاکتور"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={saving}
      />
    </div>
  );
}
