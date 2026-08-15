import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { toastApiError } from "@/utils/errors";
import type {
  BankAccount,
  BankAccountFormData,
  EmployeeRolesResponse,
  InvoiceCategory,
  InvoiceCategoryFormData,
  Permission,
  ProductOrderCategory,
  RepairOrderCategory,
  RoleDetail,
  RoleFormData,
  RoleListItem,
  SellMethod,
  SellMethodFormData,
  SonyBank,
  SonyOrderCategory,
  SonyOrderCategoryFormData,
} from "../types";

function buildParams(filters?: Record<string, unknown>): Record<string, string> {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = String(value);
    }
  }
  return params;
}

function unwrapList<T>(data: T[] | { results?: T[] } | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

// ─── Permissions ───

export function usePermissionsList(filters?: { module?: string; action?: string }) {
  return useQuery<Permission[]>({
    queryKey: ["settings", "permissions", filters],
    queryFn: async () => {
      const { data } = await api.get<Permission[] | { results?: Permission[] }>("/platform-settings/permissions/", {
        params: buildParams(filters as Record<string, unknown>),
      });
      return unwrapList(data);
    },
  });
}

// ─── Roles ───

export function useRolesList() {
  return useQuery<RoleListItem[]>({
    queryKey: ["settings", "roles"],
    queryFn: async () => {
      const { data } = await api.get<RoleListItem[] | { results?: RoleListItem[] }>("/platform-settings/roles/");
      return unwrapList(data);
    },
  });
}

export function useRoleDetail(id: number | null) {
  return useQuery<RoleDetail>({
    queryKey: ["settings", "roles", id],
    queryFn: async () => {
      const { data } = await api.get<RoleDetail>(`/platform-settings/roles/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: RoleFormData) => api.post("/platform-settings/roles/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "roles"] });
      toast.success("نقش با موفقیت ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد نقش"),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { role_name: string; description: string } }) =>
      api.patch(`/platform-settings/roles/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "roles"] });
      toast.success("نقش بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی نقش"),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/roles/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "roles"] });
      toast.success("نقش حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف نقش"),
  });
}

export function useAssignPermissionsToRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permission_ids }: { id: number; permission_ids: number[] }) =>
      api.post(`/platform-settings/roles/${id}/permissions/assign/`, { permission_ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "roles"] });
      toast.success("دسترسی‌ها اضافه شدند");
    },
    onError: (err) => toastApiError(err, "خطا در افزودن دسترسی‌ها"),
  });
}

export function useRemovePermissionsFromRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, permission_ids }: { id: number; permission_ids: number[] }) =>
      api.post(`/platform-settings/roles/${id}/permissions/remove/`, { permission_ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "roles"] });
      toast.success("دسترسی‌ها حذف شدند");
    },
    onError: (err) => toastApiError(err, "خطا در حذف دسترسی‌ها"),
  });
}

// ─── Employee Roles ───

export function useEmployeeRoles(employeePk: number | null) {
  return useQuery<RoleListItem[]>({
    queryKey: ["settings", "employee-roles", employeePk],
    queryFn: async () => {
      const { data } = await api.get<RoleListItem[] | { results?: RoleListItem[] }>(
        `/platform-settings/employees/${employeePk}/roles/`
      );
      return unwrapList(data);
    },
    enabled: !!employeePk,
  });
}

export function useAssignRolesToEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ employeePk, role_ids }: { employeePk: number; role_ids: number[] }) =>
      api.post<EmployeeRolesResponse>(`/platform-settings/employees/${employeePk}/roles/assign/`, { role_ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "employee-roles"] });
      toast.success("نقش‌ها به کارمند اختصاص یافت");
    },
    onError: (err) => toastApiError(err, "خطا در اختصاص نقش"),
  });
}

export function useRemoveRolesFromEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ employeePk, role_ids }: { employeePk: number; role_ids: number[] }) =>
      api.post<EmployeeRolesResponse>(`/platform-settings/employees/${employeePk}/roles/remove/`, { role_ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "employee-roles"] });
      toast.success("نقش‌ها حذف شدند");
    },
    onError: (err) => toastApiError(err, "خطا در حذف نقش"),
  });
}

// ─── Sony Order Categories ───

export function useSonyOrderCategories() {
  return useQuery<SonyOrderCategory[]>({
    queryKey: ["settings", "sony-order-categories"],
    queryFn: async () => {
      const { data } = await api.get<SonyOrderCategory[] | { results?: SonyOrderCategory[] }>(
        "/platform-settings/sony-order-categories/"
      );
      return unwrapList(data);
    },
  });
}

export function useCreateSonyOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SonyOrderCategoryFormData) => api.post("/platform-settings/sony-order-categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sony-order-categories"] });
      toast.success("دسته‌بندی ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد دسته‌بندی"),
  });
}

