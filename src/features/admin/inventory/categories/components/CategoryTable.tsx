"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { DataTable, DataTableColumn } from "@/components/shared";
import type { ProductCategory } from "../types";

interface Props {
  categories: ProductCategory[];
  isLoading: boolean;
  onEdit: (cat: ProductCategory) => void;
  onDelete: (cat: ProductCategory) => void;
}

export default function CategoryTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns: DataTableColumn<ProductCategory>[] = [
    {
      header: "عنوان",
      render: (r) => <span className="font-medium text-sm">{r.title}</span>,
    },
    {
      header: "توضیحات",
      render: (r) => (
        <span className="text-sm text-muted-foreground line-clamp-1">
          {r.description || "—"}
        </span>
      ),
    },
    {
      header: "تاریخ ایجاد",
      render: (r) => (
        <span className="text-sm text-muted-foreground">
          {new Date(r.created_at).toLocaleDateString("fa-IR")}
        </span>
      ),
    },
    {
      header: "",
      render: (r) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(r);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(r);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<ProductCategory>
      columns={columns}
      data={categories}
      isLoading={isLoading}
      emptyMessage="دسته‌بندی‌ای یافت نشد"
    />
  );
}
