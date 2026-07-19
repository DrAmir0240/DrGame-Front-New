export type TransactionDirection = "in" | "out";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Customer {
  id: number;
  full_name: string;
  phone: string;
  address: string | null;
  postal_code: string | null;
  profile_pic: string | null;
  has_b2b: boolean;
  created_at: string;
}

export interface CustomerFormData {
  address: string;
  postal_code: string;
  profile_pic: File | string | null;
}

export interface B2BProfile {
  id: number;
  customer_id: number;
  business_title: string;
  debt_amount_max: number;
  uni_id: number;
  discount: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface B2BProfileFormData {
  business_title: string;
  debt_amount_max: number;
  uni_id: number;
  discount: number;
  description: string;
}

export interface CustomerSummary {
  customer_id: number;
  full_name: string;
  product_orders_count: number;
  repair_orders_count: number;
  sony_account_orders_count: number;
  total_orders_count: number;
  total_transactions_amount: number;
  total_invoices_amount: number;
}

export interface CustomerTransaction {
  id: number;
  amount: number;
  direction: TransactionDirection;
  direction_display: string;
  bank_account_id: number;
  bank_account_name: string;
  invoice_id: number | null;
  description: string | null;
  created_at: string;
}

export interface CustomerInvoice {
  id: number;
  total_items_price: number;
  paid_amount: number;
  created_at: string;
  updated_at: string;
}

export interface SendSmsPayload {
  message: string;
  customer_ids: number[];
  send_time?: string;
}

export interface SendSmsResponse {
  status: string;
  id: string;
}

export interface CustomerFilters {
  search?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  postal_code?: string;
  has_b2b?: boolean;
  business_title?: string;
  created_at_from?: string;
  created_at_to?: string;
}

export interface CustomerFinanceFilters {
  min_transactions_amount?: number;
  max_transactions_amount?: number;
  min_transactions_count?: number;
  max_transactions_count?: number;
  min_invoices_count?: number;
  max_invoices_count?: number;
  min_product_orders?: number;
  max_product_orders?: number;
  min_repair_orders?: number;
  max_repair_orders?: number;
  min_sony_orders?: number;
  max_sony_orders?: number;
}
