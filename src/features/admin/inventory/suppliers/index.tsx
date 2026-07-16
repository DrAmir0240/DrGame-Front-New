"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import api from "@/api/api";
import type { Supplier, SupplierFormData } from "./types";
import type { PaginatedResponse } from "../shared/types";
import { LIMIT } from "../shared/types";
import SupplierFilters from "./components/SupplierFilters";
import SupplierTable from "./components/SupplierTable";
import SupplierFormDialog from "./components/SupplierFormDialog";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      };
      if (search) params.search = search;
      if (typeFilter !== "all") params.type = typeFilter;

      const res = await api.get<PaginatedResponse<Supplier>>(
        "/inventory/suppliers/",
        { params }
      );
      setSuppliers(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  async function handleSubmit(
    form: SupplierFormData,
    editingItem: Supplier | null
  ) {
    setLoading(true);
    try {
      if (editingItem) {
        await api.patch(`/inventory/suppliers/${editingItem.id}/`, form);
      } else {
        await api.post("/inventory/suppliers/", form);
      }
      setOpenForm(false);
      setEditing(null);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await api.delete(`/inventory/suppliers/${deleteTarget.id}/`);
      setDeleteTarget(null);
      fetchSuppliers();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(count / LIMIT);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setOpenForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> تامین‌کننده جدید
        </Button>
      </div>

      <SupplierFilters
        search={search}
        type={typeFilter}
        onSearchChange={setSearch}
        onTypeChange={setTypeFilter}
      />

      <SupplierTable
        suppliers={suppliers}
        isLoading={isLoading}
        onEdit={(s) => {
          setEditing(s);
          setOpenForm(true);
        }}
        onDelete={(s) => setDeleteTarget(s)}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {count} مورد — صفحه {page} از {totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              قبلی
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              بعدی
            </Button>
          </div>
        </div>
      )}

      <SupplierFormDialog
        open={openForm}
        editing={editing}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف تامین‌کننده"
        message={`آیا از حذف «${deleteTarget?.name}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
