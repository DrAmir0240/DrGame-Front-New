import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
  PaginatedResponse,
  Employee,
  EmployeeDetail,
  EmployeeFile,
  EmployeeFormData,
  EmployeeFilters,
} from "../types";

function buildParams(filters?: Record<string, unknown>): Record<string, string> {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      params[key] = String(value);
    }
  }
  return params;
}

// ─── Employee List ───

export function useEmployeeList(filters?: EmployeeFilters) {
  return useQuery<PaginatedResponse<Employee>>({
    queryKey: ["hr", "employees", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Employee>>("/hr/employees/", { params });
      return data;
    },
  });
}

// ─── Employee Detail ───

export function useEmployeeDetail(id: number | null) {
  return useQuery<EmployeeDetail>({
    queryKey: ["hr", "employees", id],
    queryFn: async () => {
      const { data } = await api.get<EmployeeDetail>(`/hr/employees/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── Employee CRUD ───

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeFormData) => api.post("/hr/employees/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
      toast.success("کارمند با موفقیت ایجاد شد");
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<EmployeeFormData>) =>
      api.patch(`/hr/employees/${id}/update/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
      toast.success("کارمند با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/hr/employees/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
      toast.success("کارمند با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف کارمند"),
  });
}

// ─── Employee Files ───

export function useEmployeeFiles(employeeId: number | null) {
  return useQuery<PaginatedResponse<EmployeeFile>>({
    queryKey: ["hr", "employees", employeeId, "files"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<EmployeeFile>>(
        `/hr/employees/${employeeId}/files/`
      );
      return data;
    },
    enabled: !!employeeId,
  });
}

export function useUploadEmployeeFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/hr/employees/files/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
      toast.success("فایل با موفقیت آپلود شد");
    },
  });
}

export function useDeleteEmployeeFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/hr/employees/files/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "employees"] });
      toast.success("فایل با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف فایل"),
  });
}
