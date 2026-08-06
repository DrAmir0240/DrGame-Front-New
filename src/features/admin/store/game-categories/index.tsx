"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Layers } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal, PageHeader } from "@/components/shared";
import {
  useStoreGameCategories,
  useCreateStoreGameCategory,
  useUpdateStoreGameCategory,
  useDeleteStoreGameCategory,
} from "../apis";
import { CategoryFormDialog } from "./components/category-form-dialog";
import type { GameCategory } from "../types";

export default function GameCategoriesPage() {
  const { data: categories = [], isLoading } = useStoreGameCategories();
  const createMutation = useCreateStoreGameCategory();
  const updateMutation = useUpdateStoreGameCategory();
  const deleteMutation = useDeleteStoreGameCategory();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<GameCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GameCategory | null>(null);

  const handleSubmit = async (payload: {
    title: string;
    description: string;
  }) => {
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

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  return (
    <div className="space-y-4">
      <PageHeader
        title="دسته‌بندی بازی"
        description="مدیریت دسته‌بندی بازی‌های فروشگاه"
      />

      <div className="flex justify-end">
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

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-card dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3 text-right font-medium">عنوان</th>
              <th className="px-4 py-3 text-right font-medium">توضیحات</th>
              <th className="px-4 py-3 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Layers className="h-8 w-8 text-muted-foreground/50" />
                    دسته‌بندی‌ای ثبت نشده است
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                >
                  <td className="px-4 py-3 font-medium">{category.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {category.description || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(category);
                          setOpenForm(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(category)}
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
        title="حذف دسته‌بندی بازی"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
