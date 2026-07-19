import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
  PaginatedResponse,
  Customer,
  B2BProfile,
  CustomerSummary,
  CustomerTransaction,
  CustomerInvoice,
  CustomerFormData,
  B2BProfileFormData,
  SendSmsPayload,
  SendSmsResponse,
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

// ─── Customer List ───

export function useCustomerList(filters?: { search?: string; limit?: number; offset?: number }) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: ["crm", "customers", "normal", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Customer>>("/crm/customers/", { params });
      return data;
    },
  });
}

export function useB2BCustomerList(filters?: { search?: string; limit?: number; offset?: number }) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: ["crm", "customers", "b2b", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Customer>>("/crm/customers/b2b/", { params });
      return data;
    },
  });
}

// ─── Customer Detail ───

export function useCustomerDetail(id: number | null) {
  return useQuery<Customer>({
    queryKey: ["crm", "customers", id],
    queryFn: async () => {
      const { data } = await api.get<Customer>(`/crm/customers/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

// ─── Customer CRUD ───

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/crm/customers/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "customers"] });
      toast.success("مشتری با موفقیت ایجاد شد");
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/crm/customers/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "customers"] });
      toast.success("مشتری با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/crm/customers/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm", "customers"] });
      toast.success("مشتری با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف مشتری"),
  });
}

// ─── B2B Profile CRUD ───

export function useB2BProfile(customerId: number | null) {
  return useQuery<B2BProfile>({
    queryKey: ["crm", "b2b", customerId],
    queryFn: async () => {
      const { data } = await api.get<B2BProfile>(`/crm/customers/${customerId}/b2b/detail/`);
      return data;
    },
    enabled: !!customerId,
    retry: false,
  });
}

export function useCreateB2BProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: number; data: B2BProfileFormData }) =>
      api.post(`/crm/customers/${customerId}/b2b/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm"] });
      toast.success("پروفایل تجاری با موفقیت ایجاد شد");
    },
  });
}

export function useUpdateB2BProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ customerId, data }: { customerId: number; data: Partial<B2BProfileFormData> }) =>
      api.patch(`/crm/customers/${customerId}/b2b/detail/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm"] });
      toast.success("پروفایل تجاری با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteB2BProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: number) =>
      api.delete(`/crm/customers/${customerId}/b2b/detail/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm"] });
      toast.success("پروفایل تجاری با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف پروفایل تجاری"),
  });
}

// ─── Customer Summary, Transactions, Invoices ───

export function useCustomerSummary(customerId: number | null) {
  return useQuery<CustomerSummary>({
    queryKey: ["crm", "customers", customerId, "summary"],
    queryFn: async () => {
      const { data } = await api.get<CustomerSummary>(`/crm/customers/${customerId}/summary/`);
      return data;
    },
    enabled: !!customerId,
  });
}

export function useCustomerTransactions(customerId: number | null) {
  return useQuery<CustomerTransaction[]>({
    queryKey: ["crm", "customers", customerId, "transactions"],
    queryFn: async () => {
      const { data } = await api.get<CustomerTransaction[]>(`/crm/customers/${customerId}/transactions/`);
      return data;
    },
    enabled: !!customerId,
  });
}

export function useCustomerInvoices(customerId: number | null) {
  return useQuery<CustomerInvoice[]>({
    queryKey: ["crm", "customers", customerId, "invoices"],
    queryFn: async () => {
      const { data } = await api.get<CustomerInvoice[]>(`/crm/customers/${customerId}/invoices/`);
      return data;
    },
    enabled: !!customerId,
  });
}

// ─── Send SMS ───

export function useSendSms() {
  return useMutation({
    mutationFn: (payload: SendSmsPayload) =>
      api.post<SendSmsResponse>("/crm/customer/send-sms-service/", payload),
    onSuccess: (res) => {
      toast.success("پیامک با موفقیت ارسال شد");
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.detail;
      if (msg) {
        toast.error(msg);
      } else {
        toast.error("خطا در ارسال پیامک");
      }
    },
  });
}
