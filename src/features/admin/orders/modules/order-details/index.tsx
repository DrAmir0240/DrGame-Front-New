"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui";
import { mockBranches, mockCustomers, mockOrders } from "../../constants";
import { statusFlow } from "./constants";
import StatusTimeline from "./components/StatusTimeline";
import OrderItemsCard from "./components/OrderItemsCard";
import OrderInfoCard from "./components/OrderInfoCard";
import FinancialSummaryCard from "./components/FinancialSummaryCard";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const order = mockOrders.find((o) => o.id === params.id);
  const customer = mockCustomers.find((c) => c.id === order?.customerId);
  const branch = mockBranches.find((b) => b.id === order?.branchId);

  if (!order) {
    return <div className="text-center py-20 text-muted-foreground">سفارش یافت نشد</div>;
  }

  const currentIdx = statusFlow.indexOf(order.status);
  const nextStatus = currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  return (
    <div className="space-y-6">
      <PageHeader title={`سفارش ${order.orderNumber || order.id.slice(-6)}`}>
        <Link href="/admin/orders">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4" /> بازگشت
          </Button>
        </Link>
      </PageHeader>

      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <StatusTimeline order={order} currentIdx={currentIdx} nextStatus={nextStatus} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OrderItemsCard order={order} />
        <div className="space-y-6">
          <OrderInfoCard order={order} customer={customer} branch={branch} />
          <FinancialSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}
