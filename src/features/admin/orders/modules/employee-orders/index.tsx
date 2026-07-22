"use client";

import type { OrderPrefix } from "../../types";
import EmployeeOrdersTab from "./components/EmployeeOrdersTab";

interface Props {
  orderPrefix: OrderPrefix;
}

export default function EmployeeOrdersPage({ orderPrefix }: Props) {
  return <EmployeeOrdersTab orderPrefix={orderPrefix} />;
}
