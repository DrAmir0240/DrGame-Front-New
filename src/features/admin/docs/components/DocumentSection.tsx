"use client";

import { useState } from "react";
import { Download, FileText, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { DataTable, Pagination, ConfirmModal, type DataTableColumn } from "@/components/shared";
import {
  useDocCategories,
  useDocSubCategories,
  useDocumentList,
  useCreateDocCategory,
  useCreateDocSubCategory,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
} from "../apis";
import { LIMIT } from "../constants";
import type { Document } from "../types";
import CategoryTree from "./CategoryTree";
import CategoryFormDialog from "./CategoryFormDialog";
import SubCategoryFormDialog from "./SubCategoryFormDialog";
import DocumentFormDialog from "./DocumentFormDialog";

export default function DocumentSection() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false);
  const [subCategoryParentId, setSubCategoryParentId] = useState<number | null>(null);
  const [docDialogOpen, setDocDialogOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);
  const [deleteDocId, setDeleteDocId] = useState<number | null>(null);

  const { data: categories = [], isLoading: catsLoading } = useDocCategories();
  const { data: subCategories = [], isLoading: subCatsLoading } = useDocSubCategories(selectedCategoryId);
  const { data: docData, isLoading: docsLoading } = useDocumentList({
    search: search || undefined,
    category: selectedCategoryId || undefined,
    sub_category: selectedSubCategoryId || undefined,
    limit: LIMIT,
    offset: page * LIMIT,
  });

  const createCategory = useCreateDocCategory();
  const createSubCategory = useCreateDocSubCategory();
  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const deleteDocument = useDeleteDocument();

  const docs = docData?.results ?? [];
  const totalCount = docData?.count ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  const columns: DataTableColumn<Document>[] = [
    { header: "#", render: (row) => <span className="text-neutral-400 text-xs">{row.id}</span> },
    { header: "عنوان", accessor: "title" },
    { header: "دسته‌بندی", render: (row) => row.main_category_title ?? "-" },
    { header: "زیردسته", render: (row) => row.sub_category_title ?? "-" },
    {
      header: "فایل",
      render: (row) => (
        <a href={row.file} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-xs">
          <Download className="w-3.5 h-3.5" />
          دانلود
        </a>
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
              setEditingDoc(row);
              setDocDialogOpen(true);
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
              setDeleteDocId(row.id);
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
              placeholder="جستجوی سند..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
            />
          </div>
          <Button onClick={() => { setEditingDoc(null); setDocDialogOpen(true); }}>
            <Plus className="w-4 h-4 ml-1" />
            سند جدید
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={docs}
          isLoading={docsLoading}
          emptyMessage="سندی یافت نشد"
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

      <DocumentFormDialog
        open={docDialogOpen}
        editing={editingDoc}
        categories={categories}
        subCategories={subCategories}
        onClose={() => { setDocDialogOpen(false); setEditingDoc(null); }}
        onSaved={() => { setDocDialogOpen(false); setEditingDoc(null); }}
        onSubmit={async (formData) => {
          if (editingDoc) return updateDocument.mutateAsync({ id: editingDoc.id, formData });
          return createDocument.mutateAsync(formData);
        }}
      />

      <ConfirmModal
        open={deleteDocId !== null}
        onOpenChange={(v) => { if (!v) setDeleteDocId(null); }}
        title="حذف سند"
        message="آیا از حذف این سند اطمینان دارید؟"
        onConfirm={async () => {
          if (deleteDocId) await deleteDocument.mutateAsync(deleteDocId);
          setDeleteDocId(null);
        }}
        loading={deleteDocument.isPending}
      />
    </div>
  );
}
