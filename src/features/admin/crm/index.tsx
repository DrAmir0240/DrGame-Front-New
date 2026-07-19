"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { crmTabs } from "./constants";
import type { Customer } from "./types";
import CustomerListPanel from "./components/CustomerListPanel";
import CustomerDetailPanel from "./components/CustomerDetailPanel";
import CustomerFormDialog from "./components/CustomerFormDialog";
import SendSmsTab from "./components/SendSmsTab";

export default function CrmPage() {
  const [activeTab, setActiveTab] = useState("files");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="باشگاه مشتریان (CRM)"
        description="مدیریت پرونده مشتریان، پروفایل تجاری و ارسال پیامک"
      />

      <Tabs dir="rtl" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          {crmTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="files">
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 min-h-[600px]">
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <CustomerListPanel
                selectedId={selectedCustomer?.id ?? null}
                onSelect={setSelectedCustomer}
                onAddNew={() => setCreateOpen(true)}
                refreshKey={refreshKey}
              />
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              {selectedCustomer ? (
                <CustomerDetailPanel
                  customer={selectedCustomer}
                  onBack={() => setSelectedCustomer(null)}
                  onRefresh={handleRefresh}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
                  <p className="text-sm">یک مشتری را از لیست انتخاب کنید</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sms">
          <SendSmsTab />
        </TabsContent>
      </Tabs>

      <CustomerFormDialog
        open={createOpen}
        editing={null}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setCreateOpen(false);
          handleRefresh();
        }}
      />
    </div>
  );
}
