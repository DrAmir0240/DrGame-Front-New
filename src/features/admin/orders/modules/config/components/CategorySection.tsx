"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, ChevronDown, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import type { Category, OrderPrefix } from "../../../types";
import { useCategoryList, useCreateCategory, useUpdateCategory, useDeleteCategory } from "../../../apis";
import { orderPrefixLabels, sonyAccountCategoryTypeLabels, sonyAccountCapacityLabels } from "../../../constants";
import CategoryFormModal from "./CategoryFormModal";
import StageSection from "./StageSection";

interface Props {
  orderPrefix: OrderPrefix;
  roles: { id: number; role_name: string }[];
}

export default function CategorySection({ orderPrefix, roles }: Props) {
  const { data: categories = [], isLoading } = useCategoryList(orderPrefix);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const createMutation = useCreateCategory(orderPrefix);
  const updateMutation = useUpdateCategory(orderPrefix);
  const deleteMutation = useDeleteCategory(orderPrefix);

  function handleCreate() {
    setEditItem(null);
    setFormOpen(true);
  }

  function handleEdit(e: React.MouseEvent, item: Category) {
    e.stopPropagation();
    setEditItem(item);
    setFormOpen(true);
  }

  async function handleSubmit(data: any) {
    try {
      if (editItem) {
        await updateMutation.mutateAsync({ id: editItem.id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setFormOpen(false);
    } catch {}
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
    } catch {}
    setDeleteTarget(null);
  }

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">
          دسته‌بندی‌های {orderPrefixLabels[orderPrefix]}
        </h3>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="w-4 h-4" /> دسته‌بندی جدید
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">دسته‌بندی‌ای تعریف نشده</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="border border-neutral-200 rounded-xl overflow-hidden">
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50/80 transition-colors"
                onClick={() => toggleExpand(cat.id)}
              >
                {expandedId === cat.id ? (
                  <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
                <span className="text-sm font-medium flex-1">{cat.title}</span>
                {orderPrefix === "sony-account" && (
                  <>
                    {cat.type && (
                      <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                        {sonyAccountCategoryTypeLabels[cat.type] || cat.type}
                      </span>
                    )}
                    {cat.account_capacity && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {sonyAccountCapacityLabels[cat.account_capacity] || cat.account_capacity}
                      </span>
                    )}
                  </>
                )}
                {cat.description && (
                  <span className="text-xs text-muted-foreground max-w-[200px] truncate">{cat.description}</span>
                )}
                <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => handleEdit(e, cat)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteTarget(cat)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {expandedId === cat.id && (
                <div className="px-4 pb-4 border-t border-neutral-100">
                  <StageSection categoryId={cat.id} orderPrefix={orderPrefix} roles={roles} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <CategoryFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isPending={isPending}
        editItem={editItem}
        orderPrefix={orderPrefix}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        message={deleteTarget ? `آیا از حذف "${deleteTarget.title}" اطمینان دارید؟` : undefined}
      />
    </div>
  );
}
