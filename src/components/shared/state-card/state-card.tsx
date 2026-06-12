import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: number;
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

          <p className="text-2xl font-bold mt-1.5 font-display">
            {value}
          </p>

          {trend !== undefined && (
            <p
              className={cn(
                "text-xs mt-2 flex items-center gap-1",
                trend >= 0
                  ? "text-emerald-600"
                  : "text-destructive"
              )}
            >
              <span>
                {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
              </span>

              {trendLabel && (
                <span className="text-muted-foreground">
                  {trendLabel}
                </span>
              )}
            </p>
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
}