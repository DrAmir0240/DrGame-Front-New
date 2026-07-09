import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type { Task } from "../../tasks/types";

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

export function useDailyTaskChoices() {
  return useQuery<ChoicesData>({
    queryKey: ["daily-task-choices"],
    queryFn: async () => {
      const { data } = await api.get<ChoicesData>("/task-manager/choices/");
      return data;
    },
  });
}

export function useCreateDailyPersonalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown> | FormData) =>
      api.post("/task-manager/daily-tasks/add/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-task-list"] });
      toast.success("وظیفه روزانه با موفقیت ایجاد شد");
    },
  });
}

export function useCreateDailyOrganizeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown> | FormData) =>
      api.post("/task-manager/daily-tasks/organize/add/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-task-list"] });
      toast.success("وظیفه روزانه سازمانی با موفقیت ایجاد شد");
    },
  });
}

export function useUpdateDailyPersonalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; data?: unknown; [key: string]: unknown }) =>
      api.patch(`/task-manager/daily-tasks/${id}/`, payload.data instanceof FormData ? payload.data : payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-task-list"] });
      toast.success("وظیفه روزانه با موفقیت بروزرسانی شد");
    },
  });
}

export function useUpdateDailyOrganizeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; data?: unknown; [key: string]: unknown }) =>
      api.patch(`/task-manager/daily-tasks/organize/${id}`, payload.data instanceof FormData ? payload.data : payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-task-list"] });
      toast.success("وظیفه روزانه سازمانی با موفقیت بروزرسانی شد");
    },
  });
}

export function useUpdateDailyTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/task-manager/daily-tasks/${id}/`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-task-list"] });
      toast.success("وضعیت وظیفه روزانه با موفقیت تغییر کرد");
    },
  });
}

export function useDeleteDailyPersonalTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/task-manager/daily-tasks/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-task-list"] });
      toast.success("وظیفه روزانه با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطا در حذف وظیفه روزانه");
    },
  });
}

export function useDeleteDailyOrganizeTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/task-manager/daily-tasks/organize/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-task-list"] });
      toast.success("وظیفه روزانه سازمانی با موفقیت حذف شد");
    },
    onError: () => {
      toast.error("خطا در حذف وظیفه روزانه سازمانی");
    },
  });
}

export function useDailyTaskList() {
  return useQuery<Task[]>({
    queryKey: ["daily-task-list"],
    queryFn: async () => {
      const { data } = await api.get<TaskListResponse>("/task-manager/daily-tasks/list/");
      return (data.results || []).map(mapTask);
    },
  });
}
