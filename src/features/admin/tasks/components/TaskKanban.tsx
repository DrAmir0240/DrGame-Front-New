"use client";

import { Skeleton } from "@/components/ui";
import { Circle, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../types";
import { kanbanColumns } from "../constants";

const iconMap: Record<string, typeof Circle> = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  cancelled: AlertTriangle,
};

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskKanban({ tasks, isLoading, onStatusChange, onDelete }: Props) {
  const grouped: Record<TaskStatus, Task[]> = {
    todo: tasks.filter(t => t.status === "todo"),
    in_progress: tasks.filter(t => t.status === "in_progress"),
    done: tasks.filter(t => t.status === "done"),
    cancelled: [],
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kanbanColumns.map((col) => (
          <div key={col.status} className="space-y-3">
            <Skeleton className="h-8 w-full" />
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kanbanColumns.map((col) => {
        const ColIcon = iconMap[col.status] || Circle;
        const colTasks = grouped[col.status] || [];
        return (
          <div key={col.status} className={`rounded-2xl border-t-4 ${col.color} ${col.bg} p-4`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ColIcon className={`w-4 h-4 ${col.headerColor}`} />
                <h3 className={`font-semibold text-sm ${col.headerColor}`}>{col.label}</h3>
              </div>
              <span className="text-xs bg-muted text-muted-foreground rounded-full px-2 py-0.5 font-medium">{colTasks.length}</span>
            </div>
            <div className="space-y-2 min-h-[200px]">
              {colTasks.length === 0 ? (
                <div className="flex items-center justify-center h-24 border-2 border-dashed border-muted rounded-xl">
                  <p className="text-xs text-muted-foreground">خالی</p>
                </div>
              ) : colTasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
