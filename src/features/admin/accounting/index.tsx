"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { accountingTabs } from "./constants";
import FinancialReports from "./components/FinancialReports";
import DailyLedger from "./components/DailyLedger";
import ExpenseList from "./components/ExpenseList";
import IncomeList from "./components/IncomeList";
import PayrollList from "./components/PayrollList";
import PurchaseList from "./components/PurchaseList";
import SalesList from "./components/SalesList";

const accountingSubTabs = [
  { value: "expense", label: "هزینه‌ها" },
  { value: "income", label: "درآمدها" },
  { value: "payroll", label: "فیش‌های حقوقی" },
  { value: "purchase", label: "خرید" },
  { value: "sales", label: "فروش" },
];

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState("reports");
  const [activeAccountingSubTab, setActiveAccountingSubTab] = useState("expense");

  return (
    <div>
      <PageHeader
        title="حسابداری و دفتر"
        description="مدیریت درآمدها، هزینه‌ها، خرید، فروش، فیش‌های حقوقی و گزارشات مالی"
      />

      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          {accountingTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="reports">
          <FinancialReports />
        </TabsContent>

        <TabsContent value="daily">
          <DailyLedger />
        </TabsContent>

        <TabsContent value="accounting">
          <Tabs dir="rtl" value={activeAccountingSubTab} onValueChange={setActiveAccountingSubTab} className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
