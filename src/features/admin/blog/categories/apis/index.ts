import api from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBlogCategories = (params?: { limit?: number; offset?: number; search?: string }) => {
  return useQuery({
    queryKey: ["blog-categories", params],
    queryFn: () =>
      api.get("/api/admin/blog/categories/", { params }).then((r) => r.data),
  });
};

export const useCreateBlogCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      api.post("/api/admin/blog/categories/", data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-categories"] }),
  });
};

export const useUpdateBlogCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; title: string; description?: string }) =>
      apiClient.patch(`/api/admin/blog/categories/${id}/`, data).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-categories"] }),
  });
};

export const useDeleteBlogCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.delete(`/api/admin/blog/categories/${id}/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog-categories"] }),
  });
};