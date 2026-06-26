"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Button, Input } from "@/components/ui";
import type { RepairFormData, RepairStatus } from "./types";
import { initialRepairs } from "./constants";
import NewRepairDialog from "./components/NewRepairDialog";
import RepairsList from "./components/RepairsList";
import type { RepairOrder } from "./types";

export default function RepairsPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [repairs, setRepairs] = useState<RepairOrder[]>(initialRepairs);

  function handleStatusChange(id: number, status: RepairStatus) {
    setRepairs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  }

  function handleSubmit(form: RepairFormData) {
    const newRepair: RepairOrder = {
      id: Date.now(),
      created_date: new Date().toISOString(),
      device_type: form.device_type,
      device_model: form.device_model,
      issue_description: form.issue_description,
      notes: form.notes,
      technician_price: null,
      final_price: null,
      status: "pending",
    };
    setRepairs((prev) => [newRepair, ...prev]);
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="تعمیرات" description="مدیریت سفارش‌های تعمیر">
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> سفارش تعمیر جدید
        </Button>
      </PageHeader>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="جستجوی مدل یا مشکل..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      <RepairsList
        orders={repairs}
        search={search}
        onStatusChange={handleStatusChange}
      />

      <NewRepairDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
