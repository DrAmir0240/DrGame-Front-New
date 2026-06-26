"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { mockBranches, mockCustomers, mockOrders } from "./constants";
import OrderFilters from "./components/OrderFilters";
import OrdersTable from "./components/OrdersTable";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  return (
    <div className="space-y-6">
      <PageHeader title="سفارش‌ها" description={`${mockOrders.length} سفارش`}>
        <Link href="/admin/orders/new">
          <Button><Plus className="w-4 h-4" /> ثبت سفارش جدید</Button>
        </Link>
      </PageHeader>

      <OrderFilters
        search={search}
        filterType={filterType}
        filterStatus={filterStatus}
        onSearchChange={setSearch}
        onTypeChange={setFilterType}
        onStatusChange={setFilterStatus}
      />

      <OrdersTable
        orders={mockOrders}
        branches={mockBranches}
        customers={mockCustomers}
        search={search}
        filterType={filterType}
        filterStatus={filterStatus}
      />
    </div>
  );
}
