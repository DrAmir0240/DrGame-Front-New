"use client";

import { Badge, Button } from "@/components/ui";
import { CheckCircle2, Circle, Clock, AlertTriangle, Calendar, Trash2, User, Pencil, Building2, UserCircle } from "lucide-react";
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

const isOrganize = (t: Task) => t.type === "Organize";

interface Props {
  task: Task;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string, type?: string) => void;
}

export default function TaskCard({ task, onStatusChange, onEdit, onDelete }: Props) {
  const StatusIcon = statusIcons[task.status] || Circle;
  const isOverdue = task.due_date && moment(task.due_date).isBefore(moment(), "day") && task.status !== "done" && task.status !== "cancelled";
  const org = isOrganize(task);

  return (
    <div className={cn(
      "rounded-xl p-3 hover:shadow-md transition-all group cursor-default border",
      org
        ? "bg-amber-50/60 border-amber-200"
        : "bg-sky-50/60 border-sky-200",
      task.status === "done" && "opacity-60 bg-neutral-50 border-neutral-200",
      isOverdue && (org ? "border-error-200 bg-error-50/40" : "border-error-200 bg-error-50/40")
    )}>
      <div className="flex items-start gap-2">
        <button
          onClick={() => onStatusChange(task, task.status === "done" ? "todo" : "done")}
          className={cn("mt-0.5 shrink-0 hover:opacity-70 transition-opacity", statusColors[task.status])}
        >
          <StatusIcon className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={cn("font-medium text-sm leading-tight", task.status === "done" && "line-through text-muted-foreground")}>{task.title}</p>
          </div>
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
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onEdit(task)}>
            <Pencil className="w-3 h-3 text-muted-foreground" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onDelete(task.id, task.type)}>
            <Trash2 className="w-3 h-3 text-error" />
          </Button>
        </div>
      </div>
      {task.status === "todo" && (
        <div className="mt-2 flex items-center justify-between">
          <span className={cn(
            "inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded leading-none",
            org ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
          )}>
            {org ? <Building2 className="w-2.5 h-2.5" /> : <UserCircle className="w-2.5 h-2.5" />}
            {org ? "سازمانی" : "شخصی"}
          </span>
          <Button size="sm" variant="outline" className="h-6 text-xs px-2 hover:bg-secondary-50 hover:border-secondary-500" onClick={() => onStatusChange(task, "in_progress")}>شروع کار</Button>
        </div>
      )}
      {task.status === "in_progress" && (
        <div className="mt-2 flex items-center justify-between">
          <span className={cn(
            "inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded leading-none",
            org ? "bg-amber-100 text-amber-700" : "bg-sky-100 text-sky-700"
          )}>
            {org ? <Building2 className="w-2.5 h-2.5" /> : <UserCircle className="w-2.5 h-2.5" />}
            {org ? "سازمانی" : "شخصی"}
          </span>
          <Button size="sm" variant="outline" className="h-6 text-xs px-2 text-emerald-600 border-emerald-300 hover:bg-success-50" onClick={() => onStatusChange(task, "done")}>تکمیل شد</Button>
        </div>
      )}
    </div>
  );
}
