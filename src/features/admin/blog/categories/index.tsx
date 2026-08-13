"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ConfirmModal, DataTable, DataTableColumn, PageHeader, Pagination } from "@/components/shared";

import {
  useBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
  LIMIT,
} from "./apis";
import { CategoryFormDialog } from "./components/category-form-dialog";
import type { BlogCategory } from "../types";

export default function BlogCategoriesPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useBlogCategories({
    limit: LIMIT,
    offset: page * LIMIT,
  });

  const createMutation = useCreateBlogCategory();
  const updateMutation = useUpdateBlogCategory();
  const deleteMutation = useDeleteBlogCategory();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<BlogCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogCategory | null>(null);

  const items = data?.results ?? [];
  const filtered = search.trim()
    ? items.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const totalPages = data ? Math.ceil(data.count / LIMIT) : 0;

  const handleSubmit = async (values: { title: string; description: string }) => {
    if (editing) {
      await updateMutation.mutateAsync({
        id: editing.id,
        payload: values,
      });
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

  const columns: DataTableColumn<BlogCategory>[] = useMemo(
    () => [
      {
        header: "عنوان",
        render: (row) => <span className="font-medium">{row.title}</span>,
      },
      {
        header: "توضیحات",
        render: (row) => (
          <span className="text-muted-foreground line-clamp-1">
            {row.description || "—"}
          </span>
        ),
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
        title="دسته‌بندی بلاگ"
        description="مدیریت دسته‌بندی‌های پست‌های وبلاگ"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="جستجوی دسته‌بندی..."
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
          دسته‌بندی جدید
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="دسته‌بندی‌ای ثبت نشده است"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        count={data?.count ?? 0}
        limit={LIMIT}
        onPageChange={setPage}
      />

      <CategoryFormDialog
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
        title="حذف دسته‌بندی"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}