"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Search, UserCircle, X } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Dialog, Input } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useEmployeeList } from "@/features/hr/employee-files/apis";
import { useEmployeeRoles, useRolesList, useAssignRolesToEmployee, useRemoveRolesFromEmployee } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { Employee } from "@/features/hr/employee-files/types";

export default function EmployeeRolesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const { data: employeeList } = useEmployeeList({ limit: 200 });
  const employees = employeeList?.results ?? [];

  const { data: roles = [], isLoading: rolesLoading } = useEmployeeRoles(selected?.id ?? null);
  const { data: allRoles = [] } = useRolesList();
  const assignMutation = useAssignRolesToEmployee();
  const removeMutation = useRemoveRolesFromEmployee();

  const filteredEmployees = search.trim()
    ? employees.filter((e) => e.full_name?.toLowerCase().includes(search.toLowerCase()))
    : employees;

  const assignedIds = new Set(roles.map((r) => r.id));
  const availableRoles = allRoles.filter((r) => !assignedIds.has(r.id));

  const toggleRole = async (roleId: number, checked: boolean) => {
    if (!selected) return;
    if (checked) {
      await assignMutation.mutateAsync({ employeePk: selected.id, role_ids: [roleId] });
    } else {
      await removeMutation.mutateAsync({ employeePk: selected.id, role_ids: [roleId] });
    }
    setOpenAdd(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="نقش‌های کارمند" description="مشاهده و مدیریت نقش‌های هر کارمند" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">انتخاب کارمند</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-3">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجوی نام کارمند..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9"
              />
            </div>
            <div className="max-h-96 space-y-1 overflow-y-auto">
              {filteredEmployees.map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => { setSelected(emp); setSearch(""); }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    selected?.id === emp.id
                      ? "bg-primary text-background"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <UserCircle className="h-5 w-5 shrink-0" />
                  <span className="font-medium">{emp.full_name}</span>
                  {emp.roles_detail?.length > 0 && (
                    <Badge variant="secondary" className="mr-auto text-xs">
                      {emp.roles_detail.length} نقش
                    </Badge>
                  )}
                </button>
              ))}
              {filteredEmployees.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">کارمندی یافت نشد</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              نقش‌های {selected ? `«${selected.full_name}»` : ""}
            </CardTitle>
            {selected && (
              <Button size="sm" onClick={() => setOpenAdd(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                افزودن نقش
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selected ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                ابتدا یک کارمند را از پنل سمت راست انتخاب کنید.
              </p>
            ) : rolesLoading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال بارگذاری...
              </div>
            ) : roles.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">این کارمند هیچ نقشی ندارد.</p>
            ) : (
              <div className="space-y-2">
                {roles.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-700"
                  >
                    <div>
                      <p className="font-medium">{r.role_name}</p>
                      {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{r.permission_count} پرمیشن</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleRole(r.id, false)}
                        disabled={removeMutation.isPending}
                      >
                        <X className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={openAdd}
        onOpenChange={(v) => !v && setOpenAdd(false)}
        title="افزودن نقش"
        description={`انتخاب نقش برای «${selected?.full_name ?? ""}»`}
        className="max-w-md"
      >
        <div className="space-y-2">
          {availableRoles.map((r) => (
            <button
              key={r.id}
              onClick={() => toggleRole(r.id, true)}
              disabled={assignMutation.isPending}
              className="flex w-full items-center justify-between rounded-lg border border-neutral-200 px-4 py-3 text-sm transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
            >
              <span className="font-medium">{r.role_name}</span>
              <Badge variant="secondary">{r.permission_count} پرمیشن</Badge>
            </button>
          ))}
          {availableRoles.length === 0 && (
            allRoles.length === 0 ? (
              <div className="space-y-3 py-6 text-center">
                <p className="text-sm text-muted-foreground">هنوز هیچ نقشی در سیستم تعریف نشده است.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/admin/settings/roles")}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  رفتن به صفحه مدیریت نقش‌ها
                </Button>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                تمام نقش‌های موجود قبلاً به این کارمند اختصاص داده شده است.
              </p>
            )
          )}
        </div>
      </Dialog>
    </div>
  );
}
