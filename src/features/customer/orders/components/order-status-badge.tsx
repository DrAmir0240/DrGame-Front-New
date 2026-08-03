"use client";

import { cn } from "@/lib/utils";
import { orderStatusConfig } from "../constants";

interface Props {
  status: string;
  statusDisplay?: string;
  className?: string;
}

export function OrderStatusBadge({ status, statusDisplay, className }: Props) {
  const config = orderStatusConfig[status] ?? {
    label: statusDisplay || status,
    color: "text-gray-700",
    bg: "bg-gray-100",
    icon: orderStatusConfig.pending.icon,
  };

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