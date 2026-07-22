export type OrderPrefix = "sony-account" | "repair" | "product";

export interface Category {
  id: number;
  title: string;
  description?: string;
  type?: string;
  account_capacity?: string;
  rent_time_days?: number | null;
}

export interface EmployeeRoleDetail {
  id: number;
  role_name: string;
  description?: string;
}

export interface Stage {
  id: number;
  category: number;
  title: string;
  description?: string;
  order: number;
  is_start: boolean;
  is_end: boolean;
  employee_role: number;
  employee_role_detail: EmployeeRoleDetail;
  created_at: string;
  updated_at: string;
}

export interface StageListItem {
  id: number;
  category: number;
  title: string;
  description?: string;
  order: number;
  is_start: boolean;
  is_end: boolean;
  employee_role: number;
  employee_role_detail: EmployeeRoleDetail;
}

export interface StageAction {
  id: number;
  stage?: number;
  title: string;
  action_type: string;
  description?: string;
  is_required: boolean;
  order: number;
  target_field?: string;
}

export interface StageDetail extends Stage {
  actions: StageAction[];
}

export interface StageQueue {
  id: number;
  title: string;
  order: number;
  category_id: number;
  category_title: string;
}

export interface OrderCard {
  id: number;
  customer_name: string;
  category_title?: string;
  stage_title?: string;
  source?: string;
  type?: string;
  amount?: number;
  repair_fee?: number;
  final_amount?: number;
  pending_actions_count: number;
  created_at: string;
}

export interface CustomerDetail {
  id: number;
  full_name: string;
  phone?: string;
}

export interface SonyAccountOrderItem {
  id: number;
  sony_account_order: number;
  sony_account: number;
  employee: number;
  created_at: string;
}

export interface SonyAccountOrderConsole {
  id: number;
  customer: number;
  serial_number: string;
  created_at: string;
}

export interface RepairOrderDevice {
  id: number;
  title: string;
  serial_number: string;
  created_at: string;
}

export interface ProductOrderItem {
  id: number;
  product: number;
  title: string;
  unit_price: number;
  amount: number;
  created_at: string;
}

export interface ActionLog {
  id: number;
  action: number;
  action_title: string;
  performed_by: number;
  performed_by_name: string;
  note?: string;
  created_at: string;
}

export interface StageLog {
  id: number;
  from_stage: number;
  from_stage_title: string;
  to_stage: number;
  to_stage_title: string;
  changed_by: number;
  changed_by_name: string;
  note?: string;
  created_at: string;
}

export interface SonyAccountOrderDetail {
  id: number;
  customer: number;
  customer_detail: CustomerDetail;
  category: number;
  category_detail: Category;
  stage: number;
  stage_detail: StageDetail;
  source: string;
  type: string;
  amount: number;
  items: SonyAccountOrderItem[];
  consoles: SonyAccountOrderConsole[];
  action_logs: ActionLog[];
  stage_logs: StageLog[];
  created_at: string;
  updated_at: string;
}

export interface RepairOrderDetail {
  id: number;
  customer: number;
  customer_detail: CustomerDetail;
  category: number;
  category_detail: Category;
  stage: number;
  stage_detail: StageDetail;
  repair_fee: number;
  final_amount: number;
  devices: RepairOrderDevice[];
  action_logs: ActionLog[];
  stage_logs: StageLog[];
  created_at: string;
  updated_at: string;
}

export interface ProductOrderDetail {
  id: number;
  customer: number;
  customer_detail: CustomerDetail;
  stage: number;
  stage_detail: StageDetail;
  description?: string;
  amount: number;
  items: ProductOrderItem[];
  action_logs: ActionLog[];
  stage_logs: StageLog[];
  created_at: string;
  updated_at: string;
}

export interface OrderAction {
  id: number;
  title: string;
  action_type: string;
  target_field?: string;
  is_required: boolean;
  order: number;
  is_done: boolean;
}

export interface ExecuteActionResponse {
  status: string;
  action_type?: string;
}

export interface AdvanceStageResponse {
  status: string;
  new_stage: {
    id: number;
    title: string;
  };
}

export interface SonyAccountCategoryForm {
  title: string;
  type: string;
  account_capacity: string;
  rent_time_days?: number | null;
}

export interface RepairCategoryForm {
  title: string;
  description: string;
}

export interface ProductCategoryForm {
  title: string;
  description: string;
}

export interface StageForm {
  category: number;
  title: string;
  description: string;
  order: number;
  employee_role: number;
  is_start: boolean;
  is_end: boolean;
}

export interface ActionForm {
  stage: number;
  title: string;
  action_type: string;
  description: string;
  is_required: boolean;
  order: number;
  target_field?: string;
}

export interface ExecuteActionForm {
  action_id: number;
  value?: unknown;
  item_id?: number;
  note?: string;
}

// ── Legacy types (used by existing old-order modules) ──

export type OrderType =
  | "physical_sale"
  | "account_sale"
  | "repair"
  | "xbox_sale"
  | "nintendo_sale";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "dispatched"
  | "delivered"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderChannel = "in_store" | "online";

export interface LegacyOrderItem {
  id: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  itemType?: "product" | "service";
}

export interface Order {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  customerId: string;
  branchId: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdDate: string;
  discountNote?: string;
  items?: LegacyOrderItem[];
  subtotal?: number;
  discountAmount?: number;
  taxAmount?: number;
  courierName?: string;
  courierPhone?: string;
  courierFee?: number;
  notes?: string;
  createdAt: string;
}

export interface OrderForm {
  orderType: OrderType;
  channel: OrderChannel | string;
  branchId: string;
  customerId: string;
  discountAmount: number;
  discountNote: string;
  notes: string;
  courierName: string;
  courierPhone: string;
  courierFee: number;
}

export interface Product {
  id: string;
  name: string;
  sellPrice: number;
}

export interface Branch {
  id: string;
  name: string;
}

export interface Customer {
  id: string;
  fullName: string;
}

export type OrderItem = LegacyOrderItem;
