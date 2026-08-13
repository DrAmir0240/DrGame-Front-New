export type PurchaseOrderStatus = "draft" | "confirmed" | "received" | "cancelled";

export interface PurchaseOrderItem {
  id: number;
  product_id: number;
  product_title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  supplier_name: string;
  employee_id: number;
  status: PurchaseOrderStatus;
  total_amount: number;
  received_at: string | null;
  description?: string;
  items: PurchaseOrderItem[];
  created_at: string;
  updated_at: string;
}

export interface CreatePurchaseOrderItem {
  product: number;
  quantity: number;
  unit_price: number;
}

export interface CreatePurchaseOrderFormData {
  supplier: number;
  description?: string;
  items: CreatePurchaseOrderItem[];
}

export interface PurchaseOrderFilters {
  supplier?: number;
  status?: string;
  employee?: number;
  ordering?: string;
}
