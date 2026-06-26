"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { statusFlow, statusLabels } from "../constants";
import type { Order, OrderStatus } from "../../../types";

interface Props {
  order: Order;
  currentIdx: number;
  nextStatus: OrderStatus | null;
}

export default function StatusTimeline({ order, currentIdx, nextStatus }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between overflow-x-auto gap-2">
        {statusFlow.map((s, i) => {
          const isDone = i <= currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div key={s} className="flex items-center gap-2 flex-1 min-w-[90px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isDone ? "bg-primary text-primary-foreground" : "bg-neutral-200 text-muted-foreground"
              } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}>
                {isDone ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs whitespace-nowrap ${isDone ? "font-medium" : "text-muted-foreground"}`}>
                {statusLabels[s]}
              </span>
              {i < statusFlow.length - 1 && (
                <div className={`flex-1 h-0.5 ${isDone ? "bg-primary" : "bg-neutral-200"}`} />
              )}
            </div>
          );
        })}
      </div>
      {nextStatus && order.status !== "cancelled" && (
        <div className="mt-4 flex gap-2">
          <Button size="sm">مرحله بعد: {statusLabels[nextStatus]}</Button>
          <Button size="sm" variant="destructive">
            لغو سفارش
          </Button>
        </div>
      )}
    </div>
  );
}
