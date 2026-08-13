"use client";

import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { Button } from "@/components/ui";
import { DataTable, type DataTableColumn } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import { useInvoicesList, useTransactionsList, useInvoiceDetail } from "../apis";
import { formatPrice } from "@/utils/format";
import type { EmployeeInvoice, EmployeeTransaction } from "../types";
import InvoiceFormDialog from "./InvoiceFormDialog";
import TransactionFormDialog from "./TransactionFormDialog";

export default function InvoicesLedger() {
  const [openInvoice, setOpenInvoice] = useState(false);
  const [openTransaction, setOpenTransaction] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);

  const { data: invoices = [], isLoading: loadingInvoices } = useInvoicesList();
  const { data: transactions = [], isLoading: loadingTransactions } = useTransactionsList();
  const { data: detailInvoice, isLoading: loadingDetail } = useInvoiceDetail(detailId);

  const invoiceColumns: DataTableColumn<EmployeeInvoice>[] = [
    { header: "شماره", render: (r) => <span className="font-medium">#{r.id}</span> },
    { header: "طرف حساب", render: (r) => r.account_side_name || "—" },
    { header: "دسته", render: (r) => r.category_title || "—" },
    { header: "مبلغ", render: (r) => formatPrice(r.amount) },
    { header: "مانده", render: (r) => (
      <span className={r.remaining_amount > 0 ? "text-red-600 font-medium" : "text-emerald-600"}>
        {formatPrice(r.remaining_amount)}
      </span>
    )},
    { header: "وضعیت", render: (r) => <StatusBadge status={r.status} /> },
    { header: "پرداخت", render: (r) => <StatusBadge status={r.payment_status} /> },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailId(r.id)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  const transactionColumns: DataTableColumn<EmployeeTransaction>[] = [
    { header: "شماره", render: (r) => <span className="font-medium">#{r.id}</span> },
    { header: "طرف حساب", render: (r) => r.account_side_name || "—" },
    { header: "مبلغ", render: (r) => (
      <span className={r.direction === "in" ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
        {r.direction === "in" ? "+" : "-"}{formatPrice(r.amount)}
      </span>
    )},
    { header: "جهت", render: (r) => <StatusBadge status={r.direction} /> },
    { header: "توضیحات", render: (r) => <span className="max-w-[200px] truncate block">{r.description || "—"}</span> },
    { header: "تاریخ", render: (r) => new Date(r.created_at).toLocaleDateString("fa-IR") },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500">
          فاکتورهای یکپارچه و تراکنش‌های مرتبط (بر اساس راهنمای API)
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setOpenTransaction(true)} className="gap-2">
            <Plus className="w-4 h-4" /> ثبت وصول
          </Button>
          <Button onClick={() => setOpenInvoice(true)} className="gap-2">
            <Plus className="w-4 h-4" /> فاکتور جدید
          </Button>
        </div>
      </div>

      <Tabs dir="rtl" defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">فاکتورها</TabsTrigger>
          <TabsTrigger value="transactions">تراکنش‌ها</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <DataTable columns={invoiceColumns} data={invoices} isLoading={loadingInvoices} emptyMessage="فاکتوری ثبت نشده" />
        </TabsContent>

        <TabsContent value="transactions">
          <DataTable columns={transactionColumns} data={transactions} isLoading={loadingTransactions} emptyMessage="تراکنشی ثبت نشده" />
        </TabsContent>
      </Tabs>

      <InvoiceFormDialog open={openInvoice} onClose={() => setOpenInvoice(false)} />
      <TransactionFormDialog open={openTransaction} onClose={() => setOpenTransaction(false)} />

      {detailId !== null && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setDetailId(null)}>
          <div className="bg-white rounded-xl w-full max-w-xl max-h-[80vh] overflow-y-auto p-5 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">فاکتور #{detailId}</h3>
              <Button variant="ghost" size="sm" onClick={() => setDetailId(null)}>بستن</Button>
            </div>

            {loadingDetail && (
              <div className="space-y-2">
                <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                <div className="h-32 bg-neutral-100 rounded animate-pulse" />
              </div>
            )}

            {!loadingDetail && detailInvoice && (
              <>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>طرف حساب: <b>{detailInvoice.account_side_name || "—"}</b></div>
                  <div>دسته: <b>{detailInvoice.category_title || "—"}</b></div>
                  <div>مبلغ: <b>{formatPrice(detailInvoice.amount)}</b></div>
                  <div>تخفیف: <b>{formatPrice(detailInvoice.discount)}</b></div>
                  <div>پرداختی: <b>{formatPrice(detailInvoice.paid_amount)}</b></div>
                  <div>مانده: <b>{formatPrice(detailInvoice.remaining_amount)}</b></div>
                </div>
                {detailInvoice.description && <p className="text-sm text-neutral-600">{detailInvoice.description}</p>}
                <div className="space-y-2">
                  {(detailInvoice.items ?? []).map((item) => (
                    <div key={item.id} className="border border-neutral-200 rounded-lg p-3 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-neutral-500">
                          {item.order_type} · تعداد {item.quantity}
                        </p>
                      </div>
                      <div className="text-left">
                        <p>{formatPrice(item.unit_price)}</p>
                        <p className="text-xs text-neutral-500">جمع {formatPrice(item.total_price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
