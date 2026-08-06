"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ConfirmModal, DataTable, DataTableColumn, PageHeader } from "@/components/shared";
import {
  useAccountStatuses,
  useCreateAccountStatus,
  useUpdateAccountStatus,
  useDeleteAccountStatus,
} from "@/features/admin/psn/apis";
import { AccountStatus } from "../types";
import { StatusFormDialog } from "./components/status-form-dialog";


export default function AccountStatusesPage() {
  const [search, setSearch] = useState("");
  const { data: statuses = [], isLoading } = useAccountStatuses();
  const createMutation = useCreateAccountStatus();
  const updateMutation = useUpdateAccountStatus();
  const deleteMutation = useDeleteAccountStatus();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<AccountStatus | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccountStatus | null>(null);

  const filtered = search.trim()
    ? statuses.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      )
    : statuses;

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSubmit = async (values: { title: string }) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setOpenForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const columns: DataTableColumn<AccountStatus>[] = useMemo(
    () => [
      {
        header: "عنوان",
        render: (row) => <span className="font-medium">{row.title}</span>,
      },
      {
        header: "عملیات",
        render: (row) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setEditing(row);
                setOpenForm(true);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDeleteTarget(row)}
            >
              <Trash2 className="h-4 w-4 text-rose-500" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="وضعیت اکانت‌ها"
        description="مدیریت وضعیت‌های سونی اکانت (فعال، مسدود و ...)"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="جستجوی وضعیت..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          وضعیت جدید
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="وضعیتی ثبت نشده است"
      />

      <StatusFormDialog
        open={openForm}
        editing={editing}
        loading={loading}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف وضعیت"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}