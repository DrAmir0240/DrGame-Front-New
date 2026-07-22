"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button, Badge, Input, Textarea } from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import {
  DataTable,
  ConfirmModal,
  Pagination,
  type DataTableColumn,
} from "@/components/shared";
import {
  useRequestList,
  useRequestDetail,
  useCreateRequest,
  useUpdateRequestStatus,
  useDeleteRequest,
  useRequestTypeList,
  useCreateRequestType,
  useDeleteRequestType,
  useEmployeesDropdown,
} from "../apis";
import { LIMIT, requestStatusConfig } from "../constants";
import type { EmployeeRequest } from "../types";
import { Dialog } from "@/components/ui";

export default function RequestTab() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<{
    employee?: number;
    status?: string;
    request_type?: number;
  }>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showTypes, setShowTypes] = useState(false);

  const { data, isLoading } = useRequestList({
    ...filters,
    limit: LIMIT,
    offset: page * LIMIT,
  });
  const { data: detail } = useRequestDetail(detailId);
  const { data: employees } = useEmployeesDropdown();
  const deleteMutation = useDeleteRequest();
  const updateStatus = useUpdateRequestStatus();

  const items = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / LIMIT);

  function handleStatusChange(id: number, status: string) {
    updateStatus.mutate({ id, status });
  }

  const columns: DataTableColumn<EmployeeRequest>[] = [
    {
      header: "کارمند",
      render: (r) => r.employee_detail?.full_name || String(r.employee),
    },
    { header: "عنوان", accessor: "title" },
    {
      header: "نوع درخواست",
      render: (r) => r.request_type_detail?.title || "-",
    },
    {
      header: "وضعیت",
      render: (r) => {
        const cfg = requestStatusConfig[r.status];
        return (
          <Badge variant="outline" className={`text-xs border ${cfg?.color}`}>
            {cfg?.label || r.status}
          </Badge>
        );
      },
    },
    {
      header: "تاریخ",
      render: (r) => new Date(r.created_at).toLocaleDateString("fa-IR"),
    },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setDetailId(r.id)}>
            <ChevronDown className="w-4 h-4" />
          </Button>
          {r.status === "waiting" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(r.id, "accepted")}
              >
                <span className="text-emerald-600 text-xs">تایید</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStatusChange(r.id, "rejected")}
              >
                <span className="text-red-600 text-xs">رد</span>
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const empList = employees?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">درخواست‌ها</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTypes(!showTypes)}
          >
            انواع درخواست
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 ml-1" /> درخواست جدید
          </Button>
        </div>
      </div>

      {showTypes && <RequestTypeSection />}

      {/* Filters */}
      <div className="flex gap-3 items-end flex-wrap">
        <Select
          value={filters.employee?.toString() ?? ""}
          onValueChange={(v) =>
            setFilters({
              ...filters,
              employee: v ? Number(v) : undefined,
            })
          }
        >
          <SelectTrigger className="w-[200px]" label="کارمند">
            <SelectValue placeholder="همه کارمندان" />
          </SelectTrigger>
          <SelectContent>
            {empList.map((emp) => (
              <SelectItem key={emp.id} value={String(emp.id)}>
                {emp.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status ?? ""}
          onValueChange={(v) =>
            setFilters({
              ...filters,
              status: v || undefined,
            })
          }
        >
          <SelectTrigger className="w-[200px]" label="وضعیت">
            <SelectValue placeholder="همه وضعیت‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="waiting">در انتظار بررسی</SelectItem>
            <SelectItem value="accepted">تایید شده</SelectItem>
            <SelectItem value="rejected">رد شده</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="درخواستی ثبت نشده"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        count={count}
        limit={LIMIT}
        onPageChange={setPage}
      />

      {/* Detail Dialog */}
      <Dialog
        open={detailId !== null}
        onOpenChange={(v) => !v && setDetailId(null)}
        title="جزئیات درخواست"
        className="max-w-lg"
      >
        {detail && (
          <div className="space-y-3 text-sm">
            <Row
              label="کارمند"
              value={
                detail.employee_detail?.full_name || String(detail.employee)
              }
            />
            <Row label="عنوان" value={detail.title} />
            <Row label="نوع" value={detail.request_type_detail?.title || "-"} />
            <Row label="توضیحات" value={detail.description} />
            <Row
              label="تاریخ"
              value={new Date(detail.created_at).toLocaleString("fa-IR")}
            />
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">وضعیت:</span>
              <Badge
                variant="outline"
                className={`text-xs border ${requestStatusConfig[detail.status]?.color}`}
              >
                {requestStatusConfig[detail.status]?.label}
              </Badge>
            </div>
          </div>
        )}
      </Dialog>

      <RequestCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <ConfirmModal
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="حذف درخواست"
        message="آیا از حذف این درخواست اطمینان دارید؟"
        onConfirm={() => {
          if (deleteId)
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-24 shrink-0">{label}:</span>
      <span>{value || "-"}</span>
    </div>
  );
}

function RequestTypeSection() {
  const { data: typesData } = useRequestTypeList();
  const createMutation = useCreateRequestType();
  const deleteMutation = useDeleteRequestType();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { title: "", description: "" },
  });

  const types = typesData?.results ?? [];

  function onSubmit(data: { title: string; description: string }) {
    createMutation.mutate(
      {
        title: data.title,
        needs_approval: true,
        description: data.description,
      },
      { onSuccess: () => reset() },
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 p-4 space-y-4">
      <h4 className="text-sm font-semibold">انواع درخواست</h4>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Input
          label="عنوان نوع درخواست"
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />
        <Textarea
          label="توضیحات"
          rows={2}
          error={errors.description?.message}
           {...register("description", { required: "توضیحات الزامی است" })}
        />
        <div className="flex justify-end">
          <Button type="submit" size="default" className="w-40">
            افزودن
          </Button>
        </div>
      </form>
      {types.length > 0 && (
        <div className="space-y-2">
          {types.map((t) => (
            <div
              key={t.id}
              className="flex items-start justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-100"
            >
              <div className="space-y-1 w-0 flex-1">
                <span className="text-sm font-medium">{t.title}</span>
                {t.description && (
                  <p
                    className="text-sm text-neutral-500 truncate"
                    title={t.description}
                  >
                    {t.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteMutation.mutate(t.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCreateDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      employee: 0,
      title: "",
      request_type: 0,
      description: "",
    },
  });
  const createMutation = useCreateRequest();
  const { data: employees } = useEmployeesDropdown();
  const { data: typesData } = useRequestTypeList();

  const empList = employees?.results ?? [];
  const types = typesData?.results ?? [];

  function onSubmit(data: {
    employee: number;
    title: string;
    request_type: number;
    description: string;
  }) {
    createMutation.mutate(data, { onSuccess: onClose });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="درخواست جدید"
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
            form="request-form"
            disabled={createMutation.isPending}
            className="flex-1"
          >
            ذخیره
          </Button>
        </div>
      }
    >
      <form
        id="request-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Controller
          name="employee"
          control={control}
          rules={{ required: "انتخاب کارمند الزامی است" }}
          render={({ field }) => (
            <div className="space-y-2">
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger label="کارمند *">
                  <SelectValue placeholder="انتخاب کارمند" />
                </SelectTrigger>
                <SelectContent>
                  {empList.map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employee && (
                <p className="text-xs text-red-500">
                  {errors.employee.message}
                </p>
              )}
            </div>
          )}
        />

        <Input
          label="عنوان"
          error={errors.title?.message}
          {...register("title", { required: "عنوان الزامی است" })}
        />

        <Controller
          name="request_type"
          control={control}
          rules={{ required: "انتخاب نوع درخواست الزامی است" }}
          render={({ field }) => (
            <div className="space-y-2">
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <SelectTrigger label="نوع درخواست *">
                  <SelectValue placeholder="انتخاب نوع" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.request_type && (
                <p className="text-xs text-red-500">
                  {errors.request_type.message}
                </p>
              )}
            </div>
          )}
        />

        <Textarea
          label="توضیحات"
          rows={3}
          {...register("description", { required: "توضیحات الزامی است" })}
        />
      </form>
    </Dialog>
  );
}
