"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import moment from "moment";
import { Eye, Search } from "lucide-react";

import { DataTable, DataTableColumn, PageHeader } from "@/components/shared";

import {
  Badge,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

import {
  mockBranches,
  mockCustomers,
  mockOrders,
  orderTypeLabels,
} from "./constants";

import { Order } from "./types";
import {StatusBadge} from "@/components/shared";

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const orders = mockOrders;
  const branches = mockBranches;
  const customers = mockCustomers;

  const getBranchName = (id: string) =>
    branches.find((b) => b.id === id)?.name ?? "—";

  const getCustomerName = (id: string) =>
    customers.find((c) => c.id === id)?.fullName ?? "—";

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const customer = getCustomerName(order.customerId);

      const matchSearch =
        !search ||
        order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        customer.includes(search);

      const matchType = filterType === "all" || order.orderType === filterType;

      const matchStatus =
        filterStatus === "all" || order.status === filterStatus;

      return matchSearch && matchType && matchStatus;
    });
  }, [orders, search, filterType, filterStatus]);

  const columns: DataTableColumn<Order>[] = [
    {
      header: "شماره",
      render: (row) => (
        <code className="rounded-md bg-muted px-2 py-1 text-xs font-mono">
          {row.orderNumber}
        </code>
      ),
    },
    {
      header: "نوع",
      render: (row) => (
        <Badge variant="outline">{orderTypeLabels[row.orderType]}</Badge>
      ),
    },
    {
      header: "مشتری",
      render: (row) => (
        <span className="text-sm font-medium">
          {getCustomerName(row.customerId)}
        </span>
      ),
    },
    {
      header: "شعبه",
      render: (row) => (
        <span className="text-sm">{getBranchName(row.branchId)}</span>
      ),
    },
    {
      header: "مبلغ",
      render: (row) => (
        <span className="font-semibold text-sm">{formatPrice(row.total)}</span>
      ),
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

  return (
    <div className="space-y-6">
      <PageHeader title="سفارش‌ها" description={`${orders.length} سفارش`}>
        <Link href="/admin/orders/new">
          <Button>ثبت سفارش جدید</Button>
        </Link>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            className="pr-10"
            placeholder="شماره سفارش یا نام مشتری..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>

            {Object.entries(orderTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>

            <SelectItem value="pending">در انتظار</SelectItem>

            <SelectItem value="confirmed">تأیید شده</SelectItem>

            <SelectItem value="processing">پردازش</SelectItem>

            <SelectItem value="completed">تکمیل</SelectItem>

            <SelectItem value="cancelled">لغو</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable<Order> columns={columns} data={filtered} isLoading={false} />
    </div>
  );
}
