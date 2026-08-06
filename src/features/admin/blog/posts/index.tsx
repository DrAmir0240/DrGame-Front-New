"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { ConfirmModal, DataTable, DataTableColumn, PageHeader, Pagination } from "@/components/shared";

import {
  useBlogPosts,
  useBlogCategories,
  useCreateBlogPost,
  useUpdateBlogPost,
  useDeleteBlogPost,
  LIMIT,
} from "./apis";
import { PostFormDialog } from "./components/post-form-dialog";
import type { BlogPost } from "../types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "همه وضعیت‌ها" },
  { value: "draft", label: "پیش‌نویس" },
  { value: "published", label: "منتشر شده" },
];

export default function BlogPostsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const { data, isLoading } = useBlogPosts({
    limit: LIMIT,
    offset: page * LIMIT,
    status,
  });

  const { data: categories = [] } = useBlogCategories();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const items = data?.results ?? [];

  const filtered = search.trim()
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.slug.toLowerCase().includes(search.toLowerCase())
      )
    : items;


  const handleSubmit = async (formData: FormData) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setOpenForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const totalPages = data ? Math.ceil(data.count / LIMIT) : 0;

 const columns: DataTableColumn<BlogPost>[] = useMemo(
  () => [
    {
      header: "تصویر",
      render: (row) =>
        row.cover_image ? (
          <img
            src={row.cover_image}
            alt={row.title}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        ),
    },
    {
      header: "عنوان",
      render: (row) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {row.slug}
          </div>
        </div>
      ),
    },
    {
      header: "دسته‌بندی",
      render: (row) => (
        <span className="text-muted-foreground">
          {row.category_id != null
            ? categories.find((c) => c.id === row.category_id)?.title ?? "—"
            : "—"}
        </span>
      ),
    },
    {
      header: "وضعیت",
      render: (row) => (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            row.status === "published"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
              : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
          )}
        >
          {row.status === "published" ? "منتشر شده" : "پیش‌نویس"}
        </span>
      ),
    },
    {
      header: "تاریخ انتشار",
      render: (row) => (
        <span className="text-muted-foreground">
          {row.published_at
            ? new Date(row.published_at).toLocaleDateString("fa-IR")
            : "—"}
        </span>
      ),
    },
    {
      header: "عملیات",
      render: (row) => (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditing(row);
              setOpenForm(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(row)}
          >
            <Trash2 className="h-4 w-4 text-rose-500" />
          </Button>
        </div>
      ),
    },
  ],
  [categories]
);
  return (
    <div className="space-y-4">
      <PageHeader
        title="بلاگ"
        description="مدیریت پست‌های بلاگ وب‌سایت"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Input
            placeholder="جستجوی پست..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => {
            setEditing(null);
            setOpenForm(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          پست جدید
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="پستی ثبت نشده است"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        count={data?.count ?? 0}
        limit={LIMIT}
        onPageChange={setPage}
      />

      <PostFormDialog
        open={openForm}
        editing={editing}
        categories={categories}
        loading={loading}
        onClose={() => {
          setOpenForm(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="حذف پست بلاگ"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}