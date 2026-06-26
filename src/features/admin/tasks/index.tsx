"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import moment from "moment";
import type { Task, TaskStatus } from "./types";
import { mockTasks, mockStaff, mockBranches } from "./constants";
import TaskStats from "./components/TaskStats";
import TaskKanban from "./components/TaskKanban";
import TaskList from "./components/TaskList";
import TaskFormDialog from "./components/TaskFormDialog";

export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("kanban");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  function handleCreate(data: any) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: data.title || "",
      description: data.description,
      priority: data.priority || "normal",
      status: "todo",
      assigned_to_name: data.assigned_to_name,
      assigned_to_id: data.assigned_to_id,
      branch_id: data.branch_id,
      due_date: data.due_date,
      tags: data.tags,
      created_date: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setOpen(false);
  }

  function handleStatusChange(task: Task, status: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status } : t)));
  }

  function handleDelete(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const overdue = tasks.filter((t) => t.due_date && moment(t.due_date).isBefore(moment(), "day") && t.status !== "done" && t.status !== "cancelled").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  return (
    <div>
      <PageHeader title="تسک‌ها و وظایف" description={`${inProgress} درحال انجام · ${overdue} سررسیدشده`}>
        <div className="flex gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-sm transition-colors ${view === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              کانبان
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-sm transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              لیست
            </button>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> تسک جدید
          </Button>
        </div>
      </PageHeader>

      <TaskStats tasks={tasks} />

      {view === "kanban" ? (
        <TaskKanban
          tasks={tasks}
          isLoading={false}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <TaskList
          tasks={tasks}
          isLoading={false}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      <TaskFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreate}
        staff={mockStaff}
        branches={mockBranches}
        isPending={false}
      />
    </div>
  );
}
