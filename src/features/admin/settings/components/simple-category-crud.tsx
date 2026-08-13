"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Pencil, Plus, Trash2, FolderTree } from "lucide-react";
import { Button, Dialog, Input, Textarea } from "@/components/ui";
import { ConfirmModal, PageHeader } from "@/components/shared";

export interface SimpleCategoryItem {
  id: number;
  title: string;
  description: string | null;
}

interface Props {
  pageTitle: string;
  pageDescription: string;
  itemName: string;
  data: SimpleCategoryItem[];
  isLoading?: boolean;
  isSaving?: boolean;
  onCreate: (payload: { title: string; description: string | null }) => Promise<void>;
  onUpdate: (id: number, payload: { title: string; description: string | null }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

interface FormValues {
  title: string;
  description: string;
}

export function SimpleCategoryCrud({
  pageTitle,
  pageDescription,
  itemName,
  data,
  isLoading,
  isSaving,
  onCreate,
  onUpdate,
  onDelete,
}: Props) {
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<SimpleCategoryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SimpleCategoryItem | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { title: "", description: "" } });

  useEffect(() => {
    reset({ title: editing?.title ?? "", description: editing?.description ?? "" });
  }, [editing, openForm, reset]);

  const submit = async (values: FormValues) => {
    const payload = { title: values.title.trim(), description: values.description.trim() || null };
    if (editing) {
      await onUpdate(editing.id, payload);
    } else {
      await onCreate(payload);
    }
    setOpenForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await onDelete(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-4">
      <PageHeader title={pageTitle} description={pageDescription}>
        <Button
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          {itemName} جدید
        </Button>
      </PageHeader>

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
                <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <FolderTree className="h-8 w-8 text-muted-foreground/50" />
                    موردی ثبت نشده است
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.description ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setEditing(item); setOpenForm(true); }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(item)}>
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

      <Dialog
        open={openForm}
        onOpenChange={(v) => !v && setOpenForm(false)}
        title={editing ? `ویرایش ${itemName}` : `${itemName} جدید`}
        className="max-w-md"
        footer={
          <div className="flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenForm(false)} disabled={isSaving}>
              انصراف
            </Button>
            <Button type="submit" form="simple-category-form" className="flex-1 gap-2" disabled={isSaving}>
              {isSaving ? (
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
        <form id="simple-category-form" onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input
            id="title"
            label="عنوان"
            required
            error={errors.title?.message}
            {...register("title", { required: "عنوان الزامی است" })}
          />
          <Textarea
            id="description"
            label="توضیحات"
            {...register("description")}
          />
        </form>
      </Dialog>

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title={`حذف ${itemName}`}
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={isSaving}
      />
    </div>
  );
}
