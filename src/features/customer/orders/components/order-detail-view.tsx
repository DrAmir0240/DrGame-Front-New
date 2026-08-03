"use client";

import { Loader2, MapPin, FileText, History } from "lucide-react";
import { orderTypeConfig } from "../constants";
import { OrderStatusBadge } from "./order-status-badge";
import type { OrderBase } from "../types";
import { cn } from "@/lib/utils";

interface Props {
  order?: OrderBase;
  isLoading?: boolean;
}

export function OrderDetailView({ order, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center text-gray-500">
        سفارش یافت نشد
      </div>
    );
  }

  const typeConfig = orderTypeConfig[order.type] ?? orderTypeConfig.product;
  const TypeIcon = typeConfig.icon;

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                typeConfig.bg
              )}
            >
              <TypeIcon className={cn("h-6 w-6", typeConfig.color)} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                سفارش #{order.id}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {typeConfig.label} ·{" "}
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
          <OrderStatusBadge
            status={order.status}
            statusDisplay={order.status_display}
          />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-gray-50 pt-4">
          <span className="text-sm text-gray-500">مبلغ کل</span>
          <span className="text-xl font-bold text-gray-900">
            {order.total_amount.toLocaleString("fa-IR")} تومان
          </span>
        </div>
      </div>

      {/* آیتم‌ها */}
      {order.items && order.items.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <h2 className="mb-4 font-semibold text-gray-900">اقلام سفارش</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.quantity} × {item.unit_price.toLocaleString("fa-IR")}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  {item.total_price.toLocaleString("fa-IR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* اطلاعات اضافی */}
      {(order.address || order.description || order.device_model) && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">اطلاعات سفارش</h2>

          {order.address && (
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">آدرس</p>
                <p className="text-sm text-gray-900">{order.address}</p>
              </div>
            </div>
          )}

          {order.device_model && (
            <div className="flex gap-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">مدل دستگاه</p>
                <p className="text-sm text-gray-900">{order.device_model}</p>
              </div>
            </div>
          )}

          {order.problem_description && (
            <div className="flex gap-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">شرح مشکل</p>
                <p className="text-sm text-gray-900">
                  {order.problem_description}
                </p>
              </div>
            </div>
          )}

          {order.description && (
            <div className="flex gap-3">
              <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">توضیحات</p>
                <p className="text-sm text-gray-900">{order.description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* مرحله‌ها (stage_logs) */}
      {order.stage_logs && order.stage_logs.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-gray-500" />
            <h2 className="font-semibold text-gray-900">مراحل سفارش</h2>
          </div>

          <div className="relative space-y-0">
            {order.stage_logs.map((log, index) => (
              <div key={log.id} className="relative flex gap-4 pb-6 last:pb-0">
                {index !== order.stage_logs!.length - 1 && (
                  <div className="absolute right-[9px] top-5 h-full w-px bg-gray-200" />
                )}
                <div className="relative z-10 mt-1 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-primary bg-white" />
                <div>
                  <p className="font-medium text-gray-900">
                    {log.stage_display || log.stage}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {new Date(log.created_at).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {log.note && (
                    <p className="mt-1 text-sm text-gray-600">{log.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}