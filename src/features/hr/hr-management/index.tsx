"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { hrManagementTabs } from "./constants";
import ResumeTab from "./components/ResumeTab";
import ArrivalTab from "./components/ArrivalTab";
import RequestTab from "./components/RequestTab";
import PayrollTab from "./components/PayrollTab";
import OvertimeTab from "./components/OvertimeTab";

export default function HrManagementPage() {
  const [activeTab, setActiveTab] = useState("resumes");

  return (
    <div className="space-y-6">
      <PageHeader
        title="مدیریت منابع انسانی"
        description="استخدام، حضور و غیاب، درخواست‌ها، فیش حقوقی و اضافه‌کاری"
      />

      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          {hrManagementTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="resumes">
          <ResumeTab />
        </TabsContent>

        <TabsContent value="arrivals">
          <ArrivalTab />
        </TabsContent>

        <TabsContent value="requests">
          <RequestTab />
        </TabsContent>

        <TabsContent value="payrolls">
          <PayrollTab />
        </TabsContent>

        <TabsContent value="overtimes">
          <OvertimeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
