"use client";

import { Suspense, useState } from "react";
import { PageHeader } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import ExpenseList from "@/features/admin/accounting/components/ExpenseList";
import IncomeList from "@/features/admin/accounting/components/IncomeList";
import PayrollList from "@/features/admin/accounting/components/PayrollList";
import PurchaseList from "@/features/admin/accounting/components/PurchaseList";
import SalesList from "@/features/admin/accounting/components/SalesList";

const accountingSubTabs = [
  { value: "expense", label: "هزینه‌ها" },
  { value: "income", label: "درآمدها" },
  { value: "payroll", label: "فیش‌های حقوقی" },
  { value: "purchase", label: "خرید" },
  { value: "sales", label: "فروش" },
];

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("expense");

  return (
    <Suspense>
      <PageHeader title="حسابداری" description="مدیریت درآمدها، هزینه‌ها، خرید، فروش و فیش‌های حقوقی" />
      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          {accountingSubTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="expense">
          <ExpenseList />
        </TabsContent>
        <TabsContent value="income">
          <IncomeList />
        </TabsContent>
        <TabsContent value="payroll">
          <PayrollList />
        </TabsContent>
        <TabsContent value="purchase">
          <PurchaseList />
        </TabsContent>
        <TabsContent value="sales">
          <SalesList />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
