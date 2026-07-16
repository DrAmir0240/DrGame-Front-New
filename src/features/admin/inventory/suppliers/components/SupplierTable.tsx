"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { DataTable, DataTableColumn } from "@/components/shared";
import { SUPPLIER_TYPE_MAP } from "../types";
import type { Supplier } from "../types";

interface Props {
  suppliers: Supplier[];
  isLoading: boolean;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}

export default function SupplierTable({
  suppliers,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns: DataTableColumn<Supplier>[] = [
    {
      header: "نام",
      render: (r) => <span className="font-medium text-sm">{r.name}</span>,
    },
    {
      header: "نوع",
      render: (r) => {
        const config = SUPPLIER_TYPE_MAP[r.type];
        return (
          <Badge variant="outline" className={`text-xs border ${config.color}`}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "تلفن",
      render: (r) => <span className="text-sm">{r.phone || "—"}</span>,
    },
    {
      header: "کد ملی",
      render: (r) => (
        <span className="text-sm">{r.national_id || "—"}</span>
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
    <DataTable<Supplier>
      columns={columns}
      data={suppliers}
      isLoading={isLoading}
      emptyMessage="تامین‌کننده‌ای یافت نشد"
    />
  );
}
