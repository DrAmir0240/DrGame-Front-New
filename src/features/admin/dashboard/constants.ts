import type { Account, Branch, DashboardOrder, OrderType, OrderTypeDataItem, RepairItem } from "./types";

export const COLORS = ["#8B5CF6", "#6366F1", "#A855F7", "#7C3AED", "#C084FC"];

export const mockOrders: DashboardOrder[] = [
  { id: "1", order_number: "ORD-1001", order_type: "physical_sale", status: "completed", total: 12500000 },
  { id: "2", order_number: "ORD-1002", order_type: "account_sale", status: "pending", total: 3800000 },
  { id: "3", order_number: "ORD-1003", order_type: "repair", status: "completed", total: 950000 },
  { id: "4", order_number: "ORD-1004", order_type: "xbox_sale", status: "pending", total: 7600000 },
  { id: "5", order_number: "ORD-1005", order_type: "physical_sale", status: "completed", total: 4500000 },
  { id: "6", order_number: "ORD-1006", order_type: "account_sale", status: "completed", total: 2100000 },
];

export const productsCount = 587;
export const customersCount = 3421;

export const accounts: Account[] = [
  { is_active: true }, { is_active: true }, { is_active: true },
  { is_active: true }, { is_active: false }, { is_active: true },
  { is_active: true }, { is_active: true },
];

export const repairs: RepairItem[] = [
  { status: "pending" }, { status: "in_progress" }, { status: "completed" },
  { status: "pending" }, { status: "cancelled" }, { status: "in_progress" },
];

export const branches: Branch[] = [
  { name: "شعبه مرکزی" }, { name: "شعبه ولیعصر" },
  { name: "شعبه ستارخان" }, { name: "شعبه تجریش" }, { name: "شعبه کرج" },
];


export function getTotalRevenue(orders: DashboardOrder[]) {
  return orders.reduce((sum, order) => sum + order.total, 0);
}

export function getPendingOrdersCount(orders: DashboardOrder[]) {
  return orders.filter((o) => o.status === "pending").length;
}

export function getOrderTypeData(orders: DashboardOrder[]): OrderTypeDataItem[] {
  return [
    { name: "فروش کالا", value: orders.filter((o) => o.order_type === "physical_sale").length },
    { name: "فروش اکانت", value: orders.filter((o) => o.order_type === "account_sale").length },
    { name: "تعمیرات", value: orders.filter((o) => o.order_type === "repair").length },
    { name: "Xbox", value: orders.filter((o) => o.order_type === "xbox_sale").length },
  ];
}

export const orderTypeLabel: Record<OrderType, string> = {
  physical_sale: "فروش کالا",
  account_sale: "فروش اکانت",
  repair: "تعمیرات",
  xbox_sale: "Xbox",
};
