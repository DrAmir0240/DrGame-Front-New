export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface EmployeeRole {
  id: number;
  role_name: string;
  description: string;
}

export interface EmployeeRoleDetail {
  id: number;
  role_name: string;
  description: string;
}

export interface Employee {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  employee_id: string;
  profile_picture: string | null;
  roles: number[];
  roles_detail: EmployeeRoleDetail[];
  is_deleted: boolean;
  created_at: string;
}

export interface EmployeeDetail extends Employee {
  national_code: string;
  birth_date: string;
  has_commission: boolean;
  commission_amount: number;
  wallet_balance: number;
  last_arrival: {
    check_in: string;
    check_out: string;
  } | null;
  stats: {
    total_requests: number;
    pending_requests: number;
    total_files: number;
    total_overtimes: number;
    pending_overtimes: number;
  };
  updated_at: string;
}

export interface EmployeeFile {
  id: number;
  employee: number;
  title: string;
  file: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  user: number;
  first_name: string;
  last_name: string;
  national_code: string;
  birth_date: string;
  employee_id: string;
  profile_picture?: File | string | null;
  has_commission: boolean;
  commission_amount: number;
  roles: number[];
}

export interface EmployeeFilters {
  first_name?: string;
  last_name?: string;
  national_code?: string;
  employee_id?: string;
  role?: number;
  limit?: number;
  offset?: number;
}
