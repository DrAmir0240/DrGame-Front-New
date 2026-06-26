"use client";

import { Badge } from "@/components/ui";
import { Button } from "@/components/ui";
import { CheckCircle2, Circle, Clock, AlertTriangle, Calendar, Trash2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import moment from "moment";
import type { Task, TaskStatus } from "../types";
import { priorityConfig } from "../constants";

const statusIcons: Record<TaskStatus, typeof Circle> = {
  todo: Circle,
  in_progress: Clock,
  done: CheckCircle2,
  cancelled: AlertTriangle,
};

const statusColors: Record<TaskStatus, string> = {
  todo: "text-muted-foreground",
  in_progress: "text-blue-500",
  done: "text-emerald-500",
  cancelled: "text-destructive",
};

interface Props {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onStatusChange, onDelete }: Props) {
  const StatusIcon = statusIcons[task.status] || Circle;
  const isOverdue = task.due_date && moment(task.due_date).isBefore(moment(), "day") && task.status !== "done" && task.status !== "cancelled";

  return (
    <div className={cn(
      "bg-[#f8f0f1] border border-error-100 rounded-xl p-3 hover:shadow-md transition-all group cursor-default",
      task.status === "done" && "opacity-60",
      isOverdue && "border-neutral-0 bg-amber-100"
    )}>
      <div className="flex items-start gap-2">
        <button
          onClick={() => onStatusChange(task, task.status === "done" ? "todo" : "done")}
          className={cn("mt-0.5 shrink-0 hover:opacity-70 transition-opacity", statusColors[task.status])}
        >
          <StatusIcon className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium text-sm leading-tight", task.status === "done" && "line-through text-muted-foreground")}>{task.title}</p>
          {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <Badge variant="outline" className={`text-xs border px-1.5 py-0 ${priorityConfig[task.priority]?.color}`}>
              {priorityConfig[task.priority]?.label}
            </Badge>
            {task.assigned_to_name && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" />{task.assigned_to_name}
              </span>
            )}
            {task.due_date && (
              <span className={cn("text-xs flex items-center gap-1 font-medium", isOverdue ? "text-error " : "text-error-600")}>
                <Calendar className="w-3 h-3" />{moment(task.due_date).format("MM/DD")}
              </span>
            )}
          </div>
        </div>
        <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={() => onDelete(task.id)}>
          <Trash2 className="w-3 h-3 text-error" />
        </Button>
      </div>
      {task.status === "todo" && (
        <div className="mt-2 flex justify-end">
          <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={() => onStatusChange(task, "in_progress")}>شروع کار</Button>
        </div>
      )}
      {task.status === "in_progress" && (
        <div className="mt-2 flex justify-end">
          <Button size="sm" variant="outline" className="h-6 text-xs px-2 text-emerald-600 border-emerald-300" onClick={() => onStatusChange(task, "done")}>تکمیل شد</Button>
        </div>
      )}
    </div>
  );
}
