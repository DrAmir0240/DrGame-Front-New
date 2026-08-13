import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import type {
  DateRange,
  CustomersSummary,
  DailyAmountItem,
  FinancialSummary,
  InventorySummary,
  InvoiceCategoryMetric,
  LowStockProduct,
  MovementByReasonItem,
  NewCustomerByDay,
  OrdersByDayItem,
  OrdersSummary,
  OrderActionItem,
  PayrollSummary,
  ProductByCategoryItem,
  ProductBySourceItem,
  PurchaseOrdersSummary,
  RepairByCategoryItem,
  RepairBySourceItem,
  SonyAccountsSummary,
  SonyByCategoryItem,
  SonyByRegionItem,
  SonyBySourceItem,
  SonyByStatusItem,
  TopCustomerByRevenue,
  TopSellingProduct,
  TopUsedSonyAccount,
  WalletTransactionsSummary,
  CommissionSummaryItem,
} from "../types";

function buildParams(
  filters?: Record<string, unknown>,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params[key] = String(value);
    }
  }
  return params;
}

const defaultRange = (): { date_from: string; date_to: string } => {
  const dateTo = new Date();
  const dateFrom = new Date();
  dateFrom.setDate(dateTo.getDate() - 30);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { date_from: fmt(dateFrom), date_to: fmt(dateTo) };
};

function unwrapResponse<T>(data: unknown, isList: boolean): T {
  const unwrap = (value: unknown): unknown => {
    if (value === null || value === undefined) return isList ? [] : undefined;
    if (Array.isArray(value)) {
      if (isList) return value;
      return unwrap(value[0] ?? {});
    }
    if (typeof value !== "object") return isList ? [] : value;
    const obj = value as Record<string, unknown>;

    if (Array.isArray(obj.results)) {
      return isList ? obj.results : unwrap(obj.results[0] ?? {});
    }
    if (obj.results && typeof obj.results === "object") {
      return isList ? [] : unwrap(obj.results);
    }
    if (obj.data && typeof obj.data === "object") {
      return unwrap(obj.data);
    }

    return isList ? [] : obj;
  };
  return unwrap(data) as T;
}

function useDashboardQuery<T>(
  key: string[],
  url: string,
  filters?: DateRange,
  extra?: Record<string, unknown>,
  unwrapList = false,
) {
  return useQuery<T>({
    queryKey: ["admin", "dashboard", key, filters, extra],
    queryFn: async () => {
      const params = buildParams({
        ...defaultRange(),
        ...(filters ?? {}),
      } as Record<string, unknown>);
      const { data } = await api.get<unknown>(url, {
        params: { ...params, ...buildParams(extra ?? {}) },
      });
      return unwrapResponse<T>(data, unwrapList);
    },
  });
}

// ─── Financial ───

export function useFinancialSummary(filters?: DateRange) {
  return useDashboardQuery<FinancialSummary>(
    ["financial", "summary"],
    "/dashboard/financial/summary/",
    filters,
  );
}

export function useFinancialIncome(filters?: DateRange) {
  return useDashboardQuery<DailyAmountItem[]>(
    ["financial", "income"],
    "/dashboard/financial/income/",
    filters,
    undefined,
    true,
  );
}

export function useFinancialExpense(filters?: DateRange) {
  return useDashboardQuery<DailyAmountItem[]>(
    ["financial", "expense"],
    "/dashboard/financial/expense/",
    filters,
    undefined,
    true,
  );
}

export function useFinancialInvoiceCategories(filters?: DateRange) {
  return useDashboardQuery<InvoiceCategoryMetric[]>(
    ["financial", "invoice-categories"],
    "/dashboard/financial/invoice-categories/",
    filters,
    undefined,
    true,
  );
}

export function useWalletTransactions(filters?: DateRange) {
  return useDashboardQuery<WalletTransactionsSummary>(
    ["financial", "wallet-transactions"],
    "/dashboard/financial/wallet-transactions/",
    filters,
  );
}

// ─── Orders ───

export function useOrdersSummary(filters?: DateRange) {
  return useDashboardQuery<OrdersSummary>(
    ["orders", "summary"],
    "/dashboard/orders/summary/",
    filters,
  );
}

export function useSonyByCategory(filters?: DateRange) {
  return useDashboardQuery<SonyByCategoryItem[]>(
    ["orders", "sony", "category"],
    "/dashboard/orders/sony-account/by-category/",
    filters,
    undefined,
    true,
  );
}

export function useSonyBySource(filters?: DateRange) {
  return useDashboardQuery<SonyBySourceItem[]>(
    ["orders", "sony", "source"],
    "/dashboard/orders/sony-account/by-source/",
    filters,
    undefined,
    true,
  );
}

