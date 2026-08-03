// src/features/customer/wishlist/apis.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type { WishlistItem, PaginatedResponse } from "../types";

// ─── List ───

export function useWishlist(filters?: { page?: number; limit?: number }) {
  return useQuery<PaginatedResponse<WishlistItem> | WishlistItem[]>({
    queryKey: ["wishlist", filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters?.page) params.page = String(filters.page);
      if (filters?.limit) params.limit = String(filters.limit);

      const { data } = await api.get("/customer/wishlist/", { params });
      return data;
    },
  });
}

// ─── Add ───

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { content_type: string; object_id: number }) =>
      api.post("/customer/wishlist/add/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("به علاقه‌مندی‌ها اضافه شد");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "خطا در افزودن به علاقه‌مندی‌ها";
      toast.error(msg);
    },
  });
}

// ─── Remove ───

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/customer/wishlist/remove/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("از علاقه‌مندی‌ها حذف شد");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "خطا در حذف از علاقه‌مندی‌ها";
      toast.error(msg);
    },
  });
}

// ─── Toggle ───

export function useToggleWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { content_type: string; object_id: number }) =>
      api.post("/customer/wishlist/toggle/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      // پیام دقیق‌تر رو می‌تونی بر اساس پاسخ بک‌اند تنظیم کنی
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "خطا در تغییر وضعیت علاقه‌مندی";
      toast.error(msg);
    },
  });
}