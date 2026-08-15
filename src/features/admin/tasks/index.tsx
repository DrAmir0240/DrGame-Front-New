"use client";

import { useState } from "react";
import { PageHeader, ConfirmModal } from "@/components/shared";
import { Button } from "@/components/ui";
import { toastApiError } from "@/utils/errors";
import { Plus, Building2 } from "lucide-react";
import moment from "moment";
import type { Task, TaskStatus } from "./types";
import { useTaskList, useUpdateTaskStatus, useCreatePersonalTask, useCreateOrganizeTask, useUpdatePersonalTask, useUpdateOrganizeTask, useDeletePersonalTask, useDeleteOrganizeTask } from "./apis";
import TaskStats from "./components/TaskStats";
import TaskKanban from "./components/TaskKanban";
import TaskList from "./components/TaskList";
import TaskFormDialog from "./components/TaskFormDialog";

export default function TasksPage() {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState<"Personal" | "Organize">("Personal");
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [view, setView] = useState("kanban");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type?: string; title?: string } | null>(null);
  const { data: tasks = [], isLoading } = useTaskList();
  const updateStatus = useUpdateTaskStatus();
  const createPersonalTask = useCreatePersonalTask();
  const createOrganizeTask = useCreateOrganizeTask();
  const updatePersonalTask = useUpdatePersonalTask();
  const updateOrganizeTask = useUpdateOrganizeTask();
  const deletePersonalTask = useDeletePersonalTask();
  const deleteOrganizeTask = useDeleteOrganizeTask();

  function handleOpenCreate(type: "Personal" | "Organize") {
    setEditTask(null);
    setFormType(type);
    setOpen(true);
  }

  function handleOpenEdit(task: Task) {
    setEditTask(task);
    setFormType(task.type === "Organize" ? "Organize" : "Personal");
    setOpen(true);
  }

  async function handleSubmit(data: any) {
    const createTask = formType === "Organize" ? createOrganizeTask : createPersonalTask;
    const updateTask = formType === "Organize" ? updateOrganizeTask : updatePersonalTask;
    const { voice, ...rest } = data;
    try {
      let res: { status: number } | undefined;
      if (voice instanceof File) {
        const fd = new FormData();
        Object.entries(rest).forEach(([k, v]) => {
          if (v !== undefined && v !== null) fd.append(k, v as string);
        });
        fd.append("voice", voice, voice.name);
        if (editTask) {
          res = await updateTask.mutateAsync({ id: Number(editTask.id), data: fd });
        } else {
          res = await createTask.mutateAsync(fd);
        }
      } else {
        const clean = Object.fromEntries(Object.entries(rest).filter(([, v]) => v !== undefined && v !== null));
        if (editTask) {
          res = await updateTask.mutateAsync({ id: Number(editTask.id), ...clean });
        } else {
          res = await createTask.mutateAsync(clean);
        }
      }
      if (res?.status === 200) setOpen(false);
    } catch (err: any) {
      toastApiError(err, "خطایی رخ داد");
    }
  }

  function handleStatusChange(task: Task, status: TaskStatus) {
    updateStatus.mutate({ id: Number(task.id), status });
  }

  function handleDelete(id: string, type?: string) {
    const task = tasks.find((t) => t.id === id);
    setDeleteTarget({ id, type, title: task?.title });
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const m = deleteTarget.type === "Organize" ? deleteOrganizeTask : deletePersonalTask;
    try {
      await m.mutateAsync(Number(deleteTarget.id));
    } catch {}
    setDeleteTarget(null);
  }

  const isPending = createPersonalTask.isPending || createOrganizeTask.isPending || updatePersonalTask.isPending || updateOrganizeTask.isPending;
  const overdue = tasks.filter((t) => t.due_date && moment(t.due_date).isBefore(moment(), "day") && t.status !== "done" && t.status !== "cancelled").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;

  return (
    <div>
      <PageHeader title="تسک‌ها و وظایف" description={`${inProgress} درحال انجام · ${overdue} سررسیدشده`}>
        <div className="flex gap-2">
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
            <Button
              variant={view === "kanban" ? "default" : "ghost"}
              onClick={() => setView("kanban")}
              className="rounded-none px-3 py-1.5 h-auto text-sm"
            >
              کانبان
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              onClick={() => setView("list")}
              className="rounded-none px-3 py-1.5 h-auto text-sm"
            >
              لیست
            </Button>
          </div>
          <Button onClick={() => handleOpenCreate("Personal")} className="gap-2">
            <Plus className="w-4 h-4" /> تسک جدید
          </Button>
          <Button onClick={() => handleOpenCreate("Organize")} variant="outline" className="gap-2">
            <Building2 className="w-4 h-4" /> تسک سازمانی
          </Button>
        </div>
      </PageHeader>

      <TaskStats tasks={tasks} />

      {view === "kanban" ? (
        <TaskKanban
          tasks={tasks}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      ) : (
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onStatusChange={handleStatusChange}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      <TaskFormDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        isPending={isPending}
        editTask={editTask}
        defaultType={formType}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deletePersonalTask.isPending || deleteOrganizeTask.isPending}
        message={deleteTarget?.title ? `آیا از حذف "${deleteTarget.title}" اطمینان دارید؟` : undefined}
      />
    </div>
  );
}
