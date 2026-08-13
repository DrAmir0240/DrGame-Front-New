export interface Permission {
  id: number;
  module: string;
  module_display: string;
  action: string;
  action_display: string;
  extra_flag: string | null;
}

export interface RoleListItem {
  id: number;
  role_name: string;
  description: string | null;
  permission_count: number;
  employee_count: number;
}

export interface RoleDetail extends RoleListItem {
  permissions: Permission[];
}

export interface RoleFormData {
  role_name: string;
  description: string;
  permission_ids: number[];
}

export interface EmployeeRolesResponse {
  id: number;
  full_name: string;
  roles: { id: number; role_name: string }[];
}

export interface SonyOrderCategory {
  id: number;
  title: string;
  type: "buy" | "rent";
  type_display: string;
  rent_time_days: number | null;
  account_capacity: string | null;
  account_capacity_display: string | null;
  base_price: number;
}

export interface SonyOrderCategoryFormData {
  title: string;
  type: "buy" | "rent";
  rent_time_days: number | null;
  account_capacity: string | null;
  base_price: number;
}

export interface SellMethod {
  id: number;
  title: string;
  category_id: number;
  category_title: string;
  price: number;
}

export interface SellMethodFormData {
  title: string;
  category_id: number;
  price: number;
}

export interface ProductOrderCategory {
  id: number;
  title: string;
  description: string | null;
}

export interface RepairOrderCategory {
  id: number;
  title: string;
  description: string | null;
}

export interface SonyBank {
  id: number;
  title: string;
  description: string | null;
}

export interface BankAccount {
  id: number;
  title: string;
  account_number: string;
  sheba: string;
  description: string | null;
}

export interface BankAccountFormData {
  title: string;
  account_number: string;
  sheba: string;
  description: string | null;
}

export interface InvoiceCategory {
  id: number;
  title: string;
  direction: "in" | "out";
  direction_display: string;
  description: string | null;
}

export interface InvoiceCategoryFormData {
  title: string;
  direction: "in" | "out";
  description: string | null;
}
