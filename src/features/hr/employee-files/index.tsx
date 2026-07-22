"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/shared";
import EmployeeListPanel from "./components/EmployeeListPanel";
import EmployeeProfilePanel from "./components/EmployeeProfilePanel";
import EmployeeFormDialog from "./components/EmployeeFormDialog";
import type { Employee } from "./types";

export default function EmployeeFilesPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="پرونده کارمندان"
        description="مدیریت اطلاعات، فایل‌ها و پروفایل کارمندان"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 min-h-[600px]">
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <EmployeeListPanel
            selectedId={selectedEmployee?.id ?? null}
            onSelect={setSelectedEmployee}
            onAddNew={() => setCreateOpen(true)}
            refreshKey={refreshKey}
          />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          {selectedEmployee ? (
            <EmployeeProfilePanel
              employee={selectedEmployee}
              onBack={() => setSelectedEmployee(null)}
              onRefresh={handleRefresh}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
              <p className="text-sm">یک کارمند را از لیست انتخاب کنید</p>
            </div>
          )}
        </div>
      </div>

      <EmployeeFormDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setCreateOpen(false);
          handleRefresh();
        }}
        employee={null}
      />
    </div>
  );
}
