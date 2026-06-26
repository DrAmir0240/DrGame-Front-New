import { DashboardOrder, OrderTypeDataItem } from "../types";

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


