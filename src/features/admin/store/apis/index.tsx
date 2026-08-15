import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { toastApiError } from "@/utils/errors";
import { PaginatedResponse } from "@/features/admin/website-home/types";
import type {
  StoreProduct,
  StoreProductCategory,
  StoreGame,
  GameCategory,
} from "../types";

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

// ------------------------- Store Products -------------------------

export function useStoreProducts(filters?: {
  limit?: number;
  offset?: number;
}) {
  return useQuery<PaginatedResponse<StoreProduct>>({
    queryKey: ["admin", "store", "products", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<StoreProduct>>(
        "/website/employee/products/",
        { params: buildParams(filters as Record<string, unknown>) }
      );
      return data;
    },
  });
}

export function useCreateStoreProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; product_id: number }) =>
      api.post("/website/employee/products/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "products"] });
      toast.success("محصول فروشگاه با موفقیت ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد محصول فروشگاه"),
  });
}

export function useUpdateStoreProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { title: string; product_id: number };
    }) => api.patch(`/website/employee/products/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "products"] });
      toast.success("محصول فروشگاه با موفقیت بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی محصول فروشگاه"),
  });
}

export function useDeleteStoreProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/products/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "products"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ------------------------- Store Product Categories -------------------------

export function useStoreProductCategories() {
  return useQuery<StoreProductCategory[]>({
    queryKey: ["admin", "store", "product-categories"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<StoreProductCategory>>(
        "/website/employee/product-categories/"
      );
      return data.results;
    },
  });
}

export function useCreateStoreProductCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string }) =>
      api.post("/website/employee/product-categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "product-categories"] });
      toast.success("دسته‌بندی کالا با موفقیت ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد دسته‌بندی کالا"),
  });
}

export function useUpdateStoreProductCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { title: string } }) =>
      api.patch(`/website/employee/product-categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "product-categories"] });
      toast.success("دسته‌بندی کالا با موفقیت بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی دسته‌بندی کالا"),
  });
}

export function useDeleteStoreProductCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/product-categories/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "product-categories"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ------------------------- Store Games -------------------------

export function useStoreGames(filters?: { limit?: number; offset?: number }) {
  return useQuery<PaginatedResponse<StoreGame>>({
    queryKey: ["admin", "store", "games", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<StoreGame>>(
        "/website/employee/games/",
        { params: buildParams(filters as Record<string, unknown>) }
      );
      return data;
    },
  });
}

export function useCreateStoreGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/website/employee/games/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "games"] });
      toast.success("بازی با موفقیت ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد بازی"),
  });
}

export function useUpdateStoreGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/website/employee/games/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "games"] });
      toast.success("بازی با موفقیت بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی بازی"),
  });
}

export function useDeleteStoreGame() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/website/employee/games/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "games"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ------------------------- Game Categories -------------------------

export function useStoreGameCategories() {
  return useQuery<GameCategory[]>({
    queryKey: ["admin", "store", "game-categories"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<GameCategory>>(
        "/website/employee/game-categories/"
      );
      return data.results;
    },
  });
}

export function useCreateStoreGameCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string }) =>
      api.post("/website/employee/game-categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "game-categories"] });
      toast.success("دسته‌بندی بازی با موفقیت ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد دسته‌بندی بازی"),
  });
}

export function useUpdateStoreGameCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: { title: string; description: string };
    }) => api.patch(`/website/employee/game-categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "game-categories"] });
      toast.success("دسته‌بندی بازی با موفقیت بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی دسته‌بندی بازی"),
  });
}

export function useDeleteStoreGameCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/game-categories/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "store", "game-categories"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

export { LIMIT };
