"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Video as VideoIcon } from "lucide-react";
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
  useVideos,
  useCreateVideo,
  useUpdateVideo,
  useDeleteVideo,
  LIMIT,
} from "./apis";
import { VideoFormDialog } from "./components/vedio-form-dialog";

import { cn } from "@/lib/utils";
import { Video } from "./types";

export default function VideosPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const { data, isLoading } = useVideos({
    limit: LIMIT,
    offset: page * LIMIT,
    is_active: activeFilter === "all" ? undefined : activeFilter,
  });

  const createMutation = useCreateVideo();
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Video | null>(null);

  const items = data?.results ?? [];
  const filtered = search.trim()
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.video_url.toLowerCase().includes(search.toLowerCase())
      )
    : items;

  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const totalPages = data ? Math.ceil(data.count / LIMIT) : 0;

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

  const columns: DataTableColumn<Video>[] = useMemo(
    () => [
      {
        header: "کاور",
        render: (row) =>
          row.cover_image ? (
            <img
              src={row.cover_image}
              alt={row.title}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
              <VideoIcon className="h-5 w-5 text-muted-foreground" />
            </div>
          ),
      },
      {
        header: "عنوان",
        render: (row) => <span className="font-medium">{row.title}</span>,
      },
      {
        header: "لینک",
        render: (row) => (
          <a
            href={row.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline dir-ltr inline-block max-w-[200px] truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.video_url}
          </a>
        ),
      },
      {
        header: "وضعیت",
        render: (row) => (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              row.is_active
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            )}
          >
            {row.is_active ? "فعال" : "غیرفعال"}
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
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="ویدیوها"
        description="مدیریت ویدیوهای وب‌سایت"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Input
            placeholder="جستجوی ویدیو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="true">فعال</SelectItem>
              <SelectItem value="false">غیرفعال</SelectItem>
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
          ویدیو جدید
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="ویدیویی ثبت نشده است"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        count={data?.count ?? 0}
        limit={LIMIT}
        onPageChange={setPage}
      />

      <VideoFormDialog
        open={openForm}
        editing={editing}
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
        title="حذف ویدیو"
        message={`آیا از حذف «${deleteTarget?.title}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}