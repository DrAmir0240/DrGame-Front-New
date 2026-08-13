"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calculator, Plus, Eye, Wallet } from "lucide-react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { PageHeader, DataTable, type DataTableColumn } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import PersianDatePicker from "@/components/shared/date-picker/persian-date-picker";
import { useEmployeesDropdown } from "@/features/hr/hr-management/apis";
import { formatPrice } from "@/utils/format";
import {
  usePayrollPreview,
  usePayrollList,
  usePayrollDetail,
  useCreatePayrollInvoice,
  usePaySalary,
} from "./apis";
import type {
  PayrollListItem,
  PayrollIssueFormData,
  PayrollPayFormData,
} from "./types";

export default function PayrollPage() {
  const { data: employeesResponse } = useEmployeesDropdown();
  const employees = employeesResponse?.results ?? [];

  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [openIssue, setOpenIssue] = useState(false);
  const [openPay, setOpenPay] = useState<PayrollListItem | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  const preview = usePayrollPreview(employeeId, from || null, to || null);
  const { data: payrolls = [], isLoading } = usePayrollList();
  const { data: detail } = usePayrollDetail(detailId);
  const createInvoice = useCreatePayrollInvoice();
  const paySalary = usePaySalary();

  const { register, handleSubmit, reset } =
    useForm<PayrollIssueFormData>({
      defaultValues: {
        employee_id: 0,
        period_from: "",
        period_to: "",
        base_salary: 0,
        bonus: 0,
        housing_allowance: 0,
        food_allowance: 0,
        transportation_allowance: 0,
        insurance_deduction: 0,
        tax_deduction: 0,
        loan_deduction: 0,
        other_deductions: 0,
        description: "",
      },
    });

  const {
    register: payRegister,
    handleSubmit: payHandleSubmit,
    reset: payReset,
    formState: { errors: payErrors },
  } = useForm<PayrollPayFormData>({
    defaultValues: { employee_id: 0, amount: 0, bank_account_id: 0, invoice_ids: [], description: "" },
  });

  function openIssueDialog() {
    reset({
      employee_id: employeeId ?? 0,
      period_from: from,
      period_to: to,
      base_salary: 0,
      bonus: 0,
      housing_allowance: 0,
      food_allowance: 0,
      transportation_allowance: 0,
      insurance_deduction: 0,
      tax_deduction: 0,
      loan_deduction: 0,
      other_deductions: 0,
      description: "",
    });
    setOpenIssue(true);
  }

  function openPayDialog(row: PayrollListItem) {
    payReset({
      employee_id: employeeId ?? row.account_side_id,
      amount: row.remaining_amount,
      bank_account_id: 0,
      invoice_ids: [row.id],
      description: "",
    });
    setOpenPay(row);
  }

  const columns: DataTableColumn<PayrollListItem>[] = [
    { header: "شماره", render: (r) => <span className="font-medium">#{r.id}</span> },
    { header: "کارمند", render: (r) => r.account_side_name || "—" },
    { header: "بازه", render: (r) => `${r.period_from} تا ${r.period_to}` },
    { header: "مبلغ", render: (r) => formatPrice(r.amount) },
    { header: "مانده", render: (r) => (
      <span className={r.remaining_amount > 0 ? "text-red-600 font-medium" : "text-emerald-600"}>
        {formatPrice(r.remaining_amount)}
      </span>
    )},
    { header: "پرداخت", render: (r) => <StatusBadge status={r.payment_status} /> },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailId(r.id)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-emerald-600"
            onClick={() => openPayDialog(r)}
            disabled={r.remaining_amount <= 0}
            title="پرداخت حقوق"
          >
            <Wallet className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="حقوق و دستمزد"
        description="پیش‌نمایش، صدور و پرداخت حقوق کارمندان (بر اساس راهنمای API)"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border border-neutral-200 rounded-xl p-4 space-y-4">
          <h3 className="text-sm font-semibold">پیش‌نمایش حقوق</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-neutral-700">کارمند</label>
              <Select value={employeeId ? String(employeeId) : ""} onValueChange={(v) => setEmployeeId(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کارمند" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <PersianDatePicker
              value={from}
              onChange={setFrom}
              label="از تاریخ"
              placeholder="انتخاب تاریخ"
            />
            <PersianDatePicker
              value={to}
              onChange={setTo}
              label="تا تاریخ"
              placeholder="انتخاب تاریخ"
            />
          </div>

          {preview.data && (
            <div className="grid grid-cols-3 gap-3 border-t border-neutral-100 pt-4">
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">موجودی کیف پول</p>
                <p className="font-bold">{formatPrice(preview.data.wallet_balance)}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">جمع کمیسیون تسویه‌نشده</p>
                <p className="font-bold text-emerald-600">{formatPrice(preview.data.commission_total)}</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-3">
                <p className="text-xs text-neutral-500">تعداد تراکنش‌های کمیسیون</p>
                <p className="font-bold">{preview.data.unsettled_transactions.length}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => preview.refetch()} disabled={preview.isFetching} className="gap-2">
              <Calculator className="w-4 h-4" /> {preview.isFetching ? "در حال محاسبه..." : "محاسبه پیش‌نمایش"}
            </Button>
            <Button onClick={openIssueDialog} disabled={!employeeId} className="gap-2">
              <Plus className="w-4 h-4" /> صدور حقوق
            </Button>
          </div>
        </div>

        <div className="border border-neutral-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2">نکته</h3>
          <p className="text-sm text-neutral-500 leading-6">
            فرمول: پایه + پاداش + کمک‌هزینه‌ها + کمیسیون - کسورات. پس از صدور، کمیسیون‌های تسویه‌نشده
            داخل بازه به فاکتور اضافه و تسویه می‌شوند.
          </p>
        </div>
      </div>

      <DataTable columns={columns} data={payrolls} isLoading={isLoading} emptyMessage="فیش حقوقی صادر نشده" />

      <Dialog
        open={openIssue}
        onOpenChange={(v) => !v && setOpenIssue(false)}
        title="صدور حقوق"
        className="max-w-xl"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpenIssue(false)} disabled={createInvoice.isPending}>
              انصراف
            </Button>
            <Button type="submit" form="issue-form" disabled={createInvoice.isPending}>
              {createInvoice.isPending ? "در حال صدور..." : "صدور"}
            </Button>
          </>
        }
      >
        <form id="issue-form" onSubmit={handleSubmit((data) => createInvoice.mutateAsync(data).then(() => setOpenIssue(false)))} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="حقوق پایه" type="number" {...register("base_salary", { valueAsNumber: true })} />
            <Input label="پاداش" type="number" {...register("bonus", { valueAsNumber: true })} />
            <Input label="کمک هزینه مسکن" type="number" {...register("housing_allowance", { valueAsNumber: true })} />
            <Input label="کمک هزینه خوراک" type="number" {...register("food_allowance", { valueAsNumber: true })} />
            <Input label="ایاب و ذهاب" type="number" {...register("transportation_allowance", { valueAsNumber: true })} />
            <Input label="بیمه" type="number" {...register("insurance_deduction", { valueAsNumber: true })} />
            <Input label="مالیات" type="number" {...register("tax_deduction", { valueAsNumber: true })} />
            <Input label="قسط وام" type="number" {...register("loan_deduction", { valueAsNumber: true })} />
            <Input label="سایر کسورات" type="number" {...register("other_deductions", { valueAsNumber: true })} />
            <Input label="توضیحات" {...register("description")} />
          </div>
        </form>
      </Dialog>

      <Dialog
        open={!!openPay}
        onOpenChange={(v) => !v && setOpenPay(null)}
        title={`پرداخت حقوق فاکتور #${openPay?.id ?? ""}`}
        className="max-w-md"
        footer={
          <>
            <Button type="button" variant="outline" onClick={() => setOpenPay(null)} disabled={paySalary.isPending}>
              انصراف
            </Button>
            <Button type="submit" form="pay-form" disabled={paySalary.isPending}>
              {paySalary.isPending ? "در حال پرداخت..." : "پرداخت"}
            </Button>
          </>
        }
      >
        <form id="pay-form" onSubmit={payHandleSubmit((data) => paySalary.mutateAsync(data).then(() => setOpenPay(null)))} className="space-y-4">
          <Input label="مبلغ" type="number" error={payErrors.amount?.message} {...payRegister("amount", { required: "مبلغ الزامی است", valueAsNumber: true })} />
          <Input label="شناسه حساب بانکی" type="number" error={payErrors.bank_account_id?.message} {...payRegister("bank_account_id", { required: "الزامی است", valueAsNumber: true })} />
          <Input label="توضیحات" {...payRegister("description")} />
        </form>
      </Dialog>

      <Dialog
        open={!!detail}
        onOpenChange={(v) => !v && setDetailId(null)}
        title="جزئیات فیش حقوق"
        className="max-w-lg"
        footer={
          <Button type="button" variant="outline" onClick={() => setDetailId(null)}>
            بستن
          </Button>
        }
      >
        {detail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>کارمند: <b>{detail.account_side_name}</b></div>
              <div>مبلغ: <b>{formatPrice(detail.amount)}</b></div>
              <div>مانده: <b>{formatPrice(detail.remaining_amount)}</b></div>
              <div>وضعیت: <StatusBadge status={detail.payment_status} /></div>
            </div>
            {detail.payroll_detail && (
              <div className="border border-neutral-200 rounded-lg p-3 text-sm space-y-1">
                <p>پایه: <b>{formatPrice(detail.payroll_detail.base_salary)}</b></p>
                <p>پاداش: <b>{formatPrice(detail.payroll_detail.bonus)}</b></p>
                <p>جمع کسورات: <b>{formatPrice(detail.payroll_detail.total_deductions)}</b></p>
                <p>خالص: <b>{formatPrice(detail.payroll_detail.net_salary)}</b></p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium mb-2">کمیسیون‌ها</p>
              {detail.commission_transactions.length === 0 && (
                <p className="text-sm text-neutral-400">موردی ثبت نشده</p>
              )}
              {detail.commission_transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm border-b border-neutral-100 py-2">
                  <span>{t.description || "کمیسیون"}</span>
                  <b>{formatPrice(t.amount)}</b>
                </div>
              ))}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
