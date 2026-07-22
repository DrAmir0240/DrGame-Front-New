import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
  PaginatedResponse,
  Employee,
  Resume,
  ResumeFormData,
  Arrival,
  ArrivalFormData,
  ArrivalFilters,
  RequestType,
  RequestTypeFormData,
  EmployeeRequest,
  EmployeeRequestFormData,
  RequestFilters,
  Payroll,
  PayrollDetailResponse,
  PayrollFormData,
  Overtime,
  OvertimeFormData,
  OvertimeFilters,
  InvoiceCategory,
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

// ─── Employees Dropdown ───

export function useEmployeesDropdown() {
  return useQuery<PaginatedResponse<Employee>>({
    queryKey: ["hr", "employees", "dropdown"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Employee>>("/hr/employees/", {
        params: { limit: 100 },
      });
      return data;
    },
  });
}

// ─── Resumes CRUD ───

export function useResumeList(filters?: { limit?: number; offset?: number }) {
  return useQuery<PaginatedResponse<Resume>>({
    queryKey: ["hr", "resumes", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Resume>>("/hr/resumes/", { params });
      return data;
    },
  });
}

export function useResumeDetail(id: number | null) {
  return useQuery<Resume>({
    queryKey: ["hr", "resumes", id],
    queryFn: async () => {
      const { data } = await api.get<Resume>(`/hr/resumes/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/hr/resumes/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "resumes"] });
      toast.success("رزومه با موفقیت ثبت شد");
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/hr/resumes/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "resumes"] });
      toast.success("رزومه با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف رزومه"),
  });
}

// ─── Arrivals CRUD ───

export function useArrivalList(filters?: ArrivalFilters) {
  return useQuery<PaginatedResponse<Arrival>>({
    queryKey: ["hr", "arrivals", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Arrival>>("/hr/arrivals/", { params });
      return data;
    },
  });
}

export function useCreateArrival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ArrivalFormData) => api.post("/hr/arrivals/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "arrivals"] });
      toast.success("تردد با موفقیت ثبت شد");
    },
  });
}

export function useUpdateArrival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<ArrivalFormData>) =>
      api.patch(`/hr/arrivals/${id}/update/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "arrivals"] });
      toast.success("تردد با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteArrival() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/hr/arrivals/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "arrivals"] });
      toast.success("تردد با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف تردد"),
  });
}

// ─── Request Types CRUD ───

export function useRequestTypeList() {
  return useQuery<PaginatedResponse<RequestType>>({
    queryKey: ["hr", "request-types"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<RequestType>>("/hr/request-types/");
      return data;
    },
  });
}

export function useCreateRequestType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: RequestTypeFormData) => api.post("/hr/request-types/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "request-types"] });
      toast.success("نوع درخواست با موفقیت ایجاد شد");
    },
  });
}

export function useDeleteRequestType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/hr/request-types/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "request-types"] });
      toast.success("نوع درخواست با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف نوع درخواست"),
  });
}

// ─── Requests CRUD ───

export function useRequestList(filters?: RequestFilters) {
  return useQuery<PaginatedResponse<EmployeeRequest>>({
    queryKey: ["hr", "requests", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<EmployeeRequest>>("/hr/requests/", { params });
      return data;
    },
  });
}

export function useRequestDetail(id: number | null) {
  return useQuery<EmployeeRequest>({
    queryKey: ["hr", "requests", id],
    queryFn: async () => {
      const { data } = await api.get<EmployeeRequest>(`/hr/requests/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EmployeeRequestFormData) => api.post("/hr/requests/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "requests"] });
      toast.success("درخواست با موفقیت ثبت شد");
    },
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.patch(`/hr/requests/${id}/status/`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "requests"] });
      toast.success("وضعیت درخواست با موفقیت تغییر کرد");
    },
  });
}

export function useDeleteRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/hr/requests/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "requests"] });
      toast.success("درخواست با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف درخواست"),
  });
}

// ─── Payrolls CRUD ───

export function usePayrollList(filters?: { limit?: number; offset?: number }) {
  return useQuery<PaginatedResponse<Payroll>>({
    queryKey: ["hr", "payrolls", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Payroll>>("/hr/payrolls/", { params });
      return data;
    },
  });
}

export function usePayrollDetail(id: number | null) {
  return useQuery<PayrollDetailResponse>({
    queryKey: ["hr", "payrolls", id],
    queryFn: async () => {
      const { data } = await api.get<PayrollDetailResponse>(`/hr/payrolls/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PayrollFormData) => api.post("/hr/payrolls/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "payrolls"] });
      toast.success("فیش حقوقی با موفقیت صادر شد");
    },
  });
}

export function usePayrollTransactions(invoiceId: number | null) {
  return useQuery({
    queryKey: ["hr", "payrolls", invoiceId, "transactions"],
    queryFn: async () => {
      const { data } = await api.get(`/hr/payrolls/${invoiceId}/transactions/`);
      return data;
    },
    enabled: !!invoiceId,
  });
}

// ─── Overtimes CRUD ───

export function useOvertimeList(filters?: OvertimeFilters) {
  return useQuery<PaginatedResponse<Overtime>>({
    queryKey: ["hr", "overtimes", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Overtime>>("/hr/overtimes/", { params });
      return data;
    },
  });
}

export function useCreateOvertime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: OvertimeFormData) => api.post("/hr/overtimes/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "overtimes"] });
      toast.success("اضافه‌کاری با موفقیت ثبت شد");
    },
  });
}

export function useApproveOvertime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.patch(`/hr/overtimes/${id}/approve/`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "overtimes"] });
      toast.success("اضافه‌کاری با موفقیت تایید شد");
    },
  });
}

export function useDeleteOvertime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/hr/overtimes/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hr", "overtimes"] });
      toast.success("اضافه‌کاری با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف اضافه‌کاری"),
  });
}

// ─── Dropdowns ───

export function useAccountSidesDropdown() {
  return useQuery<{ key: string; value: string }[]>({
    queryKey: ["hr", "account-sides"],
    queryFn: async () => {
      const { data } = await api.get<{ key: string; value: string }[]>("/accounting/choices/", { params: { type: "account_side" } });
      return data;
    },
  });
}

export function useCategoryDropdown() {
  return useQuery<{ key: string; value: string }[]>({
    queryKey: ["hr", "categories"],
    queryFn: async () => {
      const { data } = await api.get<{ key: string; value: string }[]>("/accounting/choices/", {
        params: { type: "category" },
      });
      return data;
    },
  });
}
