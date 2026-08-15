import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { toastApiError } from "@/utils/errors";
import type {
  PayrollPreview,
  PayrollIssueFormData,
  PayrollListItem,
  PayrollDetail,
  PayrollPayFormData,
  PayrollPayResponse,
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

export function usePayrollPreview(
  employeeId: number | null,
  from: string | null,
  to: string | null
) {
  return useQuery<PayrollPreview>({
    queryKey: ["hr", "payroll", "calculate", employeeId, from, to],
    queryFn: async () => {
      const { data } = await api.get<PayrollPreview>("/hr/payroll/calculate/", {
        params: buildParams({
          employee_id: employeeId ?? undefined,
          from: from ?? undefined,
          to: to ?? undefined,
        }),
      });
      return data;
    },
    enabled: !!employeeId && !!from && !!to,
  });
}

export function usePayrollList(filters?: {
  account_side?: number;
  period_from?: string;
  period_to?: string;
}) {
  return useQuery<PayrollListItem[]>({
    queryKey: ["hr", "payroll", "list", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<
        PayrollListItem[] | { results: PayrollListItem[] }
      >("/hr/payroll/", { params });
      return Array.isArray(data) ? data : data.results ?? [];
    },
  });
}

export function usePayrollDetail(id: number | null) {
  return useQuery<PayrollDetail>({
    queryKey: ["hr", "payroll", "detail", id],
    queryFn: async () => {
      const { data } = await api.get<PayrollDetail>(`/hr/payroll/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePayrollInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PayrollIssueFormData) =>
      api.post("/hr/payroll/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr", "payroll", "list"] });
      toast.success("حقوق با موفقیت صادر شد");
    },
    onError: (err) => toastApiError(err, "خطا در صدور حقوق"),
  });
}

export function usePaySalary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PayrollPayFormData) =>
      api.post<PayrollPayResponse>("/hr/payroll/pay/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["hr", "payroll"] });
      toast.success("حقوق پرداخت شد");
    },
    onError: (err) => toastApiError(err, "خطا در پرداخت حقوق"),
  });
}
