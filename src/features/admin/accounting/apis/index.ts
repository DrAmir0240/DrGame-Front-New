import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type {
  PaginatedResponse,
  DailyInvoice,
  DailyInvoiceDetail,
  DailyTransaction,
  DailyTransactionDetail,
  DailyPayable,
  DailyReceivable,
  Expense,
  Income,
  Payroll,
  Purchase,
  Sales,
  AccountSide,
  DropdownItem,
  ExpenseFormData,
  IncomeFormData,
  PayrollFormData,
  PurchaseFormData,
  SalesFormData,
  AccountSideFormData,
  DailyInvoiceFilters,
  DailyTransactionFilters,
  ExpenseFilters,
  IncomeFilters,
  PayrollFilters,
  PurchaseFilters,
  SalesFilters,
  AccountSideFilters,
  ReportFilters,
  ReportSummary,
  WeeklyReportItem,
  NetReport,
  RepairReport,
  SonyReport,
  ProductReportByCategory,
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

// ─── Dropdown Hooks ───

export function useDropdown(type: "account_side" | "category" | "status" | "payment_status") {
  return useQuery<DropdownItem[]>({
    queryKey: ["accounting", "dropdown", type],
    queryFn: async () => {
      const { data } = await api.get<DropdownItem[]>("/accounting/choices/", { params: { type } });
      return data;
    },
  });
}

export function useAccountSidesDropdown() {
  return useDropdown("account_side");
}

export function useCategoryDropdown() {
  return useDropdown("category");
}

export function useStatusDropdown() {
  return useDropdown("status");
}

export function usePaymentStatusDropdown() {
  return useDropdown("payment_status");
}

// ─── Account Sides CRUD ───

export function useAccountSidesList(filters?: AccountSideFilters) {
  return useQuery<AccountSide[]>({
    queryKey: ["accounting", "account-sides", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<AccountSide[]>("/accounting/account-sides/", { params });
      return data;
    },
  });
}

export function useAccountSideDetail(id: number) {
  return useQuery<AccountSide>({
    queryKey: ["accounting", "account-sides", id],
    queryFn: async () => {
      const { data } = await api.get<AccountSide>(`/accounting/account-sides/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAccountSide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AccountSideFormData) => api.post("/accounting/account-sides/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "account-sides"] });
      queryClient.invalidateQueries({ queryKey: ["accounting", "dropdown"] });
      toast.success("طرف حساب با موفقیت ایجاد شد");
    },
  });
}

export function useUpdateAccountSide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<AccountSideFormData>) =>
      api.patch(`/accounting/account-sides/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "account-sides"] });
      toast.success("طرف حساب با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteAccountSide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/account-sides/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "account-sides"] });
      toast.success("طرف حساب با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف طرف حساب"),
  });
}

// ─── Financial Reports ───

export function useReportIncome(filters?: ReportFilters) {
  return useQuery<ReportSummary>({
    queryKey: ["accounting", "report", "income", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<ReportSummary>("/accounting/report/income/", { params });
      return data;
    },
  });
}

export function useReportIncomeWeekly() {
  return useQuery<WeeklyReportItem[]>({
    queryKey: ["accounting", "report", "income", "weekly"],
    queryFn: async () => {
      const { data } = await api.get<WeeklyReportItem[]>("/accounting/report/income/weekly/");
      return data;
    },
  });
}

export function useReportExpense(filters?: ReportFilters) {
  return useQuery<ReportSummary>({
    queryKey: ["accounting", "report", "expense", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<ReportSummary>("/accounting/report/expense/", { params });
      return data;
    },
  });
}

export function useReportExpenseWeekly() {
  return useQuery<WeeklyReportItem[]>({
    queryKey: ["accounting", "report", "expense", "weekly"],
    queryFn: async () => {
      const { data } = await api.get<WeeklyReportItem[]>("/accounting/report/expense/weekly/");
      return data;
    },
  });
}

export function useReportNet(filters?: ReportFilters) {
  return useQuery<NetReport>({
    queryKey: ["accounting", "report", "net", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<NetReport>("/accounting/report/net/", { params });
      return data;
    },
  });
}

// ─── Repair Reports ───

export function useRepairReport(filters?: ReportFilters) {
  return useQuery<RepairReport>({
    queryKey: ["accounting", "repair", "report", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<RepairReport>("/accounting/repair/report/", { params });
      return data;
    },
  });
}

export function useRepairReportWeekly() {
  return useQuery<WeeklyReportItem[]>({
    queryKey: ["accounting", "repair", "report", "weekly"],
    queryFn: async () => {
      const { data } = await api.get<WeeklyReportItem[]>("/accounting/repair/report/weekly/");
      return data;
    },
  });
}

// ─── Sony Reports ───

export function useSonyReport(filters?: ReportFilters) {
  return useQuery<SonyReport>({
    queryKey: ["accounting", "sony", "report", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<SonyReport>("/accounting/sony/report/", { params });
      return data;
    },
  });
}

export function useSonyReportWeekly() {
  return useQuery<WeeklyReportItem[]>({
    queryKey: ["accounting", "sony", "report", "weekly"],
    queryFn: async () => {
      const { data } = await api.get<WeeklyReportItem[]>("/accounting/sony/report/weekly/");
      return data;
    },
  });
}

// ─── Product Reports ───

export function useProductReport(filters?: ReportFilters) {
  return useQuery<RepairReport>({
    queryKey: ["accounting", "product", "report", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<RepairReport>("/accounting/product/report/", { params });
      return data;
    },
  });
}

export function useProductReportWeekly() {
  return useQuery<WeeklyReportItem[]>({
    queryKey: ["accounting", "product", "report", "weekly"],
    queryFn: async () => {
      const { data } = await api.get<WeeklyReportItem[]>("/accounting/product/report/weekly/");
      return data;
    },
  });
}

export function useProductReportByCategory() {
  return useQuery<ProductReportByCategory[]>({
    queryKey: ["accounting", "product", "report", "by-category"],
    queryFn: async () => {
      const { data } = await api.get<ProductReportByCategory[]>("/accounting/product/report/by-category/");
      return data;
    },
  });
}

// ─── Daily Invoices ───

export function useDailyInvoices(filters?: DailyInvoiceFilters) {
  return useQuery<DailyInvoice[]>({
    queryKey: ["accounting", "daily", "invoices", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<DailyInvoice>>("/accounting/daily/invoices/", { params });
      return data.results ?? data as unknown as DailyInvoice[];
    },
  });
}

export function useDailyInvoiceDetail(id: number) {
  return useQuery<DailyInvoiceDetail>({
    queryKey: ["accounting", "daily", "invoices", id],
    queryFn: async () => {
      const { data } = await api.get<DailyInvoiceDetail>(`/accounting/daily/invoices/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateDailyInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; [key: string]: unknown }) =>
      api.patch(`/accounting/daily/invoices/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "daily", "invoices"] });
      toast.success("فاکتور با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteDailyInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/daily/invoices/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "daily", "invoices"] });
      toast.success("فاکتور با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف فاکتور"),
  });
}

// ─── Daily Transactions ───

export function useDailyTransactions(filters?: DailyTransactionFilters) {
  return useQuery<DailyTransaction[]>({
    queryKey: ["accounting", "daily", "transactions", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<DailyTransaction>>("/accounting/daily/transactions/", { params });
      return data.results ?? data as unknown as DailyTransaction[];
    },
  });
}

export function useDailyTransactionDetail(id: number) {
  return useQuery<DailyTransactionDetail>({
    queryKey: ["accounting", "daily", "transactions", id],
    queryFn: async () => {
      const { data } = await api.get<DailyTransactionDetail>(`/accounting/daily/transactions/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateDailyTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; [key: string]: unknown }) =>
      api.patch(`/accounting/daily/transactions/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "daily", "transactions"] });
      toast.success("تراکنش با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteDailyTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/daily/transactions/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "daily", "transactions"] });
      toast.success("تراکنش با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف تراکنش"),
  });
}

// ─── Daily Payable / Receivable ───

export function useDailyPayable(filters?: { payment_status?: string; account_side?: number }) {
  return useQuery<DailyPayable[]>({
    queryKey: ["accounting", "daily", "payable", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<DailyPayable>>("/accounting/daily/payable/", { params });
      return data.results ?? data as unknown as DailyPayable[];
    },
  });
}

export function useDailyReceivable(filters?: { payment_status?: string; account_side?: number }) {
  return useQuery<DailyReceivable[]>({
    queryKey: ["accounting", "daily", "receivable", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<DailyReceivable>>("/accounting/daily/receivable/", { params });
      return data.results ?? data as unknown as DailyReceivable[];
    },
  });
}

// ─── Expenses CRUD ───

export function useExpenseList(filters?: ExpenseFilters) {
  return useQuery<PaginatedResponse<Expense>>({
    queryKey: ["accounting", "expense", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Expense>>("/accounting/expense/", { params });
      return data;
    },
  });
}

export function useExpenseDetail(id: number) {
  return useQuery<Expense>({
    queryKey: ["accounting", "expense", id],
    queryFn: async () => {
      const { data } = await api.get<Expense>(`/accounting/expense/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExpenseFormData) => api.post("/accounting/expense/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "expense"] });
      toast.success("هزینه با موفقیت ثبت شد");
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<ExpenseFormData>) =>
      api.patch(`/accounting/expense/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "expense"] });
      toast.success("هزینه با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/expense/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "expense"] });
      toast.success("هزینه با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف هزینه"),
  });
}

// ─── Income CRUD ───

export function useIncomeList(filters?: IncomeFilters) {
  return useQuery<PaginatedResponse<Income>>({
    queryKey: ["accounting", "income", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Income>>("/accounting/income/", { params });
      return data;
    },
  });
}

export function useIncomeDetail(id: number) {
  return useQuery<Income>({
    queryKey: ["accounting", "income", id],
    queryFn: async () => {
      const { data } = await api.get<Income>(`/accounting/income/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IncomeFormData) => api.post("/accounting/income/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "income"] });
      toast.success("درآمد با موفقیت ثبت شد");
    },
  });
}

export function useUpdateIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<IncomeFormData>) =>
      api.patch(`/accounting/income/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "income"] });
      toast.success("درآمد با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteIncome() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/income/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "income"] });
      toast.success("درآمد با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف درآمد"),
  });
}

// ─── Payroll CRUD ───

export function usePayrollList(filters?: PayrollFilters) {
  return useQuery<PaginatedResponse<Payroll>>({
    queryKey: ["accounting", "payroll", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Payroll>>("/accounting/payroll/", { params });
      return data;
    },
  });
}

export function usePayrollDetail(id: number) {
  return useQuery<Payroll>({
    queryKey: ["accounting", "payroll", id],
    queryFn: async () => {
      const { data } = await api.get<Payroll>(`/accounting/payroll/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PayrollFormData) => api.post("/accounting/payroll/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "payroll"] });
      toast.success("فیش حقوقی با موفقیت ثبت شد");
    },
  });
}

export function useUpdatePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<PayrollFormData>) =>
      api.patch(`/accounting/payroll/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "payroll"] });
      toast.success("فیش حقوقی با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeletePayroll() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/payroll/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "payroll"] });
      toast.success("فیش حقوقی با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف فیش حقوقی"),
  });
}

// ─── Purchase CRUD ───

export function usePurchaseList(filters?: PurchaseFilters) {
  return useQuery<PaginatedResponse<Purchase>>({
    queryKey: ["accounting", "purchase", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Purchase>>("/accounting/purchase/", { params });
      return data;
    },
  });
}

export function usePurchaseDetail(id: number) {
  return useQuery<Purchase>({
    queryKey: ["accounting", "purchase", id],
    queryFn: async () => {
      const { data } = await api.get<Purchase>(`/accounting/purchase/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PurchaseFormData) => api.post("/accounting/purchase/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "purchase"] });
      toast.success("فاکتور خرید با موفقیت ثبت شد");
    },
  });
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<PurchaseFormData>) =>
      api.patch(`/accounting/purchase/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "purchase"] });
      toast.success("فاکتور خرید با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeletePurchase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/purchase/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "purchase"] });
      toast.success("فاکتور خرید با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف فاکتور خرید"),
  });
}

// ─── Sales CRUD ───

export function useSalesList(filters?: SalesFilters) {
  return useQuery<PaginatedResponse<Sales>>({
    queryKey: ["accounting", "sales", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Sales>>("/accounting/sales/", { params });
      return data;
    },
  });
}

export function useSalesDetail(id: number) {
  return useQuery<Sales>({
    queryKey: ["accounting", "sales", id],
    queryFn: async () => {
      const { data } = await api.get<Sales>(`/accounting/sales/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSales() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SalesFormData) => api.post("/accounting/sales/create/", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "sales"] });
      toast.success("فاکتور فروش با موفقیت ثبت شد");
    },
  });
}

export function useUpdateSales() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & Partial<SalesFormData>) =>
      api.patch(`/accounting/sales/${id}/edit/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "sales"] });
      toast.success("فاکتور فروش با موفقیت بروزرسانی شد");
    },
  });
}

export function useDeleteSales() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/accounting/sales/${id}/delete/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounting", "sales"] });
      toast.success("فاکتور فروش با موفقیت حذف شد");
    },
    onError: () => toast.error("خطا در حذف فاکتور فروش"),
  });
}
