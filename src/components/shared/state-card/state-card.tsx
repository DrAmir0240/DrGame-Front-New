import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number | null;
  trendLabel?: string;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "bg-neutral-0 rounded-2xl p-5 border border-neutral-100 hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <p className="text-2xl font-bold mt-1.5 font-display">{value}</p>

          {(trend !== undefined || trendLabel) && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              {trend !== undefined && trend !== null && (
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-medium",
                    trend >= 0
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                  )}
                >
                  {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
                </span>
              )}
              {trend === null && (
                <span className="text-muted-foreground">—</span>
              )}
              {trendLabel && (
                <span className="text-muted-foreground">{trendLabel}</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};