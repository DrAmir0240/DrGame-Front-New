export type InvoiceStatus = "draft" | "primary" | "finalize";
export type PaymentStatus = "unpaid" | "partial" | "paid";
export type TransactionDirection = "in" | "out";
export type AccountSideType = "customer" | "employee" | "supplier" | "other";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AccountSide {
  id: number;
  name: string;
  type: AccountSideType;
}

export interface BankAccount {
  id: number;
  title: string;
  account_number?: string;
}

export interface InvoiceCategory {
  id: number;
  title: string;
  direction: "in" | "out";
}

export interface DropdownItem {
  key: string;
  value: string;
}

export interface InvoiceItem {
  id: number;
  title: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
}

export interface PayrollDetail {
  base_salary: number;
  overtime_amount: number;
  bonus: number;
  housing_allowance: number;
  food_allowance: number;
  transportation_allowance: number;
  insurance_deduction: number;
  tax_deduction: number;
  loan_deduction: number;
  other_deductions: number;
  work_days: number;
  overtime_hours: number;
  description?: string;
  gross_salary?: number;
  total_deductions?: number;
  net_salary?: number;
}

export interface DailyInvoice {
  id: number;
  account_side: AccountSide;
  category: InvoiceCategory;
  amount: number;
  discount: number;
  paid_amount: number;
  remaining_amount: number;
  status: InvoiceStatus;
  status_display: string;
  payment_status: PaymentStatus;
  payment_status_display: string;
  is_payroll: boolean;
  created_at: string;
}

export interface DailyInvoiceDetail extends DailyInvoice {
  description?: string;
  items: InvoiceItem[];
  updated_at: string;
}

export interface DailyTransaction {
  id: number;
  direction: TransactionDirection;
  direction_display: string;
  amount: number;
  account_side: AccountSide;
  bank_account: BankAccount;
  description: string;
  created_at: string;
}

export interface DailyTransactionDetail extends DailyTransaction {
  updated_at: string;
}

export interface DailyPayable {
  id: number;
  account_side: AccountSide;
  category: InvoiceCategory;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: PaymentStatus;
  payment_status_display: string;
  created_at: string;
}

export interface DailyReceivable extends DailyPayable {}

export interface Expense {
  id: number;
  account_side: AccountSide;
  category: InvoiceCategory;
  amount: number;
  discount: number;
  paid_amount: number;
  remaining_amount: number;
  status: InvoiceStatus;
  status_display: string;
  payment_status: PaymentStatus;
  payment_status_display: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Income {
  id: number;
  account_side: AccountSide;
  category: InvoiceCategory;
  amount: number;
  discount: number;
  paid_amount: number;
  remaining_amount: number;
  status: InvoiceStatus;
  status_display: string;
  payment_status: PaymentStatus;
  payment_status_display: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Payroll {
  id: number;
  account_side: AccountSide;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: PaymentStatus;
  payment_status_display: string;
  description: string;
  payroll_detail: PayrollDetail;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: number;
  account_side: AccountSide;
  category: InvoiceCategory;
  amount: number;
  discount: number;
  paid_amount: number;
  remaining_amount: number;
  status: InvoiceStatus;
  status_display: string;
  payment_status: PaymentStatus;
  payment_status_display: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Sales {
  id: number;
  account_side: AccountSide;
  category: InvoiceCategory;
  amount: number;
  discount: number;
  paid_amount: number;
  remaining_amount: number;
  status: InvoiceStatus;
  status_display: string;
  payment_status: PaymentStatus;
  payment_status_display: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseFormData {
  account_side: number;
  amount: number;
  discount: number;
  status: InvoiceStatus;
  description: string;
  category?: number;
}

export interface IncomeFormData {
  account_side: number;
  amount: number;
  discount: number;
  status: InvoiceStatus;
  description: string;
  category?: number;
}

export interface PayrollFormData {
  account_side: number;
  amount: number;
  discount: number;
  status: InvoiceStatus;
  description: string;
  payroll_detail: PayrollDetail;
}

export interface PurchaseFormData {
  account_side: number;
  amount: number;
  discount: number;
  status: InvoiceStatus;
  description: string;
  category?: number;
}

export interface SalesFormData {
  account_side: number;
  amount: number;
  discount: number;
  status: InvoiceStatus;
  description: string;
  category?: number;
}

export interface AccountSideFormData {
  name: string;
  type: AccountSideType;
}

export interface DailyInvoiceFilters {
  status?: string;
  payment_status?: string;
  account_side?: number;
  category?: number;
}

export interface DailyTransactionFilters {
  direction?: string;
  bank_account?: number;
  account_side?: number;
}

export interface ExpenseFilters {
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
  account_side?: number;
  search?: string;
}

export interface IncomeFilters {
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
  account_side?: number;
  search?: string;
}

export interface PayrollFilters {
  start_date?: string;
  end_date?: string;
  payment_status?: string;
  account_side?: number;
  search?: string;
}

export interface PurchaseFilters {
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
  account_side?: number;
  search?: string;
}

export interface SalesFilters {
  start_date?: string;
  end_date?: string;
  status?: string;
  payment_status?: string;
  account_side?: number;
  search?: string;
}

export interface AccountSideFilters {
  type?: string;
  search?: string;
}

export interface ReportFilters {
  start_date?: string;
  end_date?: string;
}

export interface ReportSummary {
  direction: string;
  direction_display: string;
  count: number;
  total_amount: number;
}

export interface WeeklyReportItem {
  date: string;
  weekday: string;
  count: number;
  total_amount: number;
}

export interface NetReport {
  income: ReportSummary;
  expense: ReportSummary;
  net: number;
}

export interface RepairReport {
  count: number;
  total_amount: number;
}

export interface SonyReportSummary {
  count: number;
  total_amount: number;
}

export interface SonyBySource {
  source: string;
  source_display: string;
  count: number;
  total_amount: number;
}

export interface SonyByType {
  type: string;
  type_display: string;
  count: number;
  total_amount: number;
}

export interface SonyByCategory {
  category_id: number;
  category_title: string;
  category_type: string;
  count: number;
  total_amount: number;
}

export interface SonyByStage {
  stage_id: number;
  stage_title: string;
  count: number;
  total_amount: number;
}

export interface SonyReport {
  summary: SonyReportSummary;
  by_source: SonyBySource[];
  by_type: SonyByType[];
  by_category: SonyByCategory[];
  by_stage: SonyByStage[];
}

export interface ProductReportByCategory {
  category: string;
  count: number;
  total_amount: number;
}
