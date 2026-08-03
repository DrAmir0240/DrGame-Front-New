export type OrderType = "product" | "sony" | "repair";

export type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "preparing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "rejected"
  | string;

export interface StageLog {
  id: number;
  stage: string;
  stage_display?: string;
  created_at: string;
  note?: string | null;
}

export interface OrderItem {
  id: number;
  title: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image?: string | null;
}

export interface OrderBase {
  id: number;
  type: OrderType;
  status: OrderStatus;
  status_display?: string;
  total_amount: number;
  created_at: string;
  updated_at?: string;
  stage_logs?: StageLog[];
  items?: OrderItem[];
  // فیلدهای اختصاصی هر نوع
  tracking_code?: string | null;
  address?: string | null;
  description?: string | null;
  // sony
  console_type?: string | null;
  // repair
  device_model?: string | null;
  problem_description?: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}