import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
  OrderPrefix,
  Category,
  StageListItem,
  StageDetail,
  StageQueue,
  OrderCard,
  SonyAccountOrderDetail,
  RepairOrderDetail,
  ProductOrderDetail,
  OrderAction,
  ExecuteActionResponse,
  AdvanceStageResponse,
} from "../types";

const BASE = "/orders";

function prefixUrl(prefix: OrderPrefix, path: string) {
  return `${BASE}/${prefix}/${path}`;
}

function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in data && Array.isArray((data as any).results)) {
    return (data as any).results as T[];
  }
  return [];
}

// ── Config: Categories ──

export function useCategoryList(prefix: OrderPrefix) {
  return useQuery<Category[]>({
    queryKey: ["categories", prefix],
    queryFn: async () => {
      const { data } = await api.get(prefixUrl(prefix, "categories/"));
      return extractList<Category>(data);
    },
  });
}

export function useCategoryStages(prefix: OrderPrefix, categoryId: number | null) {
  return useQuery<StageListItem[]>({
    queryKey: ["category-stages", prefix, categoryId],
    queryFn: async () => {
      const { data } = await api.get(
        prefixUrl(prefix, `categories/${categoryId}/stages/`)
      );
      return extractList<StageListItem>(data);
    },
    enabled: categoryId !== null,
  });
}

export function useCreateCategory(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(prefixUrl(prefix, "categories/create/"), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories", prefix] });
      toast.success("دسته‌بندی با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد دسته‌بندی"),
  });
}

export function useUpdateCategory(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; [key: string]: unknown }) =>
      api.patch(prefixUrl(prefix, `categories/${id}/update/`), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories", prefix] });
      toast.success("دسته‌بندی با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی دسته‌بندی"),
  });
}

export function useDeleteCategory(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(prefixUrl(prefix, `categories/${id}/delete/`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories", prefix] });
      toast.success("دسته‌بندی با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف دسته‌بندی"),
  });
}

// ── Config: Stages ──

export function useStageDetail(prefix: OrderPrefix, stageId: number | null) {
  return useQuery<StageDetail>({
    queryKey: ["stage-detail", prefix, stageId],
    queryFn: async () => {
      const { data } = await api.get<StageDetail>(
        prefixUrl(prefix, `stages/${stageId}/`)
      );
      return data;
    },
    enabled: stageId !== null,
  });
}

export function useCreateStage(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(prefixUrl(prefix, "stages/create/"), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("مرحله با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد مرحله"),
  });
}

export function useUpdateStage(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; [key: string]: unknown }) =>
      api.patch(prefixUrl(prefix, `stages/${id}/update/`), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["stage-detail"] });
      toast.success("مرحله با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی مرحله"),
  });
}

export function useDeleteStage(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(prefixUrl(prefix, `stages/${id}/delete/`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast.success("مرحله با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف مرحله"),
  });
}

// ── Config: Stage Actions ──

export function useCreateAction(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post(prefixUrl(prefix, "stage-actions/create/"), data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stage-detail"] });
      toast.success("اکشن با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد اکشن"),
  });
}

export function useUpdateAction(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; [key: string]: unknown }) =>
      api.patch(prefixUrl(prefix, `stage-actions/${id}/update/`), payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stage-detail"] });
      toast.success("اکشن با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی اکشن"),
  });
}

export function useDeleteAction(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(prefixUrl(prefix, `stage-actions/${id}/delete/`)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stage-detail"] });
      toast.success("اکشن با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف اکشن"),
  });
}

// ── Employee: My Stages ──

export function useMyStages(prefix: OrderPrefix) {
  return useQuery<StageQueue[]>({
    queryKey: ["my-stages", prefix],
    queryFn: async () => {
      const { data } = await api.get(prefixUrl(prefix, "my-stages/"));
      return extractList<StageQueue>(data);
    },
  });
}

// ── Employee: Orders by Stage ──

export function useOrdersByStage(prefix: OrderPrefix, stageId: number | null) {
  return useQuery<OrderCard[]>({
    queryKey: ["orders-by-stage", prefix, stageId],
    queryFn: async () => {
      const { data } = await api.get(
        prefixUrl(prefix, `orders/by-stage/${stageId}/`)
      );
      return extractList<OrderCard>(data);
    },
    enabled: stageId !== null,
  });
}

// ── Employee: Order Detail ──

type OrderDetailUnion = SonyAccountOrderDetail | RepairOrderDetail | ProductOrderDetail;

export function useOrderDetail(prefix: OrderPrefix, orderId: number | null) {
  return useQuery<OrderDetailUnion>({
    queryKey: ["order-detail", prefix, orderId],
    queryFn: async () => {
      const { data } = await api.get<OrderDetailUnion>(
        prefixUrl(prefix, `orders/${orderId}/`)
      );
      return data;
    },
    enabled: orderId !== null,
  });
}

// ── Employee: Order Actions ──

export function useOrderActions(prefix: OrderPrefix, orderId: number | null) {
  return useQuery<OrderAction[]>({
    queryKey: ["order-actions", prefix, orderId],
    queryFn: async () => {
      const { data } = await api.get(
        prefixUrl(prefix, `orders/${orderId}/actions/`)
      );
      return extractList<OrderAction>(data);
    },
    enabled: orderId !== null,
  });
}

// ── Employee: Execute Action ──

export function useExecuteAction(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      ...payload
    }: {
      orderId: number;
      action_id: number;
      value?: unknown;
      item_id?: number;
      note?: string;
    }) =>
      api.post<ExecuteActionResponse>(
        prefixUrl(prefix, `orders/${orderId}/execute-action/`),
        payload
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["order-actions"] });
      qc.invalidateQueries({ queryKey: ["order-detail"] });
    },
  });
}

// ── Employee: Advance Stage ──

export function useAdvanceStage(prefix: OrderPrefix) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      note,
    }: {
      orderId: number;
      note?: string;
    }) =>
      api.post<AdvanceStageResponse>(
        prefixUrl(prefix, `orders/${orderId}/advance-stage/`),
        { note }
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["order-detail"] });
      qc.invalidateQueries({ queryKey: ["order-actions"] });
      qc.invalidateQueries({ queryKey: ["orders-by-stage"] });
      toast.success("مرحله با موفقیت تغییر کرد");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail || "خطا در تغییر مرحله";
      toast.error(msg);
    },
  });
}
