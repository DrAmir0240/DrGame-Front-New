import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { LIMIT } from "../constants";
import type {
  PaginatedResponse,
  DocCategory,
  DocSubCategory,
  Document,
  RealAssetsCategory,
  RealAssetsSubCategory,
  RealAssets,
  DocFilters,
  RealAssetsFilters,
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

// ─── Document Categories ───

export function useDocCategories() {
  return useQuery<DocCategory[]>({
    queryKey: ["docs", "doc-categories"],
    queryFn: async () => {
      const { data } = await api.get<DocCategory[]>("/docs/docs/categories/");
      return data;
    },
  });
}

export function useCreateDocCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string }) =>
      api.post("/docs/docs/categories/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "doc-categories"] });
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد دسته‌بندی"),
  });
}

// ─── Document SubCategories ───

export function useDocSubCategories(categoryId?: number | null) {
  return useQuery<DocSubCategory[]>({
    queryKey: ["docs", "doc-sub-categories", categoryId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (categoryId) params.category = String(categoryId);
      const { data } = await api.get<DocSubCategory[]>("/docs/docs/sub-categories/", { params });
      return data;
    },
  });
}

export function useCreateDocSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string; category: number }) =>
      api.post("/docs/docs/sub-categories/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "doc-sub-categories"] });
      toast.success("زیردسته‌بندی با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد زیردسته‌بندی"),
  });
}

// ─── Documents ───

export function useDocumentList(filters?: DocFilters) {
  return useQuery<PaginatedResponse<Document>>({
    queryKey: ["docs", "documents", filters],
    queryFn: async () => {
      const params = buildParams({
        ...filters,
        limit: LIMIT,
      });
      const { data } = await api.get<PaginatedResponse<Document>>("/docs/docs/", { params });
      return data;
    },
  });
}

export function useDocumentDetail(id: number | null) {
  return useQuery<Document>({
    queryKey: ["docs", "document", id],
    queryFn: async () => {
      const { data } = await api.get<Document>(`/docs/docs/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/docs/docs/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "documents"] });
      toast.success("سند با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد سند"),
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/docs/docs/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "documents"] });
      toast.success("سند با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی سند"),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/docs/docs/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "documents"] });
      toast.success("سند با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف سند"),
  });
}

// ─── Real Assets Categories ───

export function useRealAssetCategories() {
  return useQuery<RealAssetsCategory[]>({
    queryKey: ["docs", "real-asset-categories"],
    queryFn: async () => {
      const { data } = await api.get<RealAssetsCategory[]>("/docs/real-assets/categories/");
      return data;
    },
  });
}

export function useCreateRealAssetCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string }) =>
      api.post("/docs/real-assets/categories/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "real-asset-categories"] });
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد دسته‌بندی"),
  });
}

// ─── Real Assets SubCategories ───

export function useRealAssetSubCategories(categoryId?: number | null) {
  return useQuery<RealAssetsSubCategory[]>({
    queryKey: ["docs", "real-asset-sub-categories", categoryId],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (categoryId) params.category = String(categoryId);
      const { data } = await api.get<RealAssetsSubCategory[]>("/docs/real-assets/sub-categories/", { params });
      return data;
    },
  });
}

export function useCreateRealAssetSubCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description?: string; category: number }) =>
      api.post("/docs/real-assets/sub-categories/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "real-asset-sub-categories"] });
      toast.success("زیردسته‌بندی با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد زیردسته‌بندی"),
  });
}

// ─── Real Assets ───

export function useRealAssetList(filters?: RealAssetsFilters) {
  return useQuery<PaginatedResponse<RealAssets>>({
    queryKey: ["docs", "real-assets", filters],
    queryFn: async () => {
      const params = buildParams({
        ...filters,
        limit: LIMIT,
      });
      const { data } = await api.get<PaginatedResponse<RealAssets>>("/docs/real-assets/", { params });
      return data;
    },
  });
}

export function useRealAssetDetail(id: number | null) {
  return useQuery<RealAssets>({
    queryKey: ["docs", "real-asset", id],
    queryFn: async () => {
      const { data } = await api.get<RealAssets>(`/docs/real-assets/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateRealAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/docs/real-assets/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "real-assets"] });
      toast.success("دارایی با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد دارایی"),
  });
}

export function useUpdateRealAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/docs/real-assets/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "real-assets"] });
      toast.success("دارایی با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی دارایی"),
  });
}

export function useDeleteRealAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/docs/real-assets/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["docs", "real-assets"] });
      toast.success("دارایی با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف دارایی"),
  });
}

// ─── Employees (for dropdown) ───

export function useEmployeeList() {
  return useQuery<{ id: number; first_name: string; last_name: string }[]>({
    queryKey: ["docs", "employees"],
    queryFn: async () => {
      const { data } = await api.get("/hr/employees/");
      return data?.results ?? data ?? [];
    },
  });
}
