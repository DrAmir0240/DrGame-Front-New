"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, type UseFormRegister, type Control } from "react-hook-form";
import { Plus, Trash2, Eye, PackageCheck, CheckCheck, Search } from "lucide-react";
import { Button, Dialog, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from "@/components/ui";
import { PageHeader, DataTable, ConfirmModal, type DataTableColumn } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import api from "@/api/api";
import { formatPrice } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import type { PaginatedResponse } from "../shared/types";
import type { Supplier } from "../suppliers/types";
import type { Product } from "../products/types";
import {
  usePurchaseOrders,
  usePurchaseOrderDetail,
  useCreatePurchaseOrder,
  useUpdatePurchaseOrder,
  useDeletePurchaseOrder,
  useReceivePurchaseOrder,
} from "./apis";
import type { PurchaseOrder, CreatePurchaseOrderFormData } from "./types";

export const PO_STATUS_LABELS: Record<string, string> = {
  draft: "پیش‌نویس",
  confirmed: "تأیید شده",
  received: "دریافت شده",
  cancelled: "لغو شده",
};

export default function PurchaseOrdersPage() {
  const { data: orders = [], isLoading } = usePurchaseOrders();
  const createOrder = useCreatePurchaseOrder();
  const updateOrder = useUpdatePurchaseOrder();
  const deleteOrder = useDeletePurchaseOrder();
  const receiveOrder = useReceivePurchaseOrder();

  const [openCreate, setOpenCreate] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PurchaseOrder | null>(null);

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["inventory", "suppliers", "all"],
    queryFn: async () => {
      const { data } = await api.get<Supplier[] | { results: Supplier[] }>(
        "/inventory/suppliers/"
      );
      return Array.isArray(data) ? data : data.results ?? [];
    },
  });

  const columns: DataTableColumn<PurchaseOrder>[] = [
    { header: "شماره", render: (r) => <span className="font-medium">#{r.id}</span> },
    { header: "تأمین‌کننده", render: (r) => r.supplier_name || "—" },
    { header: "مبلغ کل", render: (r) => formatPrice(r.total_amount) },
    { header: "وضعیت", render: (r) => <StatusBadge status={r.status} /> },
    { header: "تاریخ", render: (r) => new Date(r.created_at).toLocaleDateString("fa-IR") },
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
            className="h-7 w-7 text-blue-600"
            title="تأیید"
            disabled={r.status !== "draft"}
            onClick={() => updateOrder.mutateAsync({ id: r.id, payload: { status: "confirmed" } })}
          >
            <CheckCheck className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-emerald-600"
            title="دریافت کالا"
            disabled={r.status !== "confirmed"}
            onClick={() => receiveOrder.mutateAsync(r.id)}
          >
            <PackageCheck className="w-3.5 h-3.5" />
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
      <PageHeader
        title="سفارش‌های خرید"
        description="ساخت، تأیید و دریافت سفارش‌های خرید (بر اساس راهنمای API)"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          فلو: ساخت → تأیید (confirmed) → دریافت کالا (افزایش موجودی)
        </p>
        <Button onClick={() => setOpenCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" /> سفارش خرید جدید
        </Button>
      </div>

      <DataTable columns={columns} data={orders} isLoading={isLoading} emptyMessage="سفارش خریدی ثبت نشده" />

      <CreatePurchaseOrderDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        suppliers={suppliers}
        onSubmit={(data) => createOrder.mutateAsync(data).then(() => setOpenCreate(false))}
        loading={createOrder.isPending}
      />

      {detailId && (
        <PurchaseOrderDetailModal
          id={detailId}
          onClose={() => setDetailId(null)}
          onConfirm={() => updateOrder.mutateAsync({ id: detailId, payload: { status: "confirmed" } })}
          onReceive={() => receiveOrder.mutateAsync(detailId)}
          confirmLoading={updateOrder.isPending}
          receiveLoading={receiveOrder.isPending}
        />
      )}

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف سفارش خرید"
        message={`آیا از حذف سفارش #${deleteTarget?.id} اطمینان دارید؟`}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deleteOrder.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        loading={deleteOrder.isPending}
      />
    </div>
  );
}

// ─── Create Dialog ───

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onSubmit: (data: CreatePurchaseOrderFormData) => void;
  loading?: boolean;
}

