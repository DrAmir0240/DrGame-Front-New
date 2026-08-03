"use client";

import { cn } from "@/lib/utils";
import { orderTypeFilters } from "../constants";
import type { OrderType } from "../types";

interface Props {
  value: OrderType | "all";
  onChange: (value: OrderType | "all") => void;
}

export function OrdersFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {orderTypeFilters.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            value === item.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}