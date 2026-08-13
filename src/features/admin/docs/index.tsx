"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { docsTabs } from "./constants";
import DocumentSection from "./components/DocumentSection";
import RealAssetsSection from "./components/RealAssetsSection";

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("documents");

  return (
    <div className="space-y-6">
      <PageHeader
        title="اسناد و دارایی‌ها"
        description="مدیریت اسناد، دسته‌بندی‌ها و دارایی‌های حقیقی"
      />

      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          {docsTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="documents">
          <DocumentSection />
        </TabsContent>

        <TabsContent value="real-assets">
          <RealAssetsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
