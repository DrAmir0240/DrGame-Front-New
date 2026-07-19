"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  ArrowRight,
  Building2,
} from "lucide-react";
import { Badge, Button, Skeleton } from "@/components/ui";
import { DataTable, DataTableColumn, ConfirmModal } from "@/components/shared";
import { getCustomerType, DIRECTION_MAP } from "../constants";
import { formatPrice, formatNumber } from "@/utils/format";
import {
  useCustomerDetail,
  useCustomerSummary,
  useCustomerTransactions,
  useCustomerInvoices,
  useDeleteCustomer,
  useB2BProfile,
  useDeleteB2BProfile,
} from "../apis";
import type { Customer, CustomerTransaction, CustomerInvoice } from "../types";
import CustomerFormDialog from "./CustomerFormDialog";
import B2BFormDialog from "./B2BFormDialog";

interface Props {
  customer: Customer;
  onBack: () => void;
  onRefresh: () => void;
}

export default function CustomerDetailPanel({ customer, onBack, onRefresh }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(false);
  const [b2bEditOpen, setB2bEditOpen] = useState(false);
  const [b2bCreateOpen, setB2bCreateOpen] = useState(false);
  const [b2bDeleteTarget, setB2bDeleteTarget] = useState(false);

  const { data: detail, isLoading: loadingDetail } = useCustomerDetail(customer.id);
  const { data: summary, isLoading: loadingSummary } = useCustomerSummary(customer.id);
  const { data: transactions = [], isLoading: loadingTx } = useCustomerTransactions(customer.id);
  const { data: invoices = [], isLoading: loadingInv } = useCustomerInvoices(customer.id);
  const { data: b2bProfile, isLoading: loadingB2b } = useB2BProfile(customer.id);

  const deleteCustomer = useDeleteCustomer();
  const deleteB2b = useDeleteB2BProfile();

  const current = detail ?? customer;
  const hasB2b = b2bProfile && !("detail" in (b2bProfile as any));

  function handleDeleteCustomer() {
    deleteCustomer.mutate(customer.id, {
      onSuccess: () => {
        setDeleteTarget(false);
        onRefresh();
        onBack();
      },
    });
  }

  function handleDeleteB2b() {
    deleteB2b.mutate(customer.id, {
      onSuccess: () => {
        setB2bDeleteTarget(false);
        onRefresh();
      },
    });
  }

  const txColumns: DataTableColumn<CustomerTransaction>[] = [
    {
      header: "مبلغ",
      render: (r) => (
        <span className="font-semibold text-sm">{formatPrice(r.amount)}</span>
      ),
    },
    {
      header: "جهت",
      render: (r) => {
        const info = DIRECTION_MAP[r.direction] ?? DIRECTION_MAP.in;
        return (
          <Badge variant="outline" className={`text-xs border ${info.className}`}>
            {r.direction_display}
          </Badge>
        );
      },
    },
    {
      header: "حساب بانکی",
      render: (r) => <span className="text-sm">{r.bank_account_name}</span>,
    },
    {
      header: "تاریخ",
      render: (r) => (
        <span className="text-xs text-muted-foreground">
          {new Date(r.created_at).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
  ];

  const invColumns: DataTableColumn<CustomerInvoice>[] = [
    {
      header: "مجموع آیتم‌ها",
      render: (r) => (
        <span className="font-semibold text-sm">{formatPrice(r.total_items_price)}</span>
      ),
    },
    {
      header: "پرداخت شده",
      render: (r) => <span className="text-sm">{formatPrice(r.paid_amount)}</span>,
    },
    {
      header: "تاریخ ایجاد",
      render: (r) => (
        <span className="text-xs text-muted-foreground">
          {new Date(r.created_at).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <h2 className="text-lg font-semibold">جزئیات مشتری</h2>
      </div>

      {loadingDetail ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {current.profile_pic ? (
                  <img
                    src={current.profile_pic}
                    alt={current.full_name}
                    className="w-14 h-14 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                    {current.full_name?.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-base">{current.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{current.phone}</p>
                  <Badge
                    variant="outline"
                    className={`text-[10px] border mt-1 ${getCustomerType(current.has_b2b).className}`}
                  >
                    {getCustomerType(current.has_b2b).label}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditOpen(true)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => setDeleteTarget(true)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {(current.address || current.postal_code) && (
              <div className="text-sm text-muted-foreground space-y-1 border-t border-neutral-100 pt-3">
                {current.address && <p>آدرس: {current.address}</p>}
                {current.postal_code && <p>کد پستی: {current.postal_code}</p>}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                پروفایل تجاری
              </h4>
              {hasB2b ? (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setB2bEditOpen(true)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => setB2bDeleteTarget(true)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs h-7"
                  onClick={() => setB2bCreateOpen(true)}
                >
                  <Plus className="w-3 h-3" />
                  ایجاد پروفایل تجاری
                </Button>
              )}
            </div>

            {loadingB2b ? (
              <Skeleton className="h-16 w-full" />
            ) : hasB2b ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground text-xs">عنوان تجاری</span>
                  <p className="font-medium">{(b2bProfile as any).business_title}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">کد یکتا</span>
                  <p className="font-medium">{(b2bProfile as any).uni_id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">سقف بدهی</span>
                  <p className="font-medium">{formatPrice((b2bProfile as any).debt_amount_max)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs">تخفیف</span>
                  <p className="font-medium">{(b2bProfile as any).discount}%</p>
                </div>
                {(b2bProfile as any).description && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground text-xs">توضیحات</span>
                    <p className="font-medium">{(b2bProfile as any).description}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                پروفایل تجاری ندارد
              </p>
            )}
          </div>
        </>
      )}

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h4 className="font-semibold text-sm mb-3">خلاصه وضعیت</h4>
        {loadingSummary ? (
          <Skeleton className="h-20 w-full" />
        ) : summary ? (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "مجموع سفارشات", value: formatNumber(summary.total_orders_count) },
              { label: "سفارش محصول", value: formatNumber(summary.product_orders_count) },
              { label: "سفارش تعمیر", value: formatNumber(summary.repair_orders_count) },
              { label: "اکانت سونی", value: formatNumber(summary.sony_account_orders_count) },
              { label: "مجموع تراکنش‌ها", value: formatPrice(summary.total_transactions_amount) },
              { label: "مجموع فاکتورها", value: formatPrice(summary.total_invoices_amount) },
            ].map((item, i) => (
              <div key={i} className="text-center p-2 rounded-lg bg-neutral-50">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-bold text-sm mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h4 className="font-semibold text-sm mb-3">تراکنش‌ها</h4>
        <DataTable<CustomerTransaction>
          columns={txColumns}
          data={transactions}
          isLoading={loadingTx}
          emptyMessage="تراکنشی ثبت نشده"
        />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h4 className="font-semibold text-sm mb-3">فاکتورها</h4>
        <DataTable<CustomerInvoice>
          columns={invColumns}
          data={invoices}
          isLoading={loadingInv}
          emptyMessage="فاکتوری ثبت نشده"
        />
      </div>

      <CustomerFormDialog
        open={editOpen}
        editing={current}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          setEditOpen(false);
          onRefresh();
        }}
      />

      <B2BFormDialog
        open={b2bCreateOpen}
        customerId={customer.id}
        onClose={() => setB2bCreateOpen(false)}
        onSaved={() => {
          setB2bCreateOpen(false);
          onRefresh();
        }}
      />

      <B2BFormDialog
        open={b2bEditOpen}
        customerId={customer.id}
        editing={hasB2b ? (b2bProfile as any) : null}
        onClose={() => setB2bEditOpen(false)}
        onSaved={() => {
          setB2bEditOpen(false);
          onRefresh();
        }}
      />

      <ConfirmModal
        open={deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(false)}
        title="حذف مشتری"
        message={`آیا از حذف «${current.full_name}» اطمینان دارید؟`}
        onConfirm={handleDeleteCustomer}
        loading={deleteCustomer.isPending}
      />

      <ConfirmModal
        open={b2bDeleteTarget}
        onOpenChange={(v) => !v && setB2bDeleteTarget(false)}
        title="حذف پروفایل تجاری"
        message="آیا از حذف پروفایل تجاری اطمینان دارید؟"
        onConfirm={handleDeleteB2b}
        loading={deleteB2b.isPending}
      />
    </div>
  );
}
