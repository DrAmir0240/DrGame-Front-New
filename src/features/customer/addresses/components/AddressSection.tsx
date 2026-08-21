"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { Badge, Button, Skeleton } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import { Pagination } from "@/components/shared";
import {
  useAddressList,
  useSetDefaultAddress,
  useDeleteAddress,
  ADDRESS_LIMIT,
} from "../apis";
import type { Address } from "../types";
import AddressFormDialog from "./AddressFormDialog";

interface Props {
  customerId?: number | null;
}

export default function AddressSection({ customerId }: Props) {
  const [page, setPage] = useState(0);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

  const { data, isLoading } = useAddressList({ customerId, page });
  const setDefault = useSetDefaultAddress(customerId);
  const deleteAddress = useDeleteAddress(customerId);

  const addresses = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / ADDRESS_LIMIT) : 0;

  if (!customerId && customerId !== undefined) return null;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(address: Address) {
    setEditing(address);
    setFormOpen(true);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    deleteAddress.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
        if (addresses.length === 1 && page > 0) setPage(page - 1);
      },
      onError: () => setDeleteTarget(null),
    });
  }

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          آدرس‌ها
        </h4>
        <Button variant="outline" size="sm" className="gap-1 text-xs h-7" onClick={openCreate}>
          <Plus className="w-3 h-3" />
          افزودن آدرس
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          هنوز آدرسی ثبت نشده است
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-lg border border-neutral-100 dark:border-neutral-800 p-3 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm">{address.title}</span>
                  {address.is_default && (
                    <Badge className="text-[10px] bg-primary-500/10 text-primary-600 border border-primary-500/20">
                      پیش‌فرض
                    </Badge>
                  )}
                </div>
                <div className="flex gap-0.5 shrink-0">
                  {!address.is_default && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="تنظیم به عنوان پیش‌فرض"
                      className="h-7 w-7"
                      disabled={setDefault.isPending}
                      onClick={() => setDefault.mutate(address.id)}
                    >
                      <Star className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => openEdit(address)}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    onClick={() => setDeleteTarget(address)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  گیرنده: <span className="text-foreground">{address.receiver_name}</span>
                  {" · "}
                  <span dir="ltr" className="inline-block">
                    {address.receiver_phone}
                  </span>
                </p>
                <p>
                  {address.province}، {address.city} — {address.address}
                </p>
                <p>
                  کد پستی:{" "}
                  <span dir="ltr" className="inline-block">
                    {address.postal_code}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        count={data?.count ?? 0}
        limit={ADDRESS_LIMIT}
        onPageChange={setPage}
        className="mt-3"
      />

      <AddressFormDialog
        key={editing?.id ?? "new"}
        open={formOpen}
        editing={editing}
        customerId={customerId}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف آدرس"
        message={`آیا از حذف «${deleteTarget?.title ?? ""}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={deleteAddress.isPending}
      />
    </div>
  );
}
