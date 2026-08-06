// components/status-badge.tsx
import { cn } from "@/lib/utils";

export function AccountStatusBadge({
  title,
}: {
  title?: string | null;
}) {
  if (!title) return <span className="text-muted-foreground">—</span>;

  const isActive = title.includes("فعال");
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        isActive
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
      )}
    >
      {title}
    </span>
  );
}