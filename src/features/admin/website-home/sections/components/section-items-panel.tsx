

"use client";

import { useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal, PageHeader } from "@/components/shared";
import {
  useSectionItems,
  useCreateSectionItem,
  useDeleteSectionItem,
} from "../../apis";
import { SectionItemFormDialog } from "./section-item-form";
import type { Section, SectionItem } from "../../types";

interface Props {
  section: Section;
  onBack: () => void;
}

export function SectionItemsPanel({ section, onBack }: Props) {
  const { data: items = [], isLoading } = useSectionItems(section.id);
  const createMutation = useCreateSectionItem();
  const deleteMutation = useDeleteSectionItem();

  const [openForm, setOpenForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SectionItem | null>(null);

  const handleCreate = async (payload: {
    item_id: number;
    is_active: boolean;
  }) => {
    await createMutation.mutateAsync({
      section_id: section.id,
      ...payload,
    });
    setOpenForm(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowRight className="h-5 w-5" />
        </Button>
        <PageHeader
          title={`آیتم‌های «${section.title}»`}
          description="مدیریت آیتم‌های این سکشن"
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setOpenForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          افزودن آیتم
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-card dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className="border-b bg-neutral-50 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3 text-right font-medium">شناسه آیتم</th>
              <th className="px-4 py-3 text-right font-medium">عنوان</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                  آیتمی اضافه نشده است
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                >
                  <td className="px-4 py-3">{item.item_id}</td>
                  <td className="px-4 py-3">
                    {item.item_title ?? `آیتم #${item.item_id}`}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.is_active
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }
                    >
                      {item.is_active ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="h-4 w-4 text-rose-500" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <SectionItemFormDialog
        open={openForm}
        loading={createMutation.isPending}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreate}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف آیتم"
        message="آیا از حذف این آیتم اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}