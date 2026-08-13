export interface FinancialSummary {
  current: {
    total_income: number;
    total_expense: number;
    net_profit: number;
    invoice_count: number;
    paid_invoice_count: number;
    unpaid_invoice_count: number;
    partial_invoice_count: number;
  };
  previous: {
    total_income: number;
    total_expense: number;
    net_profit: number;
    invoice_count: number;
    paid_invoice_count: number;
    unpaid_invoice_count: number;
    partial_invoice_count: number;
  };
  change_pct: {
    total_income: number | null;
    total_expense: number | null;
    net_profit: number | null;
    invoice_count: number | null;
    paid_invoice_count: number | null;
    unpaid_invoice_count: number | null;
    partial_invoice_count: number | null;
  };
}

export interface DailyAmountItem {
  date: string;
  amount: number;
}

export interface InvoiceCategoryMetric {
  category_id: number | null;
  category_title: string;
  current_count: number;
  current_amount: number;
  previous_count: number;
  previous_amount: number;
  change_pct: number | null;
}

export interface WalletTransactionMetric {
  count: number;
  total_amount: number;
  previous_count: number;
  previous_amount: number;
  change_pct: number | null;
}

export interface WalletTransactionsSummary {
  charge_admin: WalletTransactionMetric;
  charge_gateway: WalletTransactionMetric;
  debit_order: WalletTransactionMetric;
  refund: WalletTransactionMetric;
}

export interface OrderTypeMetric {
  count: number;
  amount: number;
  previous_count: number;
  previous_amount: number;
  change_pct: number | null;
}

export interface OrdersSummary {
  sony_account: OrderTypeMetric;
  repair: OrderTypeMetric;
  product: OrderTypeMetric;
  total: OrderTypeMetric;
}

export interface SonyByCategoryItem {
  category_id: number | null;
  category_title: string;
  category_type: string;
  current_count: number;
  current_amount: number;
  previous_count: number;
  previous_amount: number;
  change_pct: number | null;
}

export interface SonyBySourceItem {
  source: string;
  source_display: string;
  current_count: number;
  current_amount: number;
  previous_count: number;
  previous_amount: number;
  change_pct: number | null;
}

export interface RepairByCategoryItem {
  category_id: number | null;
  category_title: string;
  current_count: number;
  current_repair_fee: number;
  current_final_amount: number;
  previous_count: number;
  previous_final_amount: number;
  change_pct: number | null;
}

export interface RepairBySourceItem {
  source: string;
  source_display: string;
  current_count: number;
  previous_count: number;
  change_pct: number | null;
}

export interface ProductByCategoryItem {
  category_id: number | null;
  category_title: string;
  current_count: number;
  current_amount: number;
  previous_count: number;
  previous_amount: number;
  change_pct: number | null;
}

export interface ProductBySourceItem {
  source: string;
  source_display: string;
  current_count: number;
  previous_count: number;
  change_pct: number | null;
}

export interface OrdersByDayItem {
  date: string;
  sony_count: number;
  repair_count: number;
  product_count: number;
  total_count: number;
}

export interface InventorySummary {
  current: {
    total_products: number;
    low_stock_count: number;
    out_of_stock_count: number;
    total_movement_in: number;
    total_movement_out: number;
    purchase_orders_count: number;
    purchase_orders_value: number;
  };
  previous: {
    total_movement_in: number;
    total_movement_out: number;
    purchase_orders_count: number;
    purchase_orders_value: number;
  };
  change_pct: {
    total_movement_in: number | null;
    total_movement_out: number | null;
    purchase_orders_count: number | null;
    purchase_orders_value: number | null;
  };
}

export interface LowStockProduct {
  id: number;
  title: string;
  stock: number;
  min_stock: number;
  deficit: number;
  category_title: string;
}

export interface TopSellingProduct {
  product_id: number;
  product_title: string;
  category_title: string;
  total_quantity_sold: number;
  total_revenue: number;
  order_count: number;
}

export interface MovementByReasonItem {
  reason: string;
  reason_display: string;
  current_count: number;
  current_quantity: number;
  previous_count: number;
  previous_quantity: number;
  change_pct: number | null;
}

export interface PurchaseOrderStatusMetric {
  count: number;
  total_amount: number;
  previous_count: number;
  previous_amount: number;
  change_pct: number | null;
}

export interface PurchaseOrdersSummary {
  draft: PurchaseOrderStatusMetric;
  confirmed: PurchaseOrderStatusMetric;
  received: PurchaseOrderStatusMetric;
  cancelled: PurchaseOrderStatusMetric;
}

export interface SonyAccountsSummary {
  current: {
    total_accounts: number;
    active_accounts: number;
    accounts_with_plus: number;
    new_accounts_in_period: number;
    accounts_used_in_period: number;
  };
  previous: {
    new_accounts_in_period: number;
    accounts_used_in_period: number;
  };
  change_pct: {
    new_accounts_in_period: number | null;
    accounts_used_in_period: number | null;
  };
}

export interface SonyByRegionItem {
  region: string;
  region_display: string;
  count: number;
  with_plus_count: number;
  avg_price: number | string;
  orders_in_period: number;
  previous_orders: number;
  change_pct: number | null;
}

export interface SonyByStatusItem {
  status_id: number;
  status_title: string;
  count: number;
}

export interface TopUsedSonyAccount {
  id: number;
  username: string;
  region: string;
  plus: boolean;
  status_title: string;
  use_count: number;
  price: number;
}

export interface CustomersSummary {
  current: {
    total_customers: number;
    new_customers_in_period: number;
    active_customers_in_period: number;
    customers_with_debt: number;
  };
  previous: {
    new_customers_in_period: number;
    active_customers_in_period: number;
  };
  change_pct: {
    new_customers_in_period: number | null;
    active_customers_in_period: number | null;
  };
}

export interface TopCustomerByRevenue {
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  total_revenue: number;
  invoice_count: number;
  order_count: number;
}

export interface NewCustomerByDay {
  date: string;
  count: number;
}

export interface CommissionSummaryItem {
  employee_id: number;
  employee_name: string;
  unsettled_commission: number;
  settled_commission: number;
  previous_unsettled: number;
  change_pct: number | null;
}

export interface PayrollSummary {
  current: {
    payroll_count: number;
    total_net_salary: number;
    total_commission_paid: number;
  };
  previous: {
    payroll_count: number;
    total_net_salary: number;
    total_commission_paid: number;
  };
  change_pct: {
    payroll_count: number | null;
    total_net_salary: number | null;
    total_commission_paid: number | null;
  };
}

export interface OrderActionItem {
  employee_id: number;
  employee_name: string;
  sony_action_count: number;
  repair_action_count: number;
  product_action_count: number;
  total_count: number;
  previous_total: number;
  change_pct: number | null;
}

export interface DateRange {
  date_from?: string;
  date_to?: string;
}
