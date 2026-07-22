"use client";

import { Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { legacyOrderTypeLabels as orderTypeLabels } from "../../../constants";
import type { Branch, Customer, OrderForm } from "../../../types";

interface Props {
  form: OrderForm;
  branches: Branch[];
  customers: Customer[];
  onChange: (form: OrderForm) => void;
}

export default function OrderInfoCard({ form, branches, customers, onChange }: Props) {
  const set = (field: keyof OrderForm, value: string) =>
    onChange({ ...form, [field]: value });

  return (
    <Card>
      <CardHeader>
        <CardTitle>اطلاعات سفارش</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Select value={form.orderType} onValueChange={(v) => set("orderType", v)}>
            <SelectTrigger label="نوع سفارش">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(orderTypeLabels) as [string, string][]).map(([k, label]) => (
                <SelectItem key={k} value={k}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Select value={form.channel} onValueChange={(v) => set("channel", v)}>
            <SelectTrigger label="کانال">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in_store">حضوری</SelectItem>
              <SelectItem value="online">آنلاین</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Select value={form.branchId} onValueChange={(v) => set("branchId", v)}>
            <SelectTrigger label="شعبه">
              <SelectValue placeholder="انتخاب..." />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Select value={form.customerId} onValueChange={(v) => set("customerId", v)}>
            <SelectTrigger label="مشتری">
              <SelectValue placeholder="انتخاب..." />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.fullName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
