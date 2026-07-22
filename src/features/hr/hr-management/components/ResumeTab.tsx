"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Trash2, Eye, Download } from "lucide-react";
import { Button, Input, Textarea } from "@/components/ui";
import {
  DataTable,
  ConfirmModal,
  Pagination,
  type DataTableColumn,
} from "@/components/shared";
import PersianDatePicker from "@/components/shared/date-picker/persian-date-picker";
import {
  useResumeList,
  useResumeDetail,
  useCreateResume,
  useDeleteResume,
} from "../apis";
import { LIMIT } from "../constants";
import type { Resume } from "../types";
import { Dialog } from "@/components/ui";

export default function ResumeTab() {
  const [page, setPage] = useState(0);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useResumeList({
    limit: LIMIT,
    offset: page * LIMIT,
  });
  const { data: detail } = useResumeDetail(detailId);
  const deleteMutation = useDeleteResume();

  const items = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / LIMIT);

  const columns: DataTableColumn<Resume>[] = [
    { header: "نام", accessor: "first_name" },
    { header: "نام خانوادگی", accessor: "last_name" },
    { header: "کد ملی", accessor: "national_code" },
    { header: "تلفن", accessor: "phone_number" },
    {
      header: "تاریخ ثبت",
      render: (r) => new Date(r.created_at).toLocaleDateString("fa-IR"),
    },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setDetailId(r.id)}>
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">لیست رزومه‌ها</h3>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 ml-1" /> رزومه جدید
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="رزومه‌ای ثبت نشده"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        count={count}
        limit={LIMIT}
      />

      {/* Detail Dialog */}
      <Dialog
        open={detailId !== null}
        onOpenChange={(v) => !v && setDetailId(null)}
        title="جزئیات رزومه"
        className="max-w-lg"
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <InfoRow
              label="نام"
              value={`${detail.first_name} ${detail.last_name}`}
            />
            <InfoRow label="کد ملی" value={detail.national_code} />
            <InfoRow label="تاریخ تولد" value={detail.birth_date} />
            <InfoRow label="تلفن" value={detail.phone_number} />
            <InfoRow label="توضیحات" value={detail.description} />
            {detail.resume_file && (
              <a
                href={detail.resume_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary-600 hover:underline text-sm"
              >
                <Download className="w-4 h-4" /> دانلود رزومه
              </a>
            )}
          </div>
        )}
      </Dialog>

      {/* Create Dialog */}
      <ResumeCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {/* Delete Confirm */}
      <ConfirmModal
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="حذف رزومه"
        message="آیا از حذف این رزومه اطمینان دارید؟"
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-24 shrink-0">{label}:</span>
      <span>{value || "-"}</span>
    </div>
  );
}

function ResumeCreateDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const createMutation = useCreateResume();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      national_code: "",
      birth_date: "",
      phone_number: "",
      description: "",
    },
  });

  function onSubmit(data: Record<string, string>) {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, v));
    fd.append("user", "1");
    if (file) fd.append("resume_file", file);
    createMutation.mutate(fd, { onSuccess: onClose });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="ثبت رزومه جدید"
      className="max-w-lg"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="resume-form"
            disabled={createMutation.isPending}
            className="flex-1"
          >
            {createMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
          </Button>
        </div>
      }
    >
      <form
        id="resume-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="نام"
            error={errors.first_name?.message}
            {...register("first_name", { required: "نام الزامی است" })}
          />
          <Input
            label="نام خانوادگی"
            error={errors.last_name?.message}
            {...register("last_name", { required: "نام خانوادگی الزامی است" })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="کد ملی" {...register("national_code")} />
          <Controller
            name="birth_date"
            control={control}
            render={({ field }) => (
              <PersianDatePicker
                label="تاریخ تولد"
                placeholder="تاریخ تولد"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <Input
          label="شماره موبایل"
          error={errors.phone_number?.message}
          {...register("phone_number", { required: "شماره موبایل الزامی است" })}
        />
        <Textarea
          label="توضیحات و سابقه"
          rows={3}
          error={errors.description?.message}
          {...register("description", { required: "توضیحات الزامی است" })}
        />
        <div>
          <label className="text-sm text-muted-foreground mb-1 block">
            فایل رزومه
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>
      </form>
    </Dialog>
  );
}
