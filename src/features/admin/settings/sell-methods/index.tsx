"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { ConfirmModal, DataTable, PageHeader } from "@/components/shared";
import { DataTableColumn } from "@/components/shared/data-table/data-table";
import { useSellMethods, useCreateSellMethod, useUpdateSellMethod, useDeleteSellMethod, useSonyOrderCategories } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { SellMethod } from "../types";

interface FormValues {
  title: string;
  category_id: string;
  price: string;
}

export default function SellMethodsPage() {
  const { data: methods = [], isLoading } = useSellMethods();
  const { data: categories = [] } = useSonyOrderCategories();
  const createMutation = useCreateSellMethod();
  const updateMutation = useUpdateSellMethod();
  const deleteMutation = useDeleteSellMethod();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<SellMethod | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SellMethod | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: "", category_id: "", price: "" },
  });

  useEffect(() => {
    if (openForm) {
      reset({
        title: editing?.title ?? "",
        category_id: editing ? String(editing.category_id) : categories[0] ? String(categories[0].id) : "",
        price: editing?.price != null ? String(editing.price) : "",
      });
    }
  }, [editing, openForm, reset, categories]);

  const submit = async (values: FormValues) => {
    const payload = {
      title: values.title.trim(),
      category_id: Number(values.category_id),
      price: Number(values.price || 0),
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

  const columns: DataTableColumn<SellMethod>[] = [
    {
      header: "عنوان",
      render: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: "دسته‌بندی",
      render: (row) => <span className="text-muted-foreground">{row.category_title}</span>,
    },
    {
      header: "قیمت",
      render: (row) => <span className="font-medium">{new Intl.NumberFormat("fa-IR").format(row.price)} تومان</span>,
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
      <PageHeader title="روش‌های فروش" description="مدیریت روش‌های فروش مرتبط با دسته‌بندی‌های سونی">
        <Button onClick={() => { setEditing(null); setOpenForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          روش فروش جدید
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={methods}
        isLoading={isLoading}
        emptyMessage="روش فروشی ثبت نشده است"
      />

      <Dialog
        open={openForm}
        onOpenChange={(v) => !v && setOpenForm(false)}
        title={editing ? "ویرایش روش فروش" : "روش فروش جدید"}
        className="max-w-md"
        footer={
          <div className="flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenForm(false)} disabled={saving}>
              انصراف
            </Button>
            <Button type="submit" form="sell-method-form" className="flex-1 gap-2" disabled={saving}>
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
        <form id="sell-method-form" onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            id="title"
            label="عنوان"
            required
            error={errors.title?.message}
            {...register("title", { required: "عنوان الزامی است" })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">دسته‌بندی</label>
            <Select value={watch("category_id")} onValueChange={(v) => setValue("category_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="انتخاب دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            id="price"
            label="قیمت (تومان)"
            type="number"
            required
            error={errors.price?.message}
            {...register("price", { required: "قیمت الزامی است" })}
          />
        </form>
      </Dialog>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف روش فروش"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={saving}
      />
    </div>
  );
}
