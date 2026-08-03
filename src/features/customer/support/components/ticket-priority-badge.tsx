"use client";

import { cn } from "@/lib/utils";
import { priorityConfig } from "../constants";
import type { TicketPriority } from "../types";

interface Props {
  priority: TicketPriority;
  className?: string;
}

export function TicketPriorityBadge({ priority, className }: Props) {
  const config = priorityConfig[priority] ?? priorityConfig.medium;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}