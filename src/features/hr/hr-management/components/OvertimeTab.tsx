"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Trash2, Check } from "lucide-react";
import { Button, Badge, Input, Textarea } from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { DataTable, ConfirmModal, Pagination, type DataTableColumn } from "@/components/shared";
import PersianDatePicker from "@/components/shared/date-picker/persian-date-picker";
import {
  useOvertimeList,
  useEmployeesDropdown,
  useCreateOvertime,
  useApproveOvertime,
  useDeleteOvertime,
} from "../apis";
import { LIMIT, overtimeApprovedConfig } from "../constants";
import type { Overtime } from "../types";
import { Dialog } from "@/components/ui";

export default function OvertimeTab() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<{
    employee?: number;
    date_from?: string;
    date_to?: string;
    is_approved?: string;
  }>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useOvertimeList({
    ...filters,
    limit: LIMIT,
    offset: page * LIMIT,
  });
  const { data: employees } = useEmployeesDropdown();
  const approveMutation = useApproveOvertime();
  const deleteMutation = useDeleteOvertime();

  const items = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / LIMIT);
  const empList = employees?.results ?? [];

  function handleApprove(id: number) {
    approveMutation.mutate(id);
  }

  const columns: DataTableColumn<Overtime>[] = [
    {
      header: "کارمند",
      render: (r) =>
        r.employee_detail?.full_name || String(r.employee),
    },
    { header: "تاریخ", accessor: "date" },
    { header: "ساعات", accessor: "hours" },
    { header: "توضیحات", accessor: "description" },
    {
      header: "وضعیت",
      render: (r) => {
        const cfg =
          overtimeApprovedConfig[String(r.is_approved)];
        return (
          <Badge
            variant="outline"
            className={`text-xs border ${cfg?.color}`}
          >
            {cfg?.label}
          </Badge>
        );
      },
    },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1">
          {!r.is_approved && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleApprove(r.id)}
              title="تایید"
            >
              <Check className="w-4 h-4 text-emerald-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteId(r.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">اضافه‌کاری</h3>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 ml-1" /> اضافه‌کاری جدید
        </Button>
      </div>

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

        <PersianDatePicker
          label="از تاریخ"
          placeholder="از تاریخ"
          value={filters.date_from ?? ""}
          onChange={(v) =>
            setFilters({ ...filters, date_from: v || undefined })
          }
        />

        <PersianDatePicker
          label="تا تاریخ"
          placeholder="تا تاریخ"
          value={filters.date_to ?? ""}
          onChange={(v) =>
            setFilters({ ...filters, date_to: v || undefined })
          }
        />

        <Select
          value={filters.is_approved ?? ""}
          onValueChange={(v) =>
            setFilters({
              ...filters,
              is_approved: v || undefined,
            })
          }
        >
          <SelectTrigger className="w-[180px]" label="وضعیت تایید">
            <SelectValue placeholder="همه وضعیت‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">تایید شده</SelectItem>
            <SelectItem value="false">در انتظار</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="اضافه‌کاری ثبت نشده"
      />

      <Pagination page={page} totalPages={totalPages} count={count} limit={LIMIT} onPageChange={setPage} />

      <OvertimeCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        employees={empList}
      />

      <ConfirmModal
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="حذف اضافه‌کاری"
        message="آیا از حذف این رکورد اطمینان دارید؟"
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

function OvertimeCreateDialog({
  open,
  onClose,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  employees: { id: number; full_name: string }[];
}) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      employee: 0,
      date: "",
      hours: 0,
      description: "",
    },
  });
  const createMutation = useCreateOvertime();

  function onSubmit(data: { employee: number; date: string; hours: number; description: string }) {
    createMutation.mutate(data, { onSuccess: onClose });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="اضافه‌کاری جدید"
      className="max-w-md"
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
            form="overtime-form"
            disabled={createMutation.isPending}
            className="flex-1"
          >
            ذخیره
          </Button>
        </div>
      }
    >
      <form
        id="overtime-form"
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
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={String(emp.id)}>
                      {emp.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employee && <p className="text-xs text-red-500">{errors.employee.message}</p>}
            </div>
          )}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: "تاریخ الزامی است" }}
          render={({ field }) => (
            <PersianDatePicker
              label="تاریخ"
              placeholder="تاریخ اضافه‌کاری"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Input
          label="ساعات"
          type="number"
          step="0.5"
          error={errors.hours?.message}
          {...register("hours", { required: "ساعات الزامی است", valueAsNumber: true })}
        />
        <Textarea
          label="توضیحات"
          rows={2}
          {...register("description")}
        />
      </form>
    </Dialog>
  );
}
