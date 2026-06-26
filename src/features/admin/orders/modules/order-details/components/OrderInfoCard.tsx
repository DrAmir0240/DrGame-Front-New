"use client";

import { StatusBadge } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import moment from "moment";
import type { Branch, Customer, Order } from "../../../types";

interface Props {
  order: Order;
  customer?: Customer;
  branch?: Branch;
}

export default function OrderInfoCard({ order, customer, branch }: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">اطلاعات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">وضعیت</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">پرداخت</span>
          <StatusBadge status={order.paymentStatus} />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">مشتری</span>
          <span>{customer?.fullName ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">شعبه</span>
          <span>{branch?.name ?? "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">تاریخ</span>
          <span>{moment(order.createdDate).format("YYYY/MM/DD HH:mm")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
