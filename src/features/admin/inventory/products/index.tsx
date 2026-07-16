"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { ConfirmModal } from "@/components/shared";
import api from "@/api/api";
import type { Product, ProductChoices, ProductStats } from "./types";
import type { PaginatedResponse } from "../shared/types";
import { LIMIT } from "../shared/types";
import ProductStatsCards from "./components/ProductStatsCards";
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import ProductFormDialog from "./components/ProductFormDialog";
import ProductDetailPage from "./components/ProductDetailPage";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [supplierFilter, setSupplierFilter] = useState("all");
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [choices, setChoices] = useState<ProductChoices | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [viewing, setViewing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await api.get<ProductStats>("/inventory/products/stats/");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchChoices = useCallback(async () => {
    try {
      const res = await api.get<ProductChoices>(
        "/inventory/products/choices/"
      );
      setChoices(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
      };
      if (search) params.search = search;
      if (categoryFilter !== "all") params.category = categoryFilter;
      if (supplierFilter !== "all") params.supplier = supplierFilter;

      const res = await api.get<PaginatedResponse<Product>>(
        "/inventory/products/",
        { params }
      );
      setProducts(res.data.results);
      setCount(res.data.count);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, categoryFilter, supplierFilter]);

  useEffect(() => {
    fetchStats();
    fetchChoices();
  }, [fetchStats, fetchChoices]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, supplierFilter]);

  async function handleFormSubmit(formData: FormData) {
    setLoading(true);
    try {
      if (editing) {
        await api.patch(`/inventory/products/${editing.id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/inventory/products/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setOpenForm(false);
      setEditing(null);
      fetchProducts();
      fetchStats();
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
      await api.delete(`/inventory/products/${deleteTarget.id}/`);
      setDeleteTarget(null);
      fetchProducts();
      fetchStats();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(count / LIMIT);

  if (viewing) {
    return (
      <ProductDetailPage
        product={viewing}
        choices={choices}
        onBack={() => setViewing(null)}
        onRefresh={() => {
          fetchProducts();
          fetchStats();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ProductStatsCards stats={stats} isLoading={isLoadingStats} />

      <div className="flex justify-end">
        <Button onClick={() => setOpenForm(true)} className="gap-2">
          <Plus className="w-4 h-4" /> کالای جدید
        </Button>
      </div>

      <ProductFilters
        search={search}
        category={categoryFilter}
        supplier={supplierFilter}
        choices={choices}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryFilter}
        onSupplierChange={setSupplierFilter}
      />

      <ProductTable
        products={products}
        isLoading={isLoading}
        choices={choices}
        onEdit={(p) => {
          setEditing(p);
          setOpenForm(true);
        }}
        onDelete={(p) => setDeleteTarget(p)}
        onView={(p) => setViewing(p)}
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

      <ProductFormDialog
        open={openForm}
        editing={editing}
        choices={choices}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSubmit={handleFormSubmit}
        loading={loading}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف کالا"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}
