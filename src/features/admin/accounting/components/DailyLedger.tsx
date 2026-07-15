"use client";

import { useState } from "react";
import { Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Button } from "@/components/ui";
import { StatCard, DataTable, ConfirmModal, type DataTableColumn } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import {
  useDailyInvoices,
  useDeleteDailyInvoice,
  useDailyTransactions,
  useDeleteDailyTransaction,
  useDailyPayable,
  useDailyReceivable,
  useAccountSidesList,
  useDeleteAccountSide,
} from "../apis";
import { formatPrice } from "@/utils/format";
import { TrendingUp, TrendingDown, Users, FileText, CreditCard } from "lucide-react";
import type { DailyInvoice, DailyTransaction, DailyPayable, AccountSide } from "../types";
import AccountingDetailModal from "./AccountingDetailModal";

export default function DailyLedger() {
  const { data: transactions = [] as DailyTransaction[], isLoading: loadingTransactions } = useDailyTransactions();
  const { data: payable = [] } = useDailyPayable();
  const { data: receivable = [] } = useDailyReceivable();
  const deleteTransaction = useDeleteDailyTransaction();

  const { data: invoices = [], isLoading: loadingInvoices } = useDailyInvoices();
  const deleteInvoice = useDeleteDailyInvoice();

  const { data: accountSides = [], isLoading: loadingAccountSides } = useAccountSidesList();
  const deleteAccountSide = useDeleteAccountSide();

  const [deleteInvoiceTarget, setDeleteInvoiceTarget] = useState<DailyInvoice | null>(null);
  const [deleteTransactionTarget, setDeleteTransactionTarget] = useState<DailyTransaction | null>(null);
  const [deleteAccountSideTarget, setDeleteAccountSideTarget] = useState<AccountSide | null>(null);
  const [detailType, setDetailType] = useState<"invoice" | "transaction" | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);

  function openDetail(type: "invoice" | "transaction", id: number) {
    setDetailType(type);
    setDetailId(id);
  }

  const totalIncome = transactions.filter((t) => t.direction === "in").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.direction === "out").reduce((s, t) => s + t.amount, 0);

  const invoiceColumns: DataTableColumn<DailyInvoice>[] = [
    { header: "طرف حساب", render: (r) => <span className="font-medium">{r.account_side?.name || "—"}</span> },
    { header: "دسته‌بندی", render: (r) => r.category?.title || "—" },
    { header: "مبلغ", render: (r) => formatPrice(r.amount) },
    { header: "مانده", render: (r) => <span className={r.remaining_amount > 0 ? "text-red-600 font-medium" : "text-emerald-600"}>{formatPrice(r.remaining_amount)}</span> },
    { header: "وضعیت", render: (r) => <StatusBadge status={r.status} /> },
    { header: "پرداخت", render: (r) => <StatusBadge status={r.payment_status} /> },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDetail("invoice", r.id)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteInvoiceTarget(r)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const transactionColumns: DataTableColumn<DailyTransaction>[] = [
    { header: "طرف حساب", render: (r) => <span className="font-medium">{r.account_side?.name || "—"}</span> },
    { header: "حساب بانکی", render: (r) => r.bank_account?.title || "—" },
    { header: "مبلغ", render: (r) => <span className={r.direction === "in" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>{r.direction === "in" ? "+" : "-"}{formatPrice(r.amount)}</span> },
    { header: "جهت", render: (r) => <StatusBadge status={r.direction} /> },
    { header: "توضیحات", render: (r) => <span className="max-w-[200px] truncate block">{r.description || "—"}</span> },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDetail("transaction", r.id)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const payableColumns: DataTableColumn<DailyPayable>[] = [
    { header: "طرف حساب", render: (r) => <span className="font-medium">{r.account_side?.name || "—"}</span> },
    { header: "دسته‌بندی", render: (r) => r.category?.title || "—" },
    { header: "مبلغ", render: (r) => formatPrice(r.amount) },
    { header: "مانده", render: (r) => <span className="text-red-600 font-bold">{formatPrice(r.remaining_amount)}</span> },
    { header: "وضعیت", render: (r) => <StatusBadge status={r.payment_status} /> },
  ];

  const accountSideColumns: DataTableColumn<AccountSide>[] = [
    { header: "نام", render: (r) => <span className="font-medium">{r.name}</span> },
    { header: "نوع", render: (r) => <StatusBadge status={r.type} /> },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteAccountSideTarget(r)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  async function handleConfirmDeleteInvoice() {
    if (!deleteInvoiceTarget) return;
    try { await deleteInvoice.mutateAsync(deleteInvoiceTarget.id); } catch {}
    setDeleteInvoiceTarget(null);
  }

  async function handleConfirmDeleteTransaction() {
    if (!deleteTransactionTarget) return;
    try { await deleteTransaction.mutateAsync(deleteTransactionTarget.id); } catch {}
    setDeleteTransactionTarget(null);
  }

  async function handleConfirmDeleteAccountSide() {
    if (!deleteAccountSideTarget) return;
    try { await deleteAccountSide.mutateAsync(deleteAccountSideTarget.id); } catch {}
    setDeleteAccountSideTarget(null);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="تراکنش‌های امروز" value={transactions.length} icon={Users} />
        <StatCard title="دریافتی امروز" value={formatPrice(totalIncome)} icon={TrendingUp} />
        <StatCard title="پرداختی امروز" value={formatPrice(totalExpense)} icon={TrendingDown} />
        <StatCard title="فاکتورهای امروز" value={invoices.length} icon={FileText} />
      </div>

      <Tabs dir="rtl" defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">فاکتورهای روز</TabsTrigger>
          <TabsTrigger value="transactions">تراکنش‌ها</TabsTrigger>
          <TabsTrigger value="account-sides">طرف‌های حساب</TabsTrigger>
          <TabsTrigger value="payable-receivable">پرداختنی/دریافتنی</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <DataTable columns={invoiceColumns} data={invoices} isLoading={loadingInvoices} emptyMessage="فاکتوری برای امروز ثبت نشده" />
        </TabsContent>

        <TabsContent value="transactions">
          <DataTable columns={transactionColumns} data={transactions} isLoading={loadingTransactions} emptyMessage="تراکنشی برای امروز ثبت نشده" />
        </TabsContent>

        <TabsContent value="account-sides">
          <DataTable columns={accountSideColumns} data={accountSides} isLoading={loadingAccountSides} emptyMessage="طرف حسابی ثبت نشده" />
        </TabsContent>

        <TabsContent value="payable-receivable">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                پرداختنی‌های امروز
              </h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <span className="text-sm text-red-700">جمع مانده: </span>
                <span className="font-bold text-red-800">{formatPrice(payable.reduce((s, p) => s + p.remaining_amount, 0))}</span>
              </div>
              <DataTable columns={payableColumns} data={payable} emptyMessage="حساب پرداختنی‌ای ثبت نشده" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                دریافتنی‌های امروز
              </h3>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4">
                <span className="text-sm text-emerald-700">جمع مانده: </span>
                <span className="font-bold text-emerald-800">{formatPrice(receivable.reduce((s, r) => s + r.remaining_amount, 0))}</span>
              </div>
              <DataTable columns={payableColumns} data={receivable} emptyMessage="حساب دریافتنی‌ای ثبت نشده" />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmModal open={!!deleteInvoiceTarget} onOpenChange={(v) => !v && setDeleteInvoiceTarget(null)} onConfirm={handleConfirmDeleteInvoice} loading={deleteInvoice.isPending} message="آیا از حذف این فاکتور اطمینان دارید؟" />
      <ConfirmModal open={!!deleteTransactionTarget} onOpenChange={(v) => !v && setDeleteTransactionTarget(null)} onConfirm={handleConfirmDeleteTransaction} loading={deleteTransaction.isPending} message="آیا از حذف این تراکنش اطمینان دارید؟" />
      <ConfirmModal open={!!deleteAccountSideTarget} onOpenChange={(v) => !v && setDeleteAccountSideTarget(null)} onConfirm={handleConfirmDeleteAccountSide} loading={deleteAccountSide.isPending} message="آیا از حذف این طرف حساب اطمینان دارید؟" />
      {detailType && detailId && <AccountingDetailModal open={!!detailId} onClose={() => { setDetailType(null); setDetailId(null); }} type={detailType} id={detailId} />}
    </div>
  );
}
