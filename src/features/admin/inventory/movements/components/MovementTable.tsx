"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { DataTable, DataTableColumn } from "@/components/shared";
import { DIRECTION_MAP } from "../types";
import type { InventoryMovement } from "../types";

interface Props {
  movements: InventoryMovement[];
  isLoading: boolean;
  onEdit: (m: InventoryMovement) => void;
  onDelete: (m: InventoryMovement) => void;
}

export default function MovementTable({
  movements,
  isLoading,
  onEdit,
  onDelete,
}: Props) {
  const columns: DataTableColumn<InventoryMovement>[] = [
    {
      header: "جهت",
      render: (r) => {
        const config = DIRECTION_MAP[r.direction] || {
          label: r.direction,
          color: "bg-gray-100 text-gray-600 border-gray-200",
        };
        return (
          <Badge variant="outline" className={`text-xs border ${config.color}`}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "شناسه محصول",
      render: (r) => <span className="text-sm">{r.product}</span>,
    },
    {
      header: "شناسه موجودی",
      render: (r) => (
        <span className="text-sm">{r.product_entity || "—"}</span>
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
    <DataTable<InventoryMovement>
      columns={columns}
      data={movements}
      isLoading={isLoading}
      emptyMessage="گردشی ثبت نشده"
    />
  );
}
