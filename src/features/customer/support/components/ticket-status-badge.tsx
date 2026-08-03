"use client";

import { cn } from "@/lib/utils";
import { statusConfig } from "../constants";
import type { TicketStatus } from "../types";

interface Props {
  status: TicketStatus;
  className?: string;
}

export function TicketStatusBadge({ status, className }: Props) {
  const config = statusConfig[status] ?? statusConfig.open;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}