"use client";

import { useState } from "react";
import { ArrowRight, Pencil, Trash2, Wallet, Clock, FileText, Briefcase, Upload } from "lucide-react";
import { Button, Badge, Input } from "@/components/ui";
import { useEmployeeDetail, useDeleteEmployee, useEmployeeFiles, useUploadEmployeeFile, useDeleteEmployeeFile } from "../apis";
import EmployeeFormDialog from "./EmployeeFormDialog";
import { ConfirmModal } from "@/components/shared";
import { formatNumber } from "@/utils/format";
import type { Employee } from "../types";

interface Props {
  employee: Employee;
  onBack: () => void;
  onRefresh: () => void;
}

export default function EmployeeProfilePanel({ employee, onBack, onRefresh }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [fileDeleteId, setFileDeleteId] = useState<number | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const { data: detail, isLoading } = useEmployeeDetail(employee.id);
  const { data: filesData } = useEmployeeFiles(employee.id);
  const deleteMutation = useDeleteEmployee();
  const deleteFileMutation = useDeleteEmployeeFile();
  const uploadMutation = useUploadEmployeeFile();

  const files = filesData?.results ?? [];

  function handleDelete() {
    deleteMutation.mutate(employee.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        onBack();
        onRefresh();
      },
    });
  }

  function handleFileDelete(id: number) {
    deleteFileMutation.mutate(id, {
      onSuccess: () => setFileDeleteId(null),
    });
  }

  function handleFileUpload() {
    if (!uploadFile || !uploadTitle) return;
    const fd = new FormData();
    fd.append("employee", String(employee.id));
    fd.append("title", uploadTitle);
    fd.append("file", uploadFile);
    uploadMutation.mutate(fd, {
      onSuccess: () => {
        setUploadTitle("");
        setUploadFile(null);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  if (!detail) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-bold">پروفایل کارمند</h2>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-neutral-200 p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xl">
              {detail.profile_picture ? (
                <img src={detail.profile_picture} alt="" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                detail.first_name?.[0]
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">{detail.full_name}</h3>
              <p className="text-sm text-muted-foreground">کد پرسنلی: {detail.employee_id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Pencil className="w-4 h-4 ml-1" /> ویرایش
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="w-4 h-4 ml-1" /> حذف
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
          <div>
            <span className="text-muted-foreground">کد ملی:</span>
            <span className="mr-1 font-medium">{detail.national_code || "-"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">تاریخ تولد:</span>
            <span className="mr-1 font-medium">{detail.birth_date || "-"}</span>
          </div>
          <div>
            <span className="text-muted-foreground">پورسانت:</span>
            <span className="mr-1 font-medium">
              {detail.has_commission ? `${formatNumber(detail.commission_amount)} تومان` : "ندارد"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">تاریخ ایجاد:</span>
            <span className="mr-1 font-medium">{new Date(detail.created_at).toLocaleDateString("fa-IR")}</span>
          </div>
        </div>

        {detail.roles_detail?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {detail.roles_detail.map((role) => (
              <Badge key={role.id} variant="outline" className="text-xs">
                {role.role_name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="موجودی کیف پول"
          value={`${formatNumber(detail.wallet_balance)} تومان`}
          color="text-emerald-600 bg-emerald-50"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="آخرین تردد"
          value={
            detail.last_arrival
              ? `${new Date(detail.last_arrival.check_in).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}`
              : "-"
          }
          color="text-blue-600 bg-blue-50"
        />
        <StatCard
          icon={<Briefcase className="w-5 h-5" />}
          label="درخواست‌ها"
          value={`${detail.stats.total_requests} (${detail.stats.pending_requests} در انتظار)`}
          color="text-amber-600 bg-amber-50"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="فایل‌ها"
          value={String(detail.stats.total_files)}
          color="text-purple-600 bg-purple-50"
        />
      </div>

      {/* Files Section */}
      <div className="rounded-xl border border-neutral-200 p-5">
        <h4 className="font-semibold text-sm mb-3">فایل‌های کارمند</h4>

        <div className="flex gap-2 mb-3">
          <Input
            placeholder="عنوان فایل"
            value={uploadTitle}
            onChange={(e) => setUploadTitle(e.target.value)}
            className="flex-1"
          />
          <input
            type="file"
            onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          <Button
            size="sm"
            onClick={handleFileUpload}
            disabled={!uploadFile || !uploadTitle || uploadMutation.isPending}
          >
            <Upload className="w-4 h-4 ml-1" />
            {uploadMutation.isPending ? "آپلود..." : "آپلود"}
          </Button>
        </div>

        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">فایلی موجود نیست</p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{file.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.created_at).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={file.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:underline"
                  >
                    دانلود
                  </a>
                  <button
                    onClick={() => setFileDeleteId(file.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EmployeeFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          setEditOpen(false);
          onRefresh();
        }}
        employee={detail}
      />

      <ConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="حذف کارمند"
        message={`آیا از حذف ${detail.full_name} اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
      />

      <ConfirmModal
        open={fileDeleteId !== null}
        onOpenChange={(v) => !v && setFileDeleteId(null)}
        title="حذف فایل"
        message="آیا از حذف این فایل اطمینان دارید؟"
        onConfirm={() => fileDeleteId && handleFileDelete(fileDeleteId)}
        loading={deleteFileMutation.isPending}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-200 p-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${color}`}>
        {icon}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
}
