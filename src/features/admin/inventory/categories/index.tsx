"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import { Search } from "lucide-react";
import api from "@/api/api";
import type { ProductCategory, CategoryFormData } from "./types";
import type { PaginatedResponse } from "../shared/types";
import { LIMIT } from "../shared/types";
import CategoryTable from "./components/CategoryTable";
import CategoryFormDialog from "./components/CategoryFormDialog";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      };
      if (search) params.search = search;

      const res = await api.get<PaginatedResponse<ProductCategory>>(
        "/inventory/categories/",
        { params }
      );
      setCategories(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  async function handleSubmit(
    form: CategoryFormData,
    editingItem: ProductCategory | null
  ) {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      if (form.description) formData.append("description", form.description);
      if (form.img && form.img instanceof File) {
        formData.append("img", form.img);
      }

      if (editingItem) {
        await api.patch(`/inventory/categories/${editingItem.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/inventory/categories/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setOpenForm(false);
      setEditing(null);
      fetchCategories();
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
      await api.delete(`/inventory/categories/${deleteTarget.id}/`);
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(count / LIMIT);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pr-10"
            placeholder="جستجوی عنوان..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setOpenForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> دسته‌بندی جدید
        </Button>
      </div>

      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        onEdit={(c) => {
          setEditing(c);
          setOpenForm(true);
        }}
        onDelete={(c) => setDeleteTarget(c)}
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

      <CategoryFormDialog
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
        title="حذف دسته‌بندی"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
