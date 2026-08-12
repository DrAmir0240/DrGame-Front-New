"use client";

import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { DataTable, PageHeader } from "@/components/shared";
import { usePermissionsList } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { Permission } from "../types";
import { DataTableColumn } from "@/components/shared/data-table/data-table";

export default function PermissionsPage() {
  const [module, setModule] = useState<string>("all");
  const [action, setAction] = useState<string>("all");
  const { data: permissions = [], isLoading } = usePermissionsList({
    module: module === "all" ? undefined : module,
    action: action === "all" ? undefined : action,
  });

  const modules = useMemo(
    () => Array.from(new Map(permissions.map((p) => [p.module, p.module_display])).entries()).sort((a, b) => a[1].localeCompare(b[1])),
    [permissions]
  );
  const actions = useMemo(
    () => Array.from(new Map(permissions.map((p) => [p.action, p.action_display])).entries()).sort((a, b) => a[1].localeCompare(b[1])),
    [permissions]
  );

  const columns: DataTableColumn<Permission>[] = [
    {
      header: "ماژول",
      render: (row) => <span className="font-medium">{row.module_display}</span>,
    },
    {
      header: "اکشن",
      render: (row) => (
        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
          {row.action_display}
        </span>
      ),
    },
    {
      header: "فلگ اضافه",
      render: (row) => row.extra_flag ?? <span className="text-muted-foreground">—</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="مدیریت پرمیشن‌ها" description="لیست دسترسی‌های تعریف‌شده در سیستم" />

      <div className="flex flex-wrap items-center gap-3">
        <Select value={module} onValueChange={setModule}>
          <SelectTrigger label="ماژول" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه ماژول‌ها</SelectItem>
            {modules.map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={action} onValueChange={setAction}>
          <SelectTrigger label="اکشن" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه اکشن‌ها</SelectItem>
            {actions.map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={permissions}
        isLoading={isLoading}
        emptyMessage="پرمیشنی یافت نشد"
      />
    </div>
  );
}
