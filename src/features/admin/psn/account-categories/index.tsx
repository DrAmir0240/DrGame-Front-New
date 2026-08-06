"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui";
import { DataTable, DataTableColumn, PageHeader } from "@/components/shared";
import { useAccountCategories } from "@/features/admin/psn/apis";

import { cn } from "@/lib/utils";
import { AccountCategory } from "../types";

const CAPACITY_LABELS: Record<string, string> = {
  "1": "Offline",
  "2": "Online + Offline",
  "3": "Online",
};

export default function AccountCategoriesPage() {
  const [search, setSearch] = useState("");
  const { data: categories = [], isLoading } = useAccountCategories();

  const filtered = search.trim()
    ? categories.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      )
    : categories;

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("fa-IR").format(value) + " تومان";

  const columns: DataTableColumn<AccountCategory>[] = useMemo(
    () => [
      {
        header: "عنوان",
        render: (row) => <span className="font-medium">{row.title}</span>,
      },
      {
        header: "نوع",
        render: (row) => (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-medium",
              row.type === "buy"
                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
                : "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400"
            )}
          >
            {row.type === "buy" ? "خرید" : "اجاره"}
          </span>
        ),
      },
      {
        header: "مدت اجاره",
        render: (row) =>
          row.type === "rent" && row.rent_time_days != null
            ? `${row.rent_time_days} روز`
            : "—",
      },
      {
        header: "ظرفیت",
        render: (row) =>
          CAPACITY_LABELS[String(row.account_capacity)] ??
          row.account_capacity ??
          "—",
      },
      {
        header: "قیمت پایه",
        render: (row) => (
          <span className="text-muted-foreground">
            {formatPrice(row.base_price)}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title="دسته‌بندی اکانت‌ها"
        description="دسته‌بندی‌های سونی اکانت (خرید / اجاره)"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Input
          placeholder="جستجوی دسته‌بندی..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        emptyMessage="دسته‌بندی‌ای ثبت نشده است"
      />
    </div>
  );
}