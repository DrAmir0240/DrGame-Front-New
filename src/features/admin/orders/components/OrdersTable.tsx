"use client";

import { useMemo } from "react";
import moment from "moment";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { DataTable, DataTableColumn } from "@/components/shared";
import { StatusBadge } from "@/components/shared";
import type { Branch, Customer, Order } from "../types";
import {  orderTypeLabels } from "../constants";
import { formatPrice } from "@/utils/format";

interface Props {
  orders: Order[];
  branches: Branch[];
  customers: Customer[];
  search: string;
  filterType: string;
  filterStatus: string;
}

export default function OrdersTable({ orders, branches, customers, search, filterType, filterStatus }: Props) {
  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name ?? "—";
  const getCustomerName = (id: string) => customers.find((c) => c.id === id)?.fullName ?? "—";

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const customerName = getCustomerName(order.customerId);
      const matchSearch = !search ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        customerName.includes(search);
      const matchType = filterType === "all" || order.orderType === filterType;
      const matchStatus = filterStatus === "all" || order.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [orders, search, filterType, filterStatus]);

  const columns: DataTableColumn<Order>[] = [
    {
      header: "شماره",
      render: (row) => (
        <code className="rounded-md bg-muted px-2 py-1 text-xs font-mono">{row.orderNumber}</code>
      ),
    },
    {
      header: "نوع",
      render: (row) => <Badge variant="outline">{orderTypeLabels[row.orderType]}</Badge>,
    },
    {
      header: "مشتری",
      render: (row) => <span className="text-sm font-medium">{getCustomerName(row.customerId)}</span>,
    },
    {
      header: "شعبه",
      render: (row) => <span className="text-sm">{getBranchName(row.branchId)}</span>,
    },
    {
      header: "مبلغ",
      render: (row) => <span className="font-semibold text-sm">{formatPrice(row.total)}</span>,
    },
    {
      header: "وضعیت",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "پرداخت",
      render: (row) => <StatusBadge status={row.paymentStatus} />,
    },
    {
      header: "تاریخ",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {moment(row.createdDate).format("YYYY/MM/DD HH:mm")}
        </span>
      ),
    },
    {
      header: "",
      render: (row) => (
        <Link href={`/admin/orders/${row.id}`}>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
    },
  ];

  return <DataTable<Order> columns={columns} data={filtered} isLoading={false} />;
}
