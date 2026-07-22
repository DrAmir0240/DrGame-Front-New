"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, ChevronDown, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import type { StageListItem, StageDetail, OrderPrefix } from "../../../types";
import { useCategoryStages, useStageDetail, useCreateStage, useUpdateStage, useDeleteStage } from "../../../apis";
import StageFormModal from "./StageFormModal";
import ActionSection from "./ActionSection";

interface Props {
  categoryId: number;
  orderPrefix: OrderPrefix;
  roles: { id: number; role_name: string }[];
}

export default function StageSection({ categoryId, orderPrefix, roles }: Props) {
  const { data: stages = [], isLoading } = useCategoryStages(orderPrefix, categoryId);
  const [expandedStageId, setExpandedStageId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<StageListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StageListItem | null>(null);

  const { data: stageDetail } = useStageDetail(orderPrefix, expandedStageId);

  const createMutation = useCreateStage(orderPrefix);
  const updateMutation = useUpdateStage(orderPrefix);
  const deleteMutation = useDeleteStage(orderPrefix);

  function handleCreate() {
    setEditItem(null);
    setFormOpen(true);
  }

  function handleEdit(e: React.MouseEvent, item: StageListItem) {
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
    setExpandedStageId((prev) => (prev === id ? null : id));
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-neutral-700">مراحل</h4>
        <Button size="sm" variant="outline" onClick={handleCreate} className="gap-1 h-7 text-xs">
          <Plus className="w-3 h-3" /> مرحله
        </Button>
      </div>

      {isLoading ? (
        <p className="text-xs text-muted-foreground px-2">در حال بارگذاری...</p>
      ) : stages.length === 0 ? (
        <p className="text-xs text-muted-foreground px-2">مرحله‌ای تعریف نشده</p>
      ) : (
        <div className="space-y-1">
          {stages.sort((a, b) => a.order - b.order).map((stage) => (
            <div key={stage.id} className="border border-neutral-100 rounded-lg overflow-hidden">
              <div
                className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-neutral-50/80 transition-colors"
                onClick={() => toggleExpand(stage.id)}
              >
                {expandedStageId === stage.id ? (
                  <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                ) : (
                  <ChevronLeft className="w-4 h-4 text-neutral-400 shrink-0" />
                )}
                <span className="text-xs text-neutral-400 w-5 text-center">{stage.order}</span>
                <span className="text-sm font-medium flex-1">{stage.title}</span>
                {stage.is_start && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">شروع</span>}
                {stage.is_end && <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">پایان</span>}
                <span className="text-[10px] text-muted-foreground">{stage.employee_role_detail?.role_name}</span>
                <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleEdit(e, stage)}>
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => setDeleteTarget(stage)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {expandedStageId === stage.id && stageDetail && (
                <div className="px-3 pb-3 border-t border-neutral-50">
                  {stageDetail.description && (
                    <p className="text-xs text-muted-foreground mt-2">{stageDetail.description}</p>
                  )}
                  <ActionSection
                    actions={stageDetail.actions}
                    stageId={stage.id}
                    orderPrefix={orderPrefix}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <StageFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        isPending={isPending}
        editItem={editItem}
        categoryId={categoryId}
        roles={roles}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleteMutation.isPending}
        message={deleteTarget ? `آیا از حذف مرحله "${deleteTarget.title}" اطمینان دارید؟` : undefined}
      />
    </div>
  );
}
