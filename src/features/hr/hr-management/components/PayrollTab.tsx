"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { Plus, Eye } from "lucide-react";
import { Button, Badge, Input, Textarea } from "@/components/ui";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { DataTable, Pagination, type DataTableColumn } from "@/components/shared";
import {
  usePayrollList,
  usePayrollDetail,
  useCreatePayroll,
  useAccountSidesDropdown,
  useCategoryDropdown,
} from "../apis";
import { LIMIT, paymentStatusConfig } from "../constants";
import type { Payroll } from "../types";
import { Dialog } from "@/components/ui";

export default function PayrollTab() {
  const [page, setPage] = useState(0);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = usePayrollList({
    limit: LIMIT,
    offset: page * LIMIT,
  });
  const { data: detail } = usePayrollDetail(detailId);

  const items = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / LIMIT);

  const columns: DataTableColumn<Payroll>[] = [
    {
      header: "طرف حساب",
      render: (r) =>
        r.account_side_detail?.name || String(r.account_side),
    },
    {
      header: "مبلغ کل",
      render: (r) =>
        new Intl.NumberFormat("fa-IR").format(r.amount) +
        " تومان",
    },
    {
      header: "پرداخت شده",
      render: (r) =>
        new Intl.NumberFormat("fa-IR").format(r.paid_amount) +
        " تومان",
    },
    {
      header: "مانده",
      render: (r) =>
        new Intl.NumberFormat("fa-IR").format(
          r.remaining_amount
        ) + " تومان",
    },
    {
      header: "وضعیت پرداخت",
      render: (r) => {
        const cfg = paymentStatusConfig[r.payment_status];
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
      header: "تاریخ",
      render: (r) =>
        new Date(r.created_at).toLocaleDateString("fa-IR"),
    },
    {
      header: "عملیات",
      render: (r) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDetailId(r.id)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">فیش‌های حقوقی</h3>
        <Button size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 ml-1" /> فیش جدید
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="فیش حقوقی صادر نشده"
      />

      <Pagination page={page} totalPages={totalPages} count={count} limit={LIMIT} onPageChange={setPage} />

      {/* Detail Dialog */}
      <Dialog
        open={detailId !== null}
        onOpenChange={(v) => !v && setDetailId(null)}
        title="جزئیات فیش حقوقی"
        className="max-w-2xl"
      >
        {detail && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Row
                label="طرف حساب"
                value={detail.account_side_detail?.name}
              />
              <Row
                label="مبلغ کل"
                value={`${new Intl.NumberFormat("fa-IR").format(detail.amount)} تومان`}
              />
              <Row
                label="پرداخت شده"
                value={`${new Intl.NumberFormat("fa-IR").format(detail.paid_amount)} تومان`}
              />
              <Row
                label="مانده"
                value={`${new Intl.NumberFormat("fa-IR").format(detail.remaining_amount)} تومان`}
              />
            </div>

            {detail.payroll_detail && (
              <>
                <h4 className="font-semibold border-b border-neutral-200 pb-2 mt-4">
                  جزئیات حقوقی
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Row
                    label="حقوق پایه"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.base_salary)} تومان`}
                  />
                  <Row
                    label="اضافه‌کاری"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.overtime_amount)} تومان`}
                  />
                  <Row
                    label="پاداش"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.bonus)} تومان`}
                  />
                  <Row
                    label="حق مسکن"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.housing_allowance)} تومان`}
                  />
                  <Row
                    label="حق خواربار"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.food_allowance)} تومان`}
                  />
                  <Row
                    label="حق ایاب و ذهاب"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.transportation_allowance)} تومان`}
                  />
                </div>
                <h4 className="font-semibold border-b border-neutral-200 pb-2 mt-4">
                  کسورات
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <Row
                    label="کسر بیمه"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.insurance_deduction)} تومان`}
                  />
                  <Row
                    label="کسر مالیات"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.tax_deduction)} تومان`}
                  />
                  <Row
                    label="کسر اقساط"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.loan_deduction)} تومان`}
                  />
                  <Row
                    label="سایر کسورات"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.other_deductions)} تومان`}
                  />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4 p-3 bg-neutral-50 rounded-lg">
                  <Row
                    label="جمع حقوق ناخالص"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.gross_salary)} تومان`}
                  />
                  <Row
                    label="جمع کسورات"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.total_deductions)} تومان`}
                  />
                  <Row
                    label="حقوق خالص"
                    value={`${new Intl.NumberFormat("fa-IR").format(detail.payroll_detail.net_salary)} تومان`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Row
                    label="روزهای کارکرد"
                    value={String(
                      detail.payroll_detail.work_days
                    )}
                  />
                  <Row
                    label="ساعات اضافه‌کاری"
                    value={String(
                      detail.payroll_detail.overtime_hours
                    )}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </Dialog>

      <PayrollCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <span className="text-muted-foreground text-xs">
        {label}
      </span>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

function PayrollCreateDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      account_side: "",
      category: "",
      discount: 0,
      description: "",
      base_salary: 0,
      overtime_amount: 0,
      bonus: 0,
      housing_allowance: 0,
      food_allowance: 0,
      transportation_allowance: 0,
      insurance_deduction: 0,
      tax_deduction: 0,
      loan_deduction: 0,
      other_deductions: 0,
      work_days: 22,
      overtime_hours: 0,
      payroll_description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        account_side: "",
        category: "",
        discount: 0,
        description: "",
        base_salary: 0,
        overtime_amount: 0,
        bonus: 0,
        housing_allowance: 0,
        food_allowance: 0,
        transportation_allowance: 0,
        insurance_deduction: 0,
        tax_deduction: 0,
        loan_deduction: 0,
        other_deductions: 0,
        work_days: 22,
        overtime_hours: 0,
        payroll_description: "",
      });
    }
  }, [open, reset]);

  const watched = useWatch({ control });
  const createMutation = useCreatePayroll();
  const { data: accountSides } = useAccountSidesDropdown();
  const { data: categories } = useCategoryDropdown();

  const gross =
    (watched.base_salary || 0) +
    (watched.overtime_amount || 0) +
    (watched.bonus || 0) +
    (watched.housing_allowance || 0) +
    (watched.food_allowance || 0) +
    (watched.transportation_allowance || 0);
  const deductions =
    (watched.insurance_deduction || 0) +
    (watched.tax_deduction || 0) +
    (watched.loan_deduction || 0) +
    (watched.other_deductions || 0);
  const net = gross - deductions;

  function onSubmit(data: Record<string, unknown>) {
    const payload = {
      ...data,
      account_side: Number(data.account_side),
      category: data.category ? Number(data.category) : 0,
    };
    createMutation.mutate(payload as never, { onSuccess: onClose });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="صدور فیش حقوقی"
      className="max-w-2xl"
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
            form="payroll-form"
            disabled={createMutation.isPending}
            className="flex-1"
          >
            {createMutation.isPending
              ? "در حال صدور..."
              : "صدور فیش"}
          </Button>
        </div>
      }
    >
      <form
        id="payroll-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="account_side"
            control={control}
            rules={{ required: "انتخاب طرف حساب الزامی است" }}
            render={({ field }) => (
              <div className="space-y-2">
                <Select
                  value={field.value || ""}
                  onValueChange={(v) => field.onChange(v)}
                >
                  <SelectTrigger label="طرف حساب *">
                    <SelectValue placeholder="انتخاب طرف حساب" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountSides?.map((a) => (
                      <SelectItem key={a.key} value={a.key}>
                        {a.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.account_side && <p className="text-xs text-red-500">{errors.account_side.message}</p>}
              </div>
            )}
          />

          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={(v) => field.onChange(v)}
              >
                <SelectTrigger label="دسته‌بندی">
                  <SelectValue placeholder="انتخاب دسته" />
                </SelectTrigger>
                <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.key} value={c.key}>
                        {c.value}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <h4 className="font-semibold text-sm border-b border-neutral-200 pb-2">
          حقوق و مزایا
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <Input label="حقوق پایه" type="number" {...register("base_salary", { valueAsNumber: true })} />
          <Input label="اضافه‌کاری" type="number" {...register("overtime_amount", { valueAsNumber: true })} />
          <Input label="پاداش" type="number" {...register("bonus", { valueAsNumber: true })} />
          <Input label="حق مسکن" type="number" {...register("housing_allowance", { valueAsNumber: true })} />
          <Input label="حق خواربار" type="number" {...register("food_allowance", { valueAsNumber: true })} />
          <Input label="حق ایاب و ذهاب" type="number" {...register("transportation_allowance", { valueAsNumber: true })} />
        </div>

        <h4 className="font-semibold text-sm border-b border-neutral-200 pb-2">
          کسورات
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <Input label="کسر بیمه" type="number" {...register("insurance_deduction", { valueAsNumber: true })} />
          <Input label="کسر مالیات" type="number" {...register("tax_deduction", { valueAsNumber: true })} />
          <Input label="کسر اقساط" type="number" {...register("loan_deduction", { valueAsNumber: true })} />
          <Input label="سایر کسورات" type="number" {...register("other_deductions", { valueAsNumber: true })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input label="روزهای کارکرد" type="number" {...register("work_days", { valueAsNumber: true })} />
          <Input label="ساعات اضافه‌کاری" type="number" {...register("overtime_hours", { valueAsNumber: true })} />
        </div>

        <Textarea
          label="توضیحات"
          rows={2}
          {...register("payroll_description")}
        />

        <div className="p-3 bg-neutral-50 rounded-lg grid grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">
              ناخالص:{" "}
            </span>
            <span className="font-bold">
              {new Intl.NumberFormat("fa-IR").format(gross)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">
              کسورات:{" "}
            </span>
            <span className="font-bold text-red-600">
              {new Intl.NumberFormat("fa-IR").format(
                deductions
              )}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">
              خالص:{" "}
            </span>
            <span className="font-bold text-emerald-600">
              {new Intl.NumberFormat("fa-IR").format(net)}
            </span>
          </div>
        </div>
      </form>
    </Dialog>
  );
}


