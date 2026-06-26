"use client";

import { useMemo } from "react";
import moment from "moment";
import { StatusBadge } from "@/components/shared";
import { DataTable, DataTableColumn } from "@/components/shared";
import type { RepairOrder, RepairStatus } from "../types";
import { deviceTypes } from "../constants";
import RepairStatusActions from "./RepairStatusActions";
import { formatPrice } from "@/utils/format";

interface Props {
  orders: RepairOrder[];
  search: string;
  onStatusChange: (id: number, status: RepairStatus) => void;
}

export default function RepairsList({ orders, search, onStatusChange }: Props) {
  const filtered = useMemo(() => {
    return orders.filter((r) => {
      const q = search.toLowerCase();
      return (
        !search ||
        r.device_model?.toLowerCase().includes(q) ||
        r.issue_description?.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  const columns: DataTableColumn<RepairOrder>[] = [
    {
      header: "تاریخ",
      render: (r) => (
        <span className="text-sm">
          {moment(r.created_date).format("YYYY/MM/DD")}
        </span>
      ),
    },
    {
      header: "نوع",
      render: (r) => (
        <span className="text-sm">
          {deviceTypes[r.device_type] || r.device_type}
        </span>
      ),
    },
    {
      header: "مدل",
      render: (r) => (
        <span className="font-medium text-sm">{r.device_model || "—"}</span>
      ),
    },
    {
      header: "مشکل",
      render: (r) => (
        <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
          {r.issue_description || "—"}
        </span>
      ),
    },
    {
      header: "قیمت تعمیرکار",
      render: (r) => (
        <span className="text-sm">{formatPrice(r.technician_price)}</span>
      ),
    },
    {
      header: "قیمت نهایی",
      render: (r) => (
        <span className="text-sm font-semibold">
          {formatPrice(r.final_price)}
        </span>
      ),
    },
    {
      header: "وضعیت",
      render: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: "عملیات",
      render: (r) => (
        <RepairStatusActions order={r} onStatusChange={onStatusChange} />
      ),
    },
  ];

  return (
    <DataTable<RepairOrder>
      columns={columns}
      data={filtered}
      isLoading={false}
    />
  );
}
