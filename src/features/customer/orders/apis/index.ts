import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type { OrderBase, OrderType, PaginatedResponse } from "../types";

function buildParams(filters?: Record<string, unknown>) {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      params[key] = String(value);
    }
  }
  return params;
}

// ─── List (همه یا فیلتر type) ───

export function useOrders(filters?: {
  type?: OrderType | "all";
  page?: number;
  limit?: number;
}) {
  return useQuery<PaginatedResponse<OrderBase>>({
    queryKey: ["orders", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<OrderBase>>(
        "/customer/orders/",
        { params }
      );
      return data;
    },
  });
}

// ─── Product Orders ───

export function useProductOrders(filters?: { page?: number }) {
  return useQuery<PaginatedResponse<OrderBase>>({
    queryKey: ["orders", "products", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get("/customer/orders/products/", { params });
      return data;
    },
  });
}

export function useProductOrderDetail(id: number | null) {
  return useQuery<OrderBase>({
    queryKey: ["orders", "products", id],
    queryFn: async () => {
      const { data } = await api.get(`/customer/orders/products/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── Sony Orders ───

export function useSonyOrders(filters?: { page?: number }) {
  return useQuery<PaginatedResponse<OrderBase>>({
    queryKey: ["orders", "sony", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get("/customer/orders/sony/", { params });
      return data;
    },
  });
}

export function useSonyOrderDetail(id: number | null) {
  return useQuery<OrderBase>({
    queryKey: ["orders", "sony", id],
    queryFn: async () => {
      const { data } = await api.get(`/customer/orders/sony/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── Repair Orders ───

export function useRepairOrders(filters?: { page?: number }) {
  return useQuery<PaginatedResponse<OrderBase>>({
    queryKey: ["orders", "repair", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get("/customer/orders/repair/", { params });
      return data;
    },
  });
}

export function useRepairOrderDetail(id: number | null) {
  return useQuery<OrderBase>({
    queryKey: ["orders", "repair", id],
    queryFn: async () => {
      const { data } = await api.get(`/customer/orders/repair/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── Create (در صورت نیاز) ───

export function useCreateProductOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      api.post("/customer/orders/products/create/", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("سفارش با موفقیت ثبت شد");
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "خطا در ثبت سفارش";
      toast.error(msg);
    },
  });
}