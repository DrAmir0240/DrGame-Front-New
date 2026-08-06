"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, List } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal, PageHeader } from "@/components/shared";
import {
  useSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
} from "../apis";
import { SectionFormDialog } from "./components/sections-form";
import { SectionItemsPanel } from "./components/section-items-panel";
import { MODEL_CONTENT_OPTIONS } from "../constants";
import type { Section } from "../types";
import { cn } from "@/lib/utils";

export default function SectionsPage() {
  const { data: sections = [], isLoading } = useSections();
  const createMutation = useCreateSection();
  const updateMutation = useUpdateSection();
  const deleteMutation = useDeleteSection();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Section | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);
  const [managingItems, setManagingItems] = useState<Section | null>(null);

  const handleSubmit = async (payload: {
    title: string;
    model_content: string;
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

  if (managingItems) {
    return (
      <SectionItemsPanel
        section={managingItems}
        onBack={() => setManagingItems(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="سکشن‌های صفحه اصلی"
        description="مدیریت بخش‌های محتوایی صفحه اصلی"
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
          سکشن جدید
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-card dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3 text-right font-medium">عنوان</th>
              <th className="px-4 py-3 text-right font-medium">نوع محتوا</th>
              <th className="px-4 py-3 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : sections.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                  سکشنی ثبت نشده است
                </td>
              </tr>
            ) : (
              sections.map((section) => {
                const typeLabel =
                  MODEL_CONTENT_OPTIONS.find(
                    (o) => o.value === section.model_content
                  )?.label ?? section.model_content;

                return (
                  <tr
                    key={section.id}
                    className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                  >
                    <td className="px-4 py-3 font-medium">{section.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-medium text-primary-600">
                        {typeLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="مدیریت آیتم‌ها"
                          onClick={() => setManagingItems(section)}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(section);
                            setOpenForm(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(section)}
                        >
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <SectionFormDialog
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
        title="حذف سکشن"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}