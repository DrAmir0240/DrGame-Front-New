import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
  PurchaseOrder,
  PurchaseOrderFilters,
  CreatePurchaseOrderFormData,
} from "../types";

export type {
  PurchaseOrder,
  PurchaseOrderFilters,
  CreatePurchaseOrderFormData,
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

export function usePurchaseOrders(filters?: PurchaseOrderFilters) {
  return useQuery<PurchaseOrder[]>({
    queryKey: ["inventory", "purchase-orders", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<
        PurchaseOrder[] | { results: PurchaseOrder[] }
      >("/inventory/purchase-orders/", { params });
      return Array.isArray(data) ? data : data.results ?? [];
    },
  });
}

export function usePurchaseOrderDetail(id: number | null) {
  return useQuery<PurchaseOrder>({
    queryKey: ["inventory", "purchase-orders", id],
    queryFn: async () => {
      const { data } = await api.get<PurchaseOrder>(
        `/inventory/purchase-orders/${id}/`
      );
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePurchaseOrderFormData) =>
      api.post("/inventory/purchase-orders/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "purchase-orders"] });
      toast.success("سفارش خرید ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد سفارش خرید"),
  });
}

export function useUpdatePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
      api.patch(`/inventory/purchase-orders/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "purchase-orders"] });
      toast.success("سفارش خرید بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی سفارش خرید"),
  });
}

export function useDeletePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/inventory/purchase-orders/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "purchase-orders"] });
      toast.success("سفارش خرید حذف شد");
    },
    onError: () => toast.error("خطا در حذف سفارش خرید"),
  });
}

export function useReceivePurchaseOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.post(`/inventory/purchase-orders/${id}/receive/`, {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["inventory", "purchase-orders"] });
      toast.success("سفارش دریافت شد و موجودی افزایش یافت");
    },
    onError: () => toast.error("خطا در دریافت سفارش"),
  });
}
