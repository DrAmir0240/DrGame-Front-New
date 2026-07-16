"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import { Search } from "lucide-react";
import api from "@/api/api";
import type { InventoryMovement, MovementFormData } from "./types";
import type { PaginatedResponse } from "../shared/types";
import { LIMIT } from "../shared/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { directionOptions } from "./types";
import MovementTable from "./components/MovementTable";
import MovementFormDialog from "./components/MovementFormDialog";

export default function MovementsPage() {
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [directionFilter, setDirectionFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<InventoryMovement | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<InventoryMovement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovements = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      };
      if (directionFilter !== "all") params.direction = directionFilter;
      if (search) params.product_title = search;

      const res = await api.get<PaginatedResponse<InventoryMovement>>(
        "/inventory/movements/",
        { params }
      );
      setMovements(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, directionFilter, search]);

  useEffect(() => {
    fetchMovements();
  }, [fetchMovements]);

  useEffect(() => {
    setPage(1);
  }, [directionFilter, search]);

  async function handleSubmit(form: MovementFormData) {
    if (!form.product) return;
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        product: form.product,
        direction: form.direction,
      };
      if (form.product_entity) {
        body.product_entity = form.product_entity;
      }

      if (editing) {
        await api.patch(`/inventory/movements/${editing.id}/`, body);
      } else {
        await api.post("/inventory/movements/", body);
      }
      setOpenForm(false);
      setEditing(null);
      fetchMovements();
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
      await api.delete(`/inventory/movements/${deleteTarget.id}/`);
      setDeleteTarget(null);
      fetchMovements();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(count / LIMIT);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pr-10"
            placeholder="جستجوی عنوان محصول..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={directionFilter} onValueChange={setDirectionFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="جهت" />
          </SelectTrigger>
          <SelectContent>
            {directionOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => setOpenForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> گردش جدید
        </Button>
      </div>

      <MovementTable
        movements={movements}
        isLoading={isLoading}
        onEdit={(m) => {
          setEditing(m);
          setOpenForm(true);
        }}
        onDelete={(m) => setDeleteTarget(m)}
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

      <MovementFormDialog
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
        title="حذف گردش"
        message="آیا از حذف این گردش اطمینان دارید؟"
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
