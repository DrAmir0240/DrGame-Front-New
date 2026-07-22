"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
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
  useArrivalList,
  useEmployeesDropdown,
  useCreateArrival,
  useUpdateArrival,
  useDeleteArrival,
} from "../apis";
import { LIMIT } from "../constants";
import type { Arrival } from "../types";
import { Dialog } from "@/components/ui";

export default function ArrivalTab() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<{
    employee?: number;
    date_from?: string;
    date_to?: string;
  }>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [editItem, setEditItem] = useState<Arrival | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useArrivalList({
    ...filters,
    limit: LIMIT,
    offset: page * LIMIT,
  });
  const { data: empData } = useEmployeesDropdown();
  const deleteMutation = useDeleteArrival();

  const items = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / LIMIT);
  const employees = empData?.results ?? [];

  const columns: DataTableColumn<Arrival>[] = [
    {
      header: "کارمند",
      render: (r) =>
        r.employee_detail?.full_name || String(r.employee),
    },
    {
      header: "ورود",
      render: (r) =>
        new Date(r.check_in).toLocaleString("fa-IR"),
    },
    {
      header: "خروج",
      render: (r) =>
        r.check_out
          ? new Date(r.check_out).toLocaleString("fa-IR")
          : "-",
    },
    {
      header: "مدت (دقیقه)",
      render: (r) =>
        r.duration_minutes != null
          ? String(r.duration_minutes)
          : "-",
    },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditItem(r)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
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
        <h3 className="font-semibold">حضور و غیاب</h3>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 ml-1" /> تردد جدید
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
            {employees.map((emp) => (
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
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="رکورد حضور و غیابی ثبت نشده"
      />

      <Pagination page={page} totalPages={totalPages} count={count} limit={LIMIT} onPageChange={setPage} />

      <ArrivalFormDialog
        open={createOpen || editItem !== null}
        onClose={() => {
          setCreateOpen(false);
          setEditItem(null);
        }}
        editing={editItem}
        employees={employees}
      />

      <ConfirmModal
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
        title="حذف تردد"
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

function ArrivalFormDialog({
  open,
  onClose,
  editing,
  employees,
}: {
  open: boolean;
  onClose: () => void;
  editing: Arrival | null;
  employees: { id: number; full_name: string }[];
}) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      employee: editing?.employee || 0,
      check_in_date: editing?.check_in?.slice(0, 10) || "",
      check_in_time: editing?.check_in?.slice(11, 16) || "",
      check_out_date: editing?.check_out?.slice(0, 10) || "",
      check_out_time: editing?.check_out?.slice(11, 16) || "",
    },
  });

  const createMutation = useCreateArrival();
  const updateMutation = useUpdateArrival();

  function onSubmit(data: { employee: number; check_in_date: string; check_in_time: string; check_out_date: string; check_out_time: string }) {
    const check_in = data.check_in_date && data.check_in_time
      ? `${data.check_in_date}T${data.check_in_time}`
      : data.check_in_date;
    const check_out = data.check_out_date && data.check_out_time
      ? `${data.check_out_date}T${data.check_out_time}`
      : data.check_out_date || undefined;
    const payload = { employee: data.employee, check_in, check_out };
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, ...payload },
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: onClose,
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title={editing ? "ویرایش تردد" : "تردد جدید"}
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
            form="arrival-form"
            className="flex-1"
          >
            ذخیره
          </Button>
        </div>
      }
    >
      <form
        id="arrival-form"
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

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="check_in_date"
            control={control}
            rules={{ required: "تاریخ ورود الزامی است" }}
            render={({ field }) => (
              <PersianDatePicker
                label="تاریخ ورود"
                placeholder="تاریخ ورود"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Input
            label="ساعت ورود"
            type="time"
            error={errors.check_in_time?.message}
            {...register("check_in_time", { required: "ساعت ورود الزامی است" })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="check_out_date"
            control={control}
            render={({ field }) => (
              <PersianDatePicker
                label="تاریخ خروج"
                placeholder="تاریخ خروج"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Input
            label="ساعت خروج"
            type="time"
            {...register("check_out_time")}
          />
        </div>
      </form>
    </Dialog>
  );
}
