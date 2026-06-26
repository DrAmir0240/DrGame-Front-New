"use client";

import { Card, CardContent } from "@/components/ui";
import { CheckCircle2, Clock, Circle, AlertTriangle } from "lucide-react";
import moment from "moment";
import type { Task } from "../types";

interface Props {
  tasks: Task[];
}

export default function TaskStats({ tasks }: Props) {
  const stats = [
    { label: "انجام‌نشده", count: tasks.filter(t => t.status === "todo").length, icon: Circle, color: "text-muted-foreground", bg: "bg-muted/50" },
    { label: "درحال انجام", count: tasks.filter(t => t.status === "in_progress").length, icon: Clock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { label: "انجام‌شده", count: tasks.filter(t => t.status === "done").length, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    { label: "سررسیدشده", count: tasks.filter(t => t.due_date && moment(t.due_date).isBefore(moment(), "day") && t.status !== "done" && t.status !== "cancelled").length, icon: AlertTriangle, color: "text-destructive", bg: "bg-red-50 dark:bg-red-950/30" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className="rounded-xl">
            <CardContent className={`p-4 flex items-center gap-3 ${s.bg} rounded-xl`}>
              <Icon className={`w-6 h-6 ${s.color} shrink-0`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
