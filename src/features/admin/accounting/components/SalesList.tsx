"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui";
import { DataTable, ConfirmModal, type DataTableColumn } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import { useSalesList, useDeleteSales } from "../apis";
import { formatPrice } from "@/utils/format";
import type { Sales, SalesFilters } from "../types";
import SalesFormDialog from "./SalesFormDialog";
import AccountingDetailModal from "./AccountingDetailModal";

export default function SalesList() {
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<Sales | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Sales | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [filters, setFilters] = useState<SalesFilters>({});

  const { data: response, isLoading } = useSalesList(filters);
  const sales = response?.results || [];
  const deleteSales = useDeleteSales();

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try { await deleteSales.mutateAsync(deleteTarget.id); } catch {}
    setDeleteTarget(null);
  }

  const columns: DataTableColumn<Sales>[] = [
    { header: "طرف حساب", render: (r) => <span className="font-medium">{r.account_side?.name || "—"}</span> },
    { header: "دسته‌بندی", render: (r) => r.category?.title || "—" },
    { header: "مبلغ", render: (r) => formatPrice(r.amount) },
    { header: "پرداختی", render: (r) => formatPrice(r.paid_amount) },
    { header: "مانده", render: (r) => <span className={r.remaining_amount > 0 ? "text-red-600 font-medium" : "text-emerald-600"}>{formatPrice(r.remaining_amount)}</span> },
    { header: "وضعیت", render: (r) => <StatusBadge status={r.status} /> },
    { header: "پرداخت", render: (r) => <StatusBadge status={r.payment_status} /> },
    { header: "توضیحات", render: (r) => <span className="max-w-[150px] truncate block">{r.description || "—"}</span> },
    {
      header: "عملیات",
      render: (r) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailId(r.id)}>
            <Eye className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditItem(r); setOpen(true); }}>
            <Edit className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => setDeleteTarget(r)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <input type="date" value={filters.start_date || ""} onChange={(e) => setFilters((p) => ({ ...p, start_date: e.target.value || undefined }))} className="flex h-9 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm" />
        <input type="date" value={filters.end_date || ""} onChange={(e) => setFilters((p) => ({ ...p, end_date: e.target.value || undefined }))} className="flex h-9 rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm" />
        <Button onClick={() => { setEditItem(null); setOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> فاکتور فروش جدید
        </Button>
      </div>

      <DataTable columns={columns} data={sales} isLoading={isLoading} emptyMessage="فاکتور فروشی ثبت نشده" />

      <SalesFormDialog open={open} onClose={() => { setOpen(false); setEditItem(null); }} editItem={editItem} />
      {detailId && <AccountingDetailModal open={!!detailId} onClose={() => setDetailId(null)} type="sales" id={detailId} />}

      <ConfirmModal open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)} onConfirm={handleConfirmDelete} loading={deleteSales.isPending} message="آیا از حذف این فاکتور فروش اطمینان دارید؟" />
    </div>
  );
}
