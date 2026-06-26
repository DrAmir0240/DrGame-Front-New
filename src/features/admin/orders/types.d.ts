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

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
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
  items?: OrderItem[];

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
  channel: OrderChannel;
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