function CreatePurchaseOrderDialog({ open, onClose, suppliers, onSubmit, loading }: CreateDialogProps) {
  const { register, handleSubmit, control, reset } = useForm<CreatePurchaseOrderFormData>({
    defaultValues: {
      supplier: 0,
      description: "",
      items: [{ product: 0, quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    if (open) {
      reset({ supplier: 0, description: "", items: [{ product: 0, quantity: 1, unit_price: 0 }] });
    }
  }, [open, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => !v && onClose()}
      title="سفارش خرید جدید"
      className="max-w-2xl"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>انصراف</Button>
          <Button type="submit" form="po-form" disabled={loading}>
            {loading ? "در حال ایجاد..." : "ایجاد سفارش"}
          </Button>
        </>
      }
    >
      <form id="po-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>تأمین‌کننده <span className="text-red-500">*</span></Label>
            <Controller
              name="supplier"
              control={control}
              rules={{ required: "الزامی است", validate: (v) => v > 0 || "الزامی است" }}
              render={({ field }) => (
                <Select value={field.value ? String(field.value) : ""} onValueChange={(v) => field.onChange(Number(v))}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب تأمین‌کننده" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Input label="توضیحات" {...register("description")} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>اقلام</Label>
            <Button type="button" variant="outline" size="sm" onClick={() => append({ product: 0, quantity: 1, unit_price: 0 })}>
              <Plus className="w-4 h-4 ml-1" /> افزودن کالا
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-[1fr_90px_120px_36px] gap-2 items-end">
              <ProductPicker register={register} index={index} control={control} />
              <Input label="تعداد" type="number" {...register(`items.${index}.quantity` as const, { valueAsNumber: true })} />
              <Input label="قیمت واحد" type="number" {...register(`items.${index}.unit_price` as const, { valueAsNumber: true })} />
              <Button type="button" variant="ghost" size="icon" className="text-red-500 mb-0.5" onClick={() => remove(index)} disabled={fields.length === 1}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </form>
    </Dialog>
  );
}

function ProductPicker({
  register,
  index,
  control,
}: {
  register: UseFormRegister<CreatePurchaseOrderFormData>;
  index: number;
  control: Control<CreatePurchaseOrderFormData>;
}) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [picked, setPicked] = useState<Product | null>(null);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search || search.length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await api.get<PaginatedResponse<Product>>("/inventory/products/search/", {
          params: { search },
        });
        setResults(res.data.results || (res.data as unknown as Product[]));
      } catch {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  return (
    <div className="space-y-1">
      <Label>کالا</Label>
      <Controller
        control={control}
        name={`items.${index}.product` as const}
        render={({ field }) => (
          <>
            {picked ? (
              <div className="flex items-center gap-2 border border-neutral-200 rounded-md h-9 px-3">
                <span className="text-sm flex-1">{picked.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    field.onChange(0);
                    setPicked(null);
                    setSearch("");
                  }}
                >
                  تغییر
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pr-9"
                  placeholder="جستجوی کالا..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {results.length > 0 && (
                  <div className="absolute z-10 top-full mt-1 w-full bg-background border border-neutral-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {results.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="w-full text-right px-3 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => {
                          field.onChange(p.id);
                          setPicked(p);
                          setSearch("");
                          setResults([]);
                        }}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      />
      <input type="hidden" {...register(`items.${index}.product` as const, { valueAsNumber: true })} />
    </div>
  );
}

// ─── Detail Modal ───

interface DetailModalProps {
  id: number;
  onClose: () => void;
  onConfirm: () => void;
  onReceive: () => void;
  confirmLoading?: boolean;
  receiveLoading?: boolean;
}

function PurchaseOrderDetailModal({ id, onClose, onConfirm, onReceive, confirmLoading, receiveLoading }: DetailModalProps) {
  const { data: order } = usePurchaseOrderDetail(id);

  return (
    <Dialog
      open
      onOpenChange={(v) => !v && onClose()}
      title={`سفارش خرید #${id}`}
      className="max-w-xl"
      footer={
        <div className="flex gap-2 w-full pt-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">بستن</Button>
          {order?.status === "draft" && (
            <Button type="button" onClick={onConfirm} disabled={confirmLoading} className="flex-1">
              {confirmLoading ? "..." : "تأیید سفارش"}
            </Button>
          )}
          {order?.status === "confirmed" && (
            <Button type="button" onClick={onReceive} disabled={receiveLoading} className="flex-1 gap-2">
              <PackageCheck className="w-4 h-4" /> {receiveLoading ? "..." : "دریافت کالا"}
            </Button>
          )}
        </div>
      }
    >
      {!order ? (
        <p className="text-sm text-neutral-400">در حال بارگذاری...</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>تأمین‌کننده: <b>{order.supplier_name}</b></div>
            <div>وضعیت: <StatusBadge status={order.status} /></div>
            <div>مبلغ کل: <b>{formatPrice(order.total_amount)}</b></div>
            <div>تاریخ: <b>{new Date(order.created_at).toLocaleDateString("fa-IR")}</b></div>
          </div>
          {order.description && <p className="text-sm text-neutral-600">{order.description}</p>}
          <div className="space-y-2">
            <p className="text-sm font-medium">اقلام</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border border-neutral-200 rounded-lg p-3 text-sm">
                <div>
                  <p className="font-medium">{item.product_title}</p>
                  <p className="text-xs text-neutral-500">تعداد {item.quantity}</p>
                </div>
                <p className="text-left">
                  {formatPrice(item.unit_price)}
                  <br />
                  <span className="text-xs text-neutral-500">جمع {formatPrice(item.total_price)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Dialog>
  );
}
