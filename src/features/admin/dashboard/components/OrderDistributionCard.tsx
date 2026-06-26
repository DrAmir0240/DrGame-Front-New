"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card/card";
import type { OrderTypeDataItem } from "../types";
import { COLORS } from "../constants";
import { formatNumber } from "@/utils/format";

interface Props {
  data: OrderTypeDataItem[];
}

export default function OrderDistributionCard({ data }: Props) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>توزیع سفارش‌ها</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatNumber(Number(value))} />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-2 mt-4">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{formatNumber(item.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
