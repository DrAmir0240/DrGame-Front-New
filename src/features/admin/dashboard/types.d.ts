export type OrderType = "physical_sale" | "account_sale" | "repair" | "xbox_sale";

export type OrderStatus = "pending" | "completed";

export interface DashboardOrder {
  id: string;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  total: number;
}

export interface Account {
  is_active: boolean;
}

export interface RepairItem {
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

export interface Branch {
  name: string;
}

export interface OrderTypeDataItem {
  name: string;
  value: number;
}
