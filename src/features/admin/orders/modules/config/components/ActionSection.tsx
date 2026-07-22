"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import type { StageAction, OrderPrefix } from "../../../types";
import { actionTypeLabels } from "../../../constants";
import { useCreateAction, useUpdateAction, useDeleteAction } from "../../../apis";
import ActionFormModal from "./ActionFormModal";

interface Props {
  actions: StageAction[];
  stageId: number;
  orderPrefix: OrderPrefix;
  isLoading?: boolean;
}

export default function ActionSection({ actions, stageId, orderPrefix, isLoading }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<StageAction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StageAction | null>(null);

  const createMutation = useCreateAction(orderPrefix);
  const updateMutation = useUpdateAction(orderPrefix);
  const deleteMutation = useDeleteAction(orderPrefix);

  function handleCreate() {
    setEditItem(null);
    setFormOpen(true);
  }

  function handleEdit(item: StageAction) {
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

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mt-3 border-t border-neutral-100 pt-3">
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-semibold text-neutral-600">اکشن‌ها</h5>
        <Button size="sm" variant="outline" onClick={handleCreate} className="gap-1 h-7 text-xs">
          <Plus className="w-3 h-3" /> اکشن
        </Button>
      </div>
      {isLoading ? (
        <p className="text-xs text-muted-foreground">در حال بارگذاری...</p>
      ) : actions.length === 0 ? (
        <p className="text-xs text-muted-foreground">اکشنی تعریف نشده</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-500 text-xs">
                <th className="py-1.5 px-2 text-right font-medium">عنوان</th>
                <th className="py-1.5 px-2 text-right font-medium">نوع</th>
                <th className="py-1.5 px-2 text-right font-medium">فیلد هدف</th>
                <th className="py-1.5 px-2 text-center font-medium">اجباری</th>
                <th className="py-1.5 px-2 text-center font-medium">ترتیب</th>
                <th className="py-1.5 px-2 text-center font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((a) => (
                <tr key={a.id} className="border-b border-neutral-50 hover:bg-neutral-50/50">
                  <td className="py-2 px-2 text-right">{a.title}</td>
                  <td className="py-2 px-2 text-right text-xs">{actionTypeLabels[a.action_type] || a.action_type}</td>
                  <td className="py-2 px-2 text-right text-xs">{a.target_field || "—"}</td>
                  <td className="py-2 px-2 text-center">
                    {a.is_required ? <span className="text-green-600 text-xs">بله</span> : <span className="text-xs text-muted-foreground">خیر</span>}
                  </td>
                  <td className="py-2 px-2 text-center text-xs">{a.order}</td>
                  <td className="py-2 px-2 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEdit(a)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => setDeleteTarget(a)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ActionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isPending={isPending}
        editItem={editItem}
        stageId={stageId}
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
