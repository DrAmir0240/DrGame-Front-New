import type { SupplierType } from "../shared/types";

export interface Supplier {
  id: number;
  name: string;
  type: SupplierType;
  phone: string;
  address: string;
  account_number: string;
  sheba: string;
  national_id: string;
  tax_id: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface SupplierFormData {
  name: string;
  type: SupplierType;
  phone: string;
  address: string;
  account_number: string;
  sheba: string;
  national_id: string;
  tax_id: string;
  description: string;
}

export const SUPPLIER_TYPE_MAP: Record<
  SupplierType,
  { label: string; color: string }
> = {
  real: { label: "حقیقی", color: "bg-blue-100 text-blue-700 border-blue-200" },
  legal: {
    label: "حقوقی",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export const supplierTypeOptions = [
  { value: "all", label: "همه" },
  { value: "real", label: "حقیقی" },
  { value: "legal", label: "حقوقی" },
];
