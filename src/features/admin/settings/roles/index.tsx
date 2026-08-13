"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Dialog, Input, Textarea } from "@/components/ui";
import { ConfirmModal, DataTable, PageHeader } from "@/components/shared";
import { DataTableColumn } from "@/components/shared/data-table/data-table";
import { useRolesList, useCreateRole, useUpdateRole, useDeleteRole } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { RoleListItem } from "../types";

interface FormValues {
  role_name: string;
  description: string;
}

export default function RolesPage() {
  const router = useRouter();
  const { data: roles = [], isLoading } = useRolesList();
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<RoleListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleListItem | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { role_name: "", description: "" },
  });

  useEffect(() => {
    reset({ role_name: editing?.role_name ?? "", description: editing?.description ?? "" });
  }, [editing, openForm, reset]);

  const submit = async (values: FormValues) => {
    const payload = { role_name: values.role_name.trim(), description: values.description.trim() };
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync({ ...payload, permission_ids: [] });
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

  const columns: DataTableColumn<RoleListItem>[] = [
    {
      header: "نقش",
      render: (row) => <span className="font-medium">{row.role_name}</span>,
    },
    {
      header: "توضیح",
      render: (row) => row.description ?? <span className="text-muted-foreground">—</span>,
    },
    {
      header: "تعداد پرمیشن",
      render: (row) => (
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
          {row.permission_count}
        </span>
      ),
    },
    {
      header: "تعداد کارمند",
      render: (row) => (
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
          {row.employee_count}
        </span>
      ),
    },
    {
      header: "عملیات",
      render: (row) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
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
      <PageHeader title="مدیریت نقش‌ها" description="تعریف و مدیریت نقش‌ها و دسترسی‌های کارمندان">
        <Button onClick={() => { setEditing(null); setOpenForm(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          ایجاد نقش جدید
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={roles}
        isLoading={isLoading}
        onRowClick={(row) => router.push(`/admin/settings/roles/${row.id}`)}
        emptyMessage="نقشی تعریف نشده است"
      />

      <Dialog
        open={openForm}
        onOpenChange={(v) => !v && setOpenForm(false)}
        title={editing ? "ویرایش نقش" : "ایجاد نقش جدید"}
        description="نام نقش و توضیحات آن را وارد کنید"
        className="max-w-md"
        footer={
          <div className="flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenForm(false)} disabled={saving}>
              انصراف
            </Button>
            <Button type="submit" form="role-form" className="flex-1 gap-2" disabled={saving}>
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
        <form id="role-form" onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            id="role_name"
            label="نام نقش"
            required
            error={errors.role_name?.message}
            {...register("role_name", { required: "نام نقش الزامی است" })}
          />
          <Textarea
            id="description"
            label="توضیحات"
            placeholder="مثلا: مسئول ثبت سفارشات حضوری"
            {...register("description")}
          />
        </form>
      </Dialog>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف نقش"
        message={`آیا از حذف نقش «${deleteTarget?.role_name}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={saving}
      />
    </div>
  );
}
