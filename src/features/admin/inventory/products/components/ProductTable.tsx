"use client";

import { Pencil, Trash2, Eye } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { DataTable, DataTableColumn } from "@/components/shared";
import { getStockStatus } from "../types";
import type { Product, ProductChoices } from "../types";
import { formatPrice } from "@/utils/format";

interface Props {
  products: Product[];
  isLoading: boolean;
  choices: ProductChoices | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onView: (product: Product) => void;
}

export default function ProductTable({
  products,
  isLoading,
  choices,
  onEdit,
  onDelete,
  onView,
}: Props) {
  function getCategoryTitle(id: number): string {
    return choices?.categories.find((c) => c.id === id)?.title || "—";
  }

  const columns: DataTableColumn<Product>[] = [
    {
      header: "عنوان",
      render: (r) => (
        <span
          className="font-medium text-sm text-blue-600 hover:underline cursor-pointer"
          onClick={() => onView(r)}
        >
          {r.title}
        </span>
      ),
    },
    {
      header: "دسته‌بندی",
      render: (r) => (
        <span className="text-sm">{getCategoryTitle(r.category)}</span>
      ),
    },
    {
      header: "قیمت",
      render: (r) => (
        <span className="font-semibold text-sm">
          {formatPrice(Number(r.price))}
        </span>
      ),
    },
    {
      header: "موجودی",
      render: (r) => {
        const status = getStockStatus(r.stock, r.min_stock);
        return (
          <Badge
            variant="outline"
            className={`text-xs border ${status.color}`}
          >
            {r.stock} — {status.label}
          </Badge>
        );
      },
    },
    {
      header: "فروش",
      render: (r) => (
        <span className="text-sm">{r.units_sold.toLocaleString("fa-IR")}</span>
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
              onView(r);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
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
    <DataTable<Product>
      columns={columns}
      data={products}
      isLoading={isLoading}
      emptyMessage="کالایی یافت نشد"
    />
  );
}