export function useUpdateSonyOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SonyOrderCategoryFormData }) =>
      api.patch(`/platform-settings/sony-order-categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sony-order-categories"] });
      toast.success("دسته‌بندی بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی"),
  });
}

export function useDeleteSonyOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/sony-order-categories/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sony-order-categories"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ─── Sell Methods ───

export function useSellMethods() {
  return useQuery<SellMethod[]>({
    queryKey: ["settings", "sell-methods"],
    queryFn: async () => {
      const { data } = await api.get<SellMethod[] | { results?: SellMethod[] }>("/platform-settings/sell-methods/");
      return unwrapList(data);
    },
  });
}

export function useCreateSellMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SellMethodFormData) => api.post("/platform-settings/sell-methods/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sell-methods"] });
      toast.success("روش فروش ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد روش فروش"),
  });
}

export function useUpdateSellMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: SellMethodFormData }) =>
      api.patch(`/platform-settings/sell-methods/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sell-methods"] });
      toast.success("روش فروش بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی"),
  });
}

export function useDeleteSellMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/sell-methods/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sell-methods"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ─── Product Order Categories ───

export function useProductOrderCategories() {
  return useQuery<ProductOrderCategory[]>({
    queryKey: ["settings", "product-order-categories"],
    queryFn: async () => {
      const { data } = await api.get<ProductOrderCategory[] | { results?: ProductOrderCategory[] }>(
        "/platform-settings/product-order-categories/"
      );
      return unwrapList(data);
    },
  });
}

export function useCreateProductOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string | null }) =>
      api.post("/platform-settings/product-order-categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "product-order-categories"] });
      toast.success("دسته‌بندی ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد"),
  });
}

export function useUpdateProductOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { title: string; description: string | null } }) =>
      api.patch(`/platform-settings/product-order-categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "product-order-categories"] });
      toast.success("دسته‌بندی بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی"),
  });
}

export function useDeleteProductOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/product-order-categories/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "product-order-categories"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ─── Repair Order Categories ───

export function useRepairOrderCategories() {
  return useQuery<RepairOrderCategory[]>({
    queryKey: ["settings", "repair-order-categories"],
    queryFn: async () => {
      const { data } = await api.get<RepairOrderCategory[] | { results?: RepairOrderCategory[] }>(
        "/platform-settings/repair-order-categories/"
      );
      return unwrapList(data);
    },
  });
}

export function useCreateRepairOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string | null }) =>
      api.post("/platform-settings/repair-order-categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "repair-order-categories"] });
      toast.success("دسته‌بندی ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد"),
  });
}

export function useUpdateRepairOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { title: string; description: string | null } }) =>
      api.patch(`/platform-settings/repair-order-categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "repair-order-categories"] });
      toast.success("دسته‌بندی بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی"),
  });
}

export function useDeleteRepairOrderCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/repair-order-categories/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "repair-order-categories"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ─── Sony Banks ───

export function useSonyBanks() {
  return useQuery<SonyBank[]>({
    queryKey: ["settings", "sony-banks"],
    queryFn: async () => {
      const { data } = await api.get<SonyBank[] | { results?: SonyBank[] }>("/platform-settings/sony-banks/");
      return unwrapList(data);
    },
  });
}

export function useCreateSonyBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; description: string | null }) =>
      api.post("/platform-settings/sony-banks/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sony-banks"] });
      toast.success("بانک سونی ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد"),
  });
}

export function useUpdateSonyBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { title: string; description: string | null } }) =>
      api.patch(`/platform-settings/sony-banks/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sony-banks"] });
      toast.success("بانک سونی بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی"),
  });
}

export function useDeleteSonyBank() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/sony-banks/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "sony-banks"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ─── Bank Accounts ───

export function useBankAccounts() {
  return useQuery<BankAccount[]>({
    queryKey: ["settings", "bank-accounts"],
    queryFn: async () => {
      const { data } = await api.get<BankAccount[] | { results?: BankAccount[] }>("/platform-settings/bank-accounts/");
      return unwrapList(data);
    },
  });
}

export function useCreateBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BankAccountFormData) => api.post("/platform-settings/bank-accounts/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "bank-accounts"] });
      toast.success("حساب بانکی ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد"),
  });
}

export function useUpdateBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BankAccountFormData }) =>
      api.patch(`/platform-settings/bank-accounts/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "bank-accounts"] });
      toast.success("حساب بانکی بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی"),
  });
}

export function useDeleteBankAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/bank-accounts/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "bank-accounts"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}

// ─── Invoice Categories ───

export function useInvoiceCategories(filters?: { direction?: string }) {
  return useQuery<InvoiceCategory[]>({
    queryKey: ["settings", "invoice-categories", filters],
    queryFn: async () => {
      const { data } = await api.get<InvoiceCategory[] | { results?: InvoiceCategory[] }>(
        "/platform-settings/invoice-categories/",
        { params: buildParams(filters as Record<string, unknown>) }
      );
      return unwrapList(data);
    },
  });
}

export function useCreateInvoiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InvoiceCategoryFormData) => api.post("/platform-settings/invoice-categories/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "invoice-categories"] });
      toast.success("دسته‌بندی فاکتور ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد"),
  });
}

export function useUpdateInvoiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: InvoiceCategoryFormData }) =>
      api.patch(`/platform-settings/invoice-categories/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "invoice-categories"] });
      toast.success("دسته‌بندی فاکتور بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی"),
  });
}

export function useDeleteInvoiceCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/platform-settings/invoice-categories/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings", "invoice-categories"] });
      toast.success("حذف شد");
    },
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}
