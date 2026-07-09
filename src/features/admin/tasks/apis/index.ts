import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type { Task } from "../types";

export interface TaskItem {
  id: number;
  employee: number;
  employee_name: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  has_reward: boolean;
  reward_amount: number;
  approved: boolean;
  start_date: string;
  deadline: string;
  created_at: string;
}

export interface ChoicesData {
  employees: { id: number; title: string }[];
  status_choices: { value: string; label: string }[];
  priority_choices: { value: string; label: string }[];
  type_choices: { value: string; label: string }[];
}

function mapTask(item: TaskItem): Task {
  const statusMap: Record<string, Task["status"]> = {
    planed: "todo",
    in_progress: "in_progress",
    done: "done",
  };
  const priorityMap: Record<string, Task["priority"]> = {
    immediate: "urgent",
    high: "high",
    normal: "normal",
    low: "low",
    medium: "normal",
    very_low: "low",
  };

  return {
    id: String(item.id),
    title: item.title,
    description: undefined,
    priority: priorityMap[item.priority] || "normal",
    status: statusMap[item.status] || "todo",
    assigned_to_name: item.employee_name,
    assigned_to_id: String(item.employee),
    due_date: item.deadline,
    start_date: item.start_date,
    created_date: item.created_at,
    type: item.type,
  };
}

interface TaskListResponse {
  results: TaskItem[];
}

export function useTaskChoices() {
  return useQuery<ChoicesData>({
    queryKey: ["task-choices"],
    queryFn: async () => {
      const { data } = await api.get<ChoicesData>("/task-manager/choices/");
      return data;
    },
  });
}

export function useCreatePersonalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown> | FormData) =>
      api.post("/task-manager/personal/add/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-list"] });
      toast.success("تسک با موفقیت ایجاد شد");
    },
  });
}

export function useCreateOrganizeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown> | FormData) =>
      api.post("/task-manager/organize/add/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-list"] });
      toast.success("تسک سازمانی با موفقیت ایجاد شد");
    },
  });
}

export function useUpdatePersonalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; data?: unknown; [key: string]: unknown }) =>
      api.patch(`/task-manager/personal/${id}/`, payload.data instanceof FormData ? payload.data : payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-list"] });
      toast.success("تسک با موفقیت بروزرسانی شد");
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/task-manager/personal/${id}/`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-list"] });
      toast.success("وضعیت تسک با موفقیت تغییر کرد");
    },
  });
}

export function useUpdateOrganizeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; data?: unknown; [key: string]: unknown }) =>
      api.patch(`/task-manager/organize/${id}/`, payload.data instanceof FormData ? payload.data : payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-list"] });
      toast.success("تسک سازمانی با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeletePersonalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/task-manager/personal/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-list"] });
      toast.success("تسک با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطا در حذف تسک");
    },
  });
}

export function useDeleteOrganizeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/task-manager/organize/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-list"] });
      toast.success("تسک سازمانی با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطا در حذف تسک سازمانی");
    },
  });
}

export function useTaskList() {
  return useQuery<Task[]>({
    queryKey: ["task-list"],
    queryFn: async () => {
      const { data } = await api.get<TaskListResponse>("/task-manager/list/");
      return (data.results || []).map(mapTask);
    },
  });
}
