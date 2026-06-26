"use client";

import React from "react";
import moment from "moment";
import { useParams } from "next/navigation";

import StatusBadge from "@/components/shared/StatusBadge";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Order } from "../../types";
import { mockBranches, mockCustomers, mockOrders } from "../../constants";
import { PageHeader } from "@/components/shared";

function formatPrice(n?: number) {
  return n ? new Intl.NumberFormat("fa-IR").format(n) + " ت" : "۰ ت";
}

const statusFlow: Order["status"][] = [
  "pending",
  "confirmed",
  "processing",
  "ready",
  "dispatched",
  "delivered",
  "completed",
];

const statusLabels: Record<Order["status"], string> = {
  pending: "در انتظار",
  confirmed: "تأیید",
  processing: "پردازش",
  ready: "آماده",
  dispatched: "ارسال",
  delivered: "تحویل",
  completed: "تکمیل",
  cancelled: "لغو",
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const order = mockOrders.find((o) => o.id === orderId);
  const customer = mockCustomers.find((c) => c.id === order?.customerId);
  const branch = mockBranches.find((b) => b.id === order?.branchId);

  if (!order) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        سفارش یافت نشد
      </div>
    );
  }

  const currentIdx = statusFlow.indexOf(order.status);
  const nextStatus =
    currentIdx < statusFlow.length - 1 ? statusFlow[currentIdx + 1] : null;

  return (
    <div className="space-y-6">
      <PageHeader title={`سفارش ${order.orderNumber || order.id.slice(-6)}`}>
        <Link href="/admin/orders">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="w-4 h-4" />
            بازگشت
          </Button>
        </Link>
      </PageHeader>

      {/* Timeline */}
      <Card className="rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {statusFlow.map((s, i) => {
              const isDone = i <= currentIdx;
              const isCurrent = i === currentIdx;

              return (
                <div
                  key={s}
                  className="flex items-center gap-2 flex-1 min-w-[90px]"
                >
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                      ${
                        isDone
                          ? "bg-primary text-primary-foreground"
                          : "bg-neutral-200 text-muted-foreground"
                      }
                      ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}
                    `}
                  >
                    {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>

                  <span
                    className={`text-xs whitespace-nowrap ${
                      isDone ? "font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {statusLabels[s]}
                  </span>

                  {i < statusFlow.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        isDone ? "bg-primary" : "bg-neutral-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {nextStatus && order.status !== "cancelled" && (
            <div className="mt-4 flex gap-2">
              <Button size="sm">مرحله بعد: {statusLabels[nextStatus]}</Button>
              <Button size="sm" className="bg-error text-background" variant="destructive">
                لغو سفارش
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <Card className="lg:col-span-2 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">آیتم‌ها</CardTitle>
          </CardHeader>

          <CardContent>
            {order.items?.length ? (
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-neutral-100 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.unitPrice)}
                      </p>
                    </div>
                    <span className="font-semibold text-sm">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-6">
                بدون آیتم
              </p>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="space-y-6">
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
                <span>
                  {moment(order.createdDate).format("YYYY/MM/DD HH:mm")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Financial */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">خلاصه مالی</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">جمع اقلام</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>

              {(order.discountAmount ?? 0) > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>تخفیف</span>
                  <span>-{formatPrice(order.discountAmount ?? 0)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">مالیات</span>
                <span>{formatPrice(order.taxAmount)}</span>
              </div>

              <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold">
                <span>جمع کل</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
