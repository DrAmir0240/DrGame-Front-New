"use client";

import { useState } from "react";
import { Image, Pencil, Plus, Trash2, User } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { DataTable, Pagination, ConfirmModal, type DataTableColumn } from "@/components/shared";
import {
  useRealAssetCategories,
  useRealAssetSubCategories,
  useRealAssetList,
  useCreateRealAssetCategory,
  useCreateRealAssetSubCategory,
  useCreateRealAsset,
  useUpdateRealAsset,
  useDeleteRealAsset,
  useEmployeeList,
} from "../apis";
import { LIMIT } from "../constants";
import type { RealAssets } from "../types";
import CategoryTree from "./CategoryTree";
import CategoryFormDialog from "./CategoryFormDialog";
import SubCategoryFormDialog from "./SubCategoryFormDialog";
import RealAssetFormDialog from "./RealAssetFormDialog";

export default function RealAssetsSection() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false);
  const [subCategoryParentId, setSubCategoryParentId] = useState<number | null>(null);
  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [deleteAssetId, setDeleteAssetId] = useState<number | null>(null);

  const { data: categories = [], isLoading: catsLoading } = useRealAssetCategories();
  const { data: subCategories = [], isLoading: subCatsLoading } = useRealAssetSubCategories(selectedCategoryId);
  const { data: assetData, isLoading: assetsLoading } = useRealAssetList({
    search: search || undefined,
    category: selectedCategoryId || undefined,
    sub_category: selectedSubCategoryId || undefined,
    limit: LIMIT,
    offset: page * LIMIT,
  });
  const { data: employees = [] } = useEmployeeList();

  const createCategory = useCreateRealAssetCategory();
  const createSubCategory = useCreateRealAssetSubCategory();
  const createAsset = useCreateRealAsset();
  const updateAsset = useUpdateRealAsset();
  const deleteAsset = useDeleteRealAsset();

  const assets = assetData?.results ?? [];
  const totalCount = assetData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  function formatPrice(price: number | null) {
    if (!price) return "-";
    return new Intl.NumberFormat("fa-IR").format(price) + " ریال";
  }

  const columns: DataTableColumn<RealAssets>[] = [
    { header: "#", render: (row, i) => <span className="text-neutral-400 text-xs">{(page * LIMIT) + (i ?? 0) + 1}</span> },
    {
      header: "تصویر",
      render: (row) =>
        row.image ? (
          <img src={row.image} alt={row.title} className="w-10 h-10 rounded-lg object-cover border" />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
            <Image className="w-4 h-4 text-neutral-400" />
          </div>
        ),
    },
    { header: "عنوان", accessor: "title" },
    { header: "قیمت", render: (row) => <span className="text-xs">{formatPrice(row.price)}</span> },
    { header: "دسته‌بندی", render: (row) => row.main_category_title ?? "-" },
    { header: "زیردسته", render: (row) => row.sub_category_title ?? "-" },
    {
      header: "کارمند",
      render: (row) => (
        <span className="text-xs flex items-center gap-1">
          <User className="w-3 h-3" />
          {row.employee_name ?? "-"}
        </span>
      ),
    },
    { header: "تاریخ ایجاد", render: (row) => new Date(row.created_at).toLocaleDateString("fa-IR") },
    {
      header: "عملیات",
      render: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              setEditingAsset(row);
              setAssetDialogOpen(true);
            }}
          >
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-red-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteAssetId(row.id);
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4 min-h-[600px]">
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <CategoryTree
          categories={categories}
          subCategories={subCategories}
          selectedCategoryId={selectedCategoryId}
          selectedSubCategoryId={selectedSubCategoryId}
          onSelectCategory={(id) => {
            setSelectedCategoryId(id);
            setSelectedSubCategoryId(null);
            setPage(0);
          }}
          onSelectSubCategory={(id) => {
            setSelectedSubCategoryId(id);
            setPage(0);
          }}
          onAddCategory={() => setCategoryDialogOpen(true)}
          onAddSubCategory={(catId) => {
            setSubCategoryParentId(catId);
            setSubCategoryDialogOpen(true);
          }}
          isLoading={catsLoading || subCatsLoading}
        />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="جستجوی دارایی..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <Button onClick={() => { setEditingAsset(null); setAssetDialogOpen(true); }}>
            <Plus className="w-4 h-4 ml-1" />
            دارایی جدید
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={assets}
          isLoading={assetsLoading}
          emptyMessage="دارایی یافت نشد"
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          count={totalCount}
          limit={LIMIT}
          onPageChange={setPage}
        />
      </div>

      <CategoryFormDialog
        open={categoryDialogOpen}
        title="دسته‌بندی جدید"
        onClose={() => setCategoryDialogOpen(false)}
        onSubmit={async (data) => { await createCategory.mutateAsync(data); }}
      />

      <SubCategoryFormDialog
        open={subCategoryDialogOpen}
        title="زیردسته‌بندی جدید"
        categories={categories}
        parentCategoryId={subCategoryParentId}
        onClose={() => { setSubCategoryDialogOpen(false); setSubCategoryParentId(null); }}
        onSubmit={async (data) => { await createSubCategory.mutateAsync(data); }}
      />

      <RealAssetFormDialog
        open={assetDialogOpen}
        editing={editingAsset}
        categories={categories}
        subCategories={subCategories}
        employees={employees}
        onClose={() => { setAssetDialogOpen(false); setEditingAsset(null); }}
        onSaved={() => { setAssetDialogOpen(false); setEditingAsset(null); }}
        onSubmit={async (formData) => {
          if (editingAsset) return updateAsset.mutateAsync({ id: editingAsset.id, formData });
          return createAsset.mutateAsync(formData);
        }}
      />

      <ConfirmModal
        open={deleteAssetId !== null}
        onOpenChange={(v) => { if (!v) setDeleteAssetId(null); }}
        title="حذف دارایی"
        message="آیا از حذف این دارایی اطمینان دارید؟"
        onConfirm={async () => {
          if (deleteAssetId) await deleteAsset.mutateAsync(deleteAssetId);
          setDeleteAssetId(null);
        }}
        loading={deleteAsset.isPending}
      />
    </div>
  );
}
