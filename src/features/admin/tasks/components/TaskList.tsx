"use client";

import { useState } from "react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Skeleton } from "@/components/ui";
import { Search } from "lucide-react";
import TaskCard from "./TaskCard";
import type { Task, TaskStatus } from "../types";
import { statusOptions, priorityOptions } from "../constants";

interface Props {
  tasks: Task[];
  isLoading: boolean;
  onStatusChange: (task: Task, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, isLoading, onStatusChange, onDelete }: Props) {
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = tasks.filter(t => {
    const matchSearch = !search || t.title?.includes(search) || t.assigned_to_name?.includes(search);
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    return matchSearch && matchPriority && matchStatus;
  });

  if (isLoading) {
    return <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input placeholder="جستجو..." value={search} onChange={e => setSearch(e.target.value)} className="pr-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue placeholder="وضعیت" /></SelectTrigger>
          <SelectContent>
            {statusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32"><SelectValue placeholder="اولویت" /></SelectTrigger>
          <SelectContent>
            {priorityOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">تسکی یافت نشد</p>
        ) : filtered.map(task => (
          <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
