export type RequestStatus = "waiting" | "accepted" | "rejected";
export type PaymentStatus = "unpaid" | "partial" | "paid";
export type InvoiceStatus = "draft" | "primary" | "finalize";

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Employee {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  profile_picture: string | null;
  roles: number[];
  roles_detail: { id: number; role_name: string; description: string }[];
  is_deleted: boolean;
  created_at: string;
}

export interface Resume {
  id: number;
  first_name: string;
  last_name: string;
  national_code: string;
  birth_date: string;
  phone_number: string;
  description: string;
  resume_file: string | null;
  user: number;
  user_detail: {
    id: number;
    phone: string;
    full_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ResumeFormData {
  first_name: string;
  last_name: string;
  national_code: string;
  birth_date: string;
  phone_number: string;
  description: string;
  resume_file?: File | string | null;
  user: number;
}

export interface Arrival {
  id: number;
  employee: number;
  employee_detail: Employee;
  check_in: string;
  check_out: string | null;
  duration_minutes: number | null;
  created_at: string;
}

export interface ArrivalFormData {
  employee: number;
  check_in: string;
  check_out?: string;
}

export interface ArrivalFilters {
  employee?: number;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}

export interface RequestType {
  id: number;
  title: string;
  needs_approval: boolean;
  description: string;
}

export interface RequestTypeFormData {
  title: string;
  needs_approval: boolean;
  description: string;
}

export interface EmployeeRequest {
  id: number;
  employee: number;
  employee_detail: Employee;
  title: string;
  request_type: number;
  request_type_detail: RequestType;
  status: RequestStatus;
  description: string;
  created_at: string;
}

export interface EmployeeRequestFormData {
  employee: number;
  title: string;
  request_type: number;
  description: string;
}

export interface RequestFilters {
  employee?: number;
  status?: string;
  request_type?: number;
  limit?: number;
  offset?: number;
}

export interface Payroll {
  id: number;
  account_side: number;
  account_side_detail: { id: number; name: string; type: string };
  amount: number;
  paid_amount: number;
  remaining_amount: number;
  payment_status: PaymentStatus;
  status: InvoiceStatus;
  created_at: string;
}

export interface PayrollDetail {
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
  description: string;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
}

export interface PayrollDetailResponse extends Payroll {
  category: number;
  discount: number;
  description: string;
  payroll_detail: PayrollDetail;
  updated_at: string;
}

export interface PayrollFormData {
  account_side: number;
  category?: number;
  discount: number;
  description: string;
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
  payroll_description: string;
}

export interface Overtime {
  id: number;
  employee: number;
  employee_detail: Employee;
  date: string;
  hours: string;
  description: string;
  is_approved: boolean;
  approved_by: number | null;
  approved_by_detail: Employee | null;
  created_at: string;
  updated_at: string;
}

export interface OvertimeFormData {
  employee: number;
  date: string;
  hours: number;
  description: string;
}

export interface OvertimeFilters {
  employee?: number;
  date_from?: string;
  date_to?: string;
  is_approved?: string;
  limit?: number;
  offset?: number;
}

export interface AccountSide {
  id: number;
  name: string;
  type: string;
}

export interface InvoiceCategory {
  id: number;
  title: string;
}
