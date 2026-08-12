"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Dialog, Input, Textarea } from "@/components/ui";
import { ConfirmModal, DataTable, PageHeader } from "@/components/shared";
import { DataTableColumn } from "@/components/shared/data-table/data-table";
import { useBankAccounts, useCreateBankAccount, useUpdateBankAccount, useDeleteBankAccount } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { BankAccount } from "../types";

interface FormValues {
  title: string;
  account_number: string;
  sheba: string;
  description: string;
}

export default function BankAccountsPage() {
  const { data: accounts = [], isLoading } = useBankAccounts();
  const createMutation = useCreateBankAccount();
  const updateMutation = useUpdateBankAccount();
  const deleteMutation = useDeleteBankAccount();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<BankAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BankAccount | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: "", account_number: "", sheba: "", description: "" },
  });

  useEffect(() => {
    reset({
      title: editing?.title ?? "",
      account_number: editing?.account_number ?? "",
      sheba: editing?.sheba ?? "",
      description: editing?.description ?? "",
    });
  }, [editing, openForm, reset]);

  const submit = async (values: FormValues) => {
    const payload = {
      title: values.title.trim(),
      account_number: values.account_number.trim(),
      sheba: values.sheba.trim(),
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

  const columns: DataTableColumn<BankAccount>[] = [
    {
      header: "عنوان",
      render: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: "شماره حساب",
      render: (row) => <span dir="ltr">{row.account_number}</span>,
    },
    {
      header: "شبا",
      render: (row) => <span dir="ltr" className="text-xs text-muted-foreground">{row.sheba}</span>,
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
      <PageHeader title="حساب‌های بانکی" description="مدیریت حساب‌های بانکی شرکت">
        <Button onClick={() => { setEditing(null); setOpenForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          حساب جدید
        </Button>
      </PageHeader>
      <SettingsNav />

      <DataTable
        columns={columns}
        data={accounts}
        isLoading={isLoading}
        emptyMessage="حساب بانکی ثبت نشده است"
      />

      <Dialog
        open={openForm}
        onOpenChange={(v) => !v && setOpenForm(false)}
        title={editing ? "ویرایش حساب بانکی" : "حساب بانکی جدید"}
        className="max-w-md"
        footer={
          <div className="flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenForm(false)} disabled={saving}>
              انصراف
            </Button>
            <Button type="submit" form="bank-account-form" className="flex-1 gap-2" disabled={saving}>
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
        <form id="bank-account-form" onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            id="title"
            label="عنوان"
            required
            error={errors.title?.message}
            {...register("title", { required: "عنوان الزامی است" })}
          />
          <Input
            id="account_number"
            label="شماره حساب"
            required
            error={errors.account_number?.message}
            {...register("account_number", { required: "شماره حساب الزامی است" })}
          />
          <Input
            id="sheba"
            label="شبا"
            required
            error={errors.sheba?.message}
            {...register("sheba", { required: "شبا الزامی است" })}
          />
          <Textarea id="description" label="توضیحات" {...register("description")} />
        </form>
      </Dialog>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف حساب بانکی"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={saving}
      />
    </div>
  );
}
