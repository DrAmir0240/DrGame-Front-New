"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal, PageHeader } from "@/components/shared";
import {
  useBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
} from "../apis";
import { BannerFormDialog } from "./components/banner-form";
import type { Banner } from "../types";
import { cn } from "@/lib/utils";

export default function BannersPage() {
  const { data: banners = [], isLoading } = useBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

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

  return (
    <div className="space-y-4">
      <PageHeader
        title="بنرها"
        description="مدیریت بنرهای صفحه اصلی وب‌سایت"
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
          بنر جدید
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-card dark:border-neutral-700">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
            <tr>
              <th className="px-4 py-3 text-right font-medium">تصویر</th>
              <th className="px-4 py-3 text-right font-medium">عنوان</th>
              <th className="px-4 py-3 text-right font-medium">ترتیب</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  در حال بارگذاری...
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                  بنری ثبت نشده است
                </td>
              </tr>
            ) : (
              banners.map((banner) => (
                <tr
                  key={banner.id}
                  className="border-b border-neutral-100 last:border-0 dark:border-neutral-800"
                >
                  <td className="px-4 py-3">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="h-12 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{banner.title}</td>
                  <td className="px-4 py-3">{banner.order}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-xs font-medium",
                        banner.is_chosen
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-600"
                      )}
                    >
                      {banner.is_chosen ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditing(banner);
                          setOpenForm(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(banner)}
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

      <BannerFormDialog
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
        title="حذف بنر"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}