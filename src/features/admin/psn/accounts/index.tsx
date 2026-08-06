"use client";

import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Gamepad2, Search } from "lucide-react";
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
  usePsnAccounts,
  useCreatePsnAccount,
  useUpdatePsnAccount,
  useDeletePsnAccount,
  useAccountStatuses,
  LIMIT,
} from "@/features/admin/psn/apis";

import { cn } from "@/lib/utils";
import { PsnAccount } from "../types";
import { AccountStatusBadge } from "./components/account-status-badge";
import { AccountFormDialog } from "./components/account-form-dialog";

const REGION_OPTIONS = [
  { value: "all", label: "همه ریجن‌ها" },
  { value: "America", label: "America" },
  { value: "Europe", label: "Europe" },
  { value: "Asia", label: "Asia" },
  { value: "Mix", label: "Mix" },
];

export default function AccountsPage() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [plusFilter, setPlusFilter] = useState("all");

  const { data, isLoading } = usePsnAccounts({
    limit: LIMIT,
    offset: page * LIMIT,
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    region: regionFilter !== "all" ? regionFilter : undefined,
    plus: plusFilter !== "all" ? plusFilter : undefined,
  });

  const { data: statuses = [] } = useAccountStatuses();
  const createMutation = useCreatePsnAccount();
  const updateMutation = useUpdatePsnAccount();
  const deleteMutation = useDeletePsnAccount();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<PsnAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PsnAccount | null>(null);

  const items = data?.results ?? [];
  const loading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const totalPages = data ? Math.ceil(data.count / LIMIT) : 0;

  const handleSubmit = async (payload: Record<string, unknown>) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    setOpenForm(false);
    setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  };

  const formatPrice = (value: number | null) => {
    if (value == null) return "—";
    return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
  };

  const columns: DataTableColumn<PsnAccount>[] = useMemo(
    () => [
      {
        header: "یوزرنیم",
        render: (row) => (
          <div>
            <div className="font-medium ">{row.username}</div>
            {row.employee_name && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {row.employee_name}
              </div>
            )}
          </div>
        ),
      },
      {
        header: "وضعیت",
        render: (row) => <AccountStatusBadge title={row.status_title} />,
      },
      {
        header: "ریجن",
        render: (row) => (
          <span className="text-muted-foreground">{row.region || "—"}</span>
        ),
      },
      {
        header: "PS Plus",
        render: (row) => (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              row.plus
                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            )}
          >
            {row.plus ? "دارد" : "ندارد"}
          </span>
        ),
      },
      {
        header: "قیمت",
        render: (row) => (
          <span className="text-muted-foreground">{formatPrice(row.price)}</span>
        ),
      },
      {
        header: "عملیات",
        render: (row) => (
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              title="ویرایش"
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
              title="حذف"
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
        title="مدیریت اکانت‌ها"
        description="مدیریت سونی اکانت‌های PSN"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="جستجوی یوزرنیم..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="max-w-xs pr-9"
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={regionFilter}
            onValueChange={(v) => {
              setRegionFilter(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="ریجن" />
            </SelectTrigger>
            <SelectContent>
              {REGION_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={plusFilter}
            onValueChange={(v) => {
              setPlusFilter(v);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="PS Plus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="true">دارد</SelectItem>
              <SelectItem value="false">ندارد</SelectItem>
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
          اکانت جدید
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage=" اکانتی ثبت نشده است"
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        count={data?.count ?? 0}
        limit={LIMIT}
        onPageChange={setPage}
      />

      <AccountFormDialog
        open={openForm}
        editing={editing}
        statuses={statuses}
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
        title="حذف اکانت"
        message={`آیا از حذف اکانت «${deleteTarget?.username}» اطمینان دارید؟`}
        onConfirm={handleDelete}
        loading={loading}
      />
    </div>
  );
}