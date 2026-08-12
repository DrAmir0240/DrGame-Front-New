"use client";

import { cn } from "@/lib/utils";

export default function TrendBadge({ change_pct }: { change_pct: number | null | undefined }) {
  if (change_pct === null || change_pct === undefined) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  const positive = change_pct >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
        positive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"
      )}
    >
      {positive ? "▲" : "▼"} {Math.abs(change_pct)}%
    </span>
  );
}
