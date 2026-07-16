"use client";

import { Package, AlertTriangle, XCircle } from "lucide-react";
import { StatCard } from "@/components/shared";
import type { ProductStats } from "../types";
import { formatPrice, formatNumber } from "@/utils/format";

interface Props {
  stats: ProductStats | null;
  isLoading: boolean;
}

export default function ProductStatsCards({ stats, isLoading }: Props) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-0 rounded-2xl p-5 border border-neutral-100 h-24 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="ارزش موجودی"
        value={formatPrice(Number(stats.total_inventory_value))}
        icon={Package}
      />
      <StatCard
        title="موجودی کافی"
        value={formatNumber(stats.green_count)}
        icon={Package}
        className="border-emerald-200 bg-emerald-50/50"
      />
      <StatCard
        title="رو به اتمام"
        value={formatNumber(stats.yellow_count)}
        icon={AlertTriangle}
        className="border-amber-200 bg-amber-50/50"
      />
      <StatCard
        title="اتمام موجودی"
        value={formatNumber(stats.red_count)}
        icon={XCircle}
        className="border-red-200 bg-red-50/50"
      />
    </div>
  );
}
