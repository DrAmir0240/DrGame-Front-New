import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { PaginatedResponse } from "@/features/admin/website-home/types";
import type { BlogPost, BlogCategory } from "../..//types";

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

// ------------------------- Blog Posts -------------------------

export function useBlogPosts(filters?: {
  limit?: number;
  offset?: number;
  status?: string;
  category?: number | string;
}) {
  return useQuery<PaginatedResponse<BlogPost>>({
    queryKey: ["admin", "blog", "posts", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<BlogPost>>(
        "/website/employee/blog/",
        { params: buildParams(filters as Record<string, unknown>) }
      );
      return data;
    },
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/website/employee/blog/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
      toast.success("پست بلاگ با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد پست بلاگ"),
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/website/employee/blog/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
      toast.success("پست بلاگ با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی پست بلاگ"),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/website/employee/blog/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
      toast.success("حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

// ------------------------- Blog Categories -------------------------

export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: ["admin", "blog", "categories"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<BlogCategory>>(
        "/website/employee/blog/categories/"
      );
      return data.results;
    },
  });
}

export function useCreateBlogCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string }) =>
      api.post("/website/employee/blog/categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      toast.success("دسته‌بندی بلاگ با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد دسته‌بندی بلاگ"),
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
      payload: { title: string; description: string };
    }) => api.patch(`/website/employee/blog/categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      toast.success("دسته‌بندی بلاگ با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی دسته‌بندی بلاگ"),
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
    onError: () => toast.error("خطا در حذف"),
  });
}

export { LIMIT };
