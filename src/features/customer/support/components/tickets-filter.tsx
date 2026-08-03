"use client";

import { cn } from "@/lib/utils";
import { statusFilters } from "../constants";
import type { TicketStatus } from "../types";

interface Props {
  value: TicketStatus | "all";
  onChange: (value: TicketStatus | "all") => void;
}

export function TicketsFilter({ value, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {statusFilters.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
            value === item.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}