"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { orderTypeConfig } from "../constants";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderBase } from "../types";

interface Props {
  order: OrderBase;
}

export function OrderCard({ order }: Props) {
  const typeConfig = orderTypeConfig[order.type] ?? orderTypeConfig.product;
  const TypeIcon = typeConfig.icon;

  const detailHref =
    order.type === "product"
      ? `/orders/products/${order.id}`
      : order.type === "sony"
        ? `/orders/sony/${order.id}`
        : `/orders/repair/${order.id}`;

  return (
    <Link
      href={detailHref}
      className="block rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-gray-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              typeConfig.bg
            )}
          >
            <TypeIcon className={cn("h-5 w-5", typeConfig.color)} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-900">
                سفارش #{order.id}
              </span>
              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-xs font-medium",
                  typeConfig.bg,
                  typeConfig.color
                )}
              >
                {typeConfig.label}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              {new Date(order.created_at).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <ChevronLeft className="h-5 w-5 shrink-0 text-gray-400" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
        <OrderStatusBadge
          status={order.status}
          statusDisplay={order.status_display}
        />

        <p className="font-bold text-gray-900">
          {order.total_amount.toLocaleString("fa-IR")}
          <span className="mr-1 text-xs font-normal text-gray-500">تومان</span>
        </p>
      </div>
    </Link>
  );
}