export function useRepairByCategory(filters?: DateRange) {
  return useDashboardQuery<RepairByCategoryItem[]>(
    ["orders", "repair", "category"],
    "/dashboard/orders/repair/by-category/",
    filters,
    undefined,
    true,
  );
}

export function useRepairBySource(filters?: DateRange) {
  return useDashboardQuery<RepairBySourceItem[]>(
    ["orders", "repair", "source"],
    "/dashboard/orders/repair/by-source/",
    filters,
    undefined,
    true,
  );
}

export function useProductByCategory(filters?: DateRange) {
  return useDashboardQuery<ProductByCategoryItem[]>(
    ["orders", "product", "category"],
    "/dashboard/orders/product/by-category/",
    filters,
    undefined,
    true,
  );
}

export function useProductBySource(filters?: DateRange) {
  return useDashboardQuery<ProductBySourceItem[]>(
    ["orders", "product", "source"],
    "/dashboard/orders/product/by-source/",
    filters,
    undefined,
    true,
  );
}

export function useOrdersByDay(filters?: DateRange) {
  return useDashboardQuery<OrdersByDayItem[]>(
    ["orders", "by-day"],
    "/dashboard/orders/by-day/",
    filters,
    undefined,
    true,
  );
}

// ─── Inventory ───

export function useInventorySummary(filters?: DateRange) {
  return useDashboardQuery<InventorySummary>(
    ["inventory", "summary"],
    "/dashboard/inventory/summary/",
    filters,
  );
}

export function useLowStockProducts() {
  return useDashboardQuery<LowStockProduct[]>(
    ["inventory", "low-stock"],
    "/dashboard/inventory/low-stock/",
    undefined,
    {},
    true,
  );
}

export function useTopSellingProducts(limit = 10) {
  return useDashboardQuery<TopSellingProduct[]>(
    ["inventory", "top-selling"],
    "/dashboard/inventory/top-selling/",
    undefined,
    { limit },
    true,
  );
}

export function useMovementsByReason(filters?: DateRange) {
  return useDashboardQuery<MovementByReasonItem[]>(
    ["inventory", "movements"],
    "/dashboard/inventory/movements/by-reason/",
    filters,
    undefined,
    true,
  );
}

export function usePurchaseOrdersSummary(filters?: DateRange) {
  return useDashboardQuery<PurchaseOrdersSummary>(
    ["inventory", "purchase-orders"],
    "/dashboard/inventory/purchase-orders/summary/",
    filters,
  );
}

// ─── Sony Accounts ───

export function useSonyAccountsSummary(filters?: DateRange) {
  return useDashboardQuery<SonyAccountsSummary>(
    ["sony", "summary"],
    "/dashboard/sony-accounts/summary/",
    filters,
  );
}

export function useSonyByRegion(filters?: DateRange) {
  return useDashboardQuery<SonyByRegionItem[]>(
    ["sony", "region"],
    "/dashboard/sony-accounts/by-region/",
    filters,
    undefined,
    true,
  );
}

export function useSonyByStatus() {
  return useDashboardQuery<SonyByStatusItem[]>(
    ["sony", "status"],
    "/dashboard/sony-accounts/by-status/",
    undefined,
    {},
    true,
  );
}

export function useTopUsedSonyAccounts(limit = 10) {
  return useDashboardQuery<TopUsedSonyAccount[]>(
    ["sony", "top-used"],
    "/dashboard/sony-accounts/top-used/",
    undefined,
    { limit },
    true,
  );
}

// ─── Customers ───

export function useCustomersSummary(filters?: DateRange) {
  return useDashboardQuery<CustomersSummary>(
    ["customers", "summary"],
    "/dashboard/customers/summary/",
    filters,
  );
}

export function useTopCustomersByRevenue(limit = 10) {
  return useDashboardQuery<TopCustomerByRevenue[]>(
    ["customers", "top-by-revenue"],
    "/dashboard/customers/top-by-revenue/",
    undefined,
    { limit },
    true,
  );
}

export function useNewCustomersByDay(filters?: DateRange) {
  return useDashboardQuery<NewCustomerByDay[]>(
    ["customers", "new-by-day"],
    "/dashboard/customers/new-by-day/",
    filters,
    undefined,
    true,
  );
}

// ─── Employees / HR ───

export function useCommissionSummary() {
  return useDashboardQuery<CommissionSummaryItem[]>(
    ["employees", "commission"],
    "/dashboard/employees/commission-summary/",
    undefined,
    {},
    true,
  );
}

export function usePayrollSummary(filters?: DateRange) {
  return useDashboardQuery<PayrollSummary>(
    ["employees", "payroll"],
    "/dashboard/employees/payroll-summary/",
    filters,
  );
}

export function useOrderActions() {
  return useDashboardQuery<OrderActionItem[]>(
    ["employees", "order-actions"],
    "/dashboard/employees/order-actions/",
    undefined,
    {},
    true,
  );
}
