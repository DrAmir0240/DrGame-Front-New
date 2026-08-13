export interface CommissionTransaction {
  id: number;
  amount: number;
  description: string;
  created_at: string;
}

export interface PayrollPreview {
  employee_id: number;
  wallet_balance: number;
  commission_total: number;
  unsettled_transactions: CommissionTransaction[];
  period_from: string;
  period_to: string;
}

export interface PayrollIssueFormData {
  employee_id: number;
  period_from: string;
  period_to: string;
  base_salary: number;
  bonus: number;
  housing_allowance: number;
  food_allowance: number;
  transportation_allowance: number;
  insurance_deduction: number;
  tax_deduction: number;
  loan_deduction: number;
  other_deductions: number;
  description?: string;
}

export interface PayrollListItem {
  id: number;
  account_side_id: number;
  account_side_name: string;
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: "unpaid" | "partial" | "paid";
  status: "draft" | "primary" | "finalize";
  period_from: string;
  period_to: string;
  created_at: string;
}

export interface PayrollDetailItem {
  id: number;
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
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
}

export interface PayrollDetail {
  id: number;
  account_side_id: number;
  account_side_name: string;
  amount: number;
  discount: number;
  paid_amount: number;
  remaining_amount: number;
  status: "draft" | "primary" | "finalize";
  payment_status: "unpaid" | "partial" | "paid";
  description?: string;
  payroll_detail: PayrollDetailItem;
  commission_transactions: CommissionTransaction[];
  created_at: string;
  updated_at: string;
}

export interface PayrollPayFormData {
  employee_id: number;
  amount: number;
  bank_account_id: number;
  invoice_ids: number[];
  description?: string;
}

export interface PayrollPayResponse {
  id: number;
  amount: number;
  wallet_balance: number;
}
