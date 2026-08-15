import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { toastApiError } from "@/utils/errors";
import { PaginatedResponse } from "@/features/admin/website-home/types";
import type { BlogCategory } from "../../types";

const LIMIT = 10;

function buildParams(filters?: Record<string, unknown>) {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      params[key] = String(value);
    }
  }
  return params;
}

export function useBlogCategories(filters?: {
  limit?: number;
  offset?: number;
  search?: string;
}) {
  return useQuery<PaginatedResponse<BlogCategory>>({
    queryKey: ["admin", "blog", "categories", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<BlogCategory>>(
        "/website/employee/blog/categories/",
        { params: buildParams(filters as Record<string, unknown>) }
      );
      return data;
    },
  });
}

export function useCreateBlogCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string }) =>
      api.post("/website/employee/blog/categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      toast.success("دسته‌بندی بلاگ با موفقیت ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد دسته‌بندی بلاگ"),
  });
}

export function useUpdateBlogCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { title: string; description?: string };
    }) => api.patch(`/website/employee/blog/categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      toast.success("دسته‌بندی بلاگ با موفقیت بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی دسته‌بندی بلاگ"),
  });
}

export function useDeleteBlogCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/blog/categories/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

export { LIMIT };
