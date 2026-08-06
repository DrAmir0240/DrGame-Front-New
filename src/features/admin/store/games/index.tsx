"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Gamepad2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ConfirmModal, PageHeader, Pagination } from "@/components/shared";
import {
  useStoreGames,
  useStoreGameCategories,
  useCreateStoreGame,
  useUpdateStoreGame,
  useDeleteStoreGame,
  LIMIT,
} from "../apis";
import { GameFormDialog } from "./components/game-form-dialog";
import type { StoreGame } from "../types";

export default function GamesPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { data, isLoading } = useStoreGames({
    limit: LIMIT,
    offset: page * LIMIT,
  });
  const { data: categories = [] } = useStoreGameCategories();
  const createMutation = useCreateStoreGame();
  const updateMutation = useUpdateStoreGame();
  const deleteMutation = useDeleteStoreGame();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<StoreGame | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoreGame | null>(null);

  const items = data?.results ?? [];
  const filtered = search.trim()
    ? items.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const categoryTitle = (id: number) =>
    categories.find((c) => c.id === id)?.title ?? "—";

  const handleSubmit = async (formData: FormData) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, formData });
    } else {
      await createMutation.mutateAsync(formData);
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

  const totalPages = data ? Math.ceil(data.count / LIMIT) : 0;

  return (
    <div className="space-y-4">
      <PageHeader
        title="بازی‌های فروشگاه"
        description="مدیریت بازی‌های قابل خرید در فروشگاه آنلاین"
      />

      <div className="flex items-center justify-between gap-3">
        <Input
          placeholder="جستجوی بازی..."
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
          بازی جدید
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-card dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3 text-right font-medium">تصویر</th>
              <th className="px-4 py-3 text-right font-medium">عنوان</th>
              <th className="px-4 py-3 text-right font-medium">دسته‌بندی</th>
              <th className="px-4 py-3 text-right font-medium">حجم</th>
              <th className="px-4 py-3 text-right font-medium">تعداد فروش</th>
              <th className="px-4 py-3 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  در حال بارگذاری...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Gamepad2 className="h-8 w-8 text-muted-foreground/50" />
                    بازی‌ای ثبت نشده است
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                >
                  <td className="px-4 py-3">
                    {item.main_img ? (
                      <img
                        src={item.main_img}
                        alt={item.title ?? ""}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                        <Gamepad2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {categoryTitle(item.category_id)}
                  </td>
                  <td className="px-4 py-3">{item.volume ?? "—"}</td>
                  <td className="px-4 py-3">{item.units_sold}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(item);
                          setOpenForm(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(item)}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        count={data?.count ?? 0}
        limit={LIMIT}
        onPageChange={setPage}
      />

      <GameFormDialog
        open={openForm}
        editing={editing}
        categories={categories}
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
        title="حذف بازی"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
