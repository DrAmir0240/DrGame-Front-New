"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2, Pencil, ShieldCheck } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Dialog, Input, Textarea } from "@/components/ui";
import { PageHeader } from "@/components/shared";
import { useRoleDetail, usePermissionsList, useUpdateRole, useAssignPermissionsToRole, useRemovePermissionsFromRole } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import type { Permission } from "../types";

interface FormValues {
  role_name: string;
  description: string;
}

export default function RoleDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const { data: role, isLoading } = useRoleDetail(id);
  const { data: allPermissions = [] } = usePermissionsList();
  const updateMutation = useUpdateRole();
  const assignMutation = useAssignPermissionsToRole();
  const removeMutation = useRemovePermissionsFromRole();

  const [openEdit, setOpenEdit] = useState(false);
  const [busy, setBusy] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: { role_name: "", description: "" },
  });

  useEffect(() => {
    if (role) reset({ role_name: role.role_name, description: role.description ?? "" });
  }, [role, openEdit, reset]);

  const currentPermissionIds = useMemo(
    () => new Set((role?.permissions ?? []).map((p) => p.id)),
    [role]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of allPermissions) {
      const list = map.get(p.module_display) ?? [];
      list.push(p);
      map.set(p.module_display, list);
    }
    return Array.from(map.entries());
  }, [allPermissions]);

  const togglePermission = async (permission: Permission, checked: boolean) => {
    setBusy(true);
    try {
      if (checked) {
        await assignMutation.mutateAsync({ id, permission_ids: [permission.id] });
      } else {
        await removeMutation.mutateAsync({ id, permission_ids: [permission.id] });
      }
    } finally {
      setBusy(false);
    }
  };

  const submitEdit = async (values: FormValues) => {
    await updateMutation.mutateAsync({
      id,
      payload: { role_name: values.role_name.trim(), description: values.description.trim() },
    });
    setOpenEdit(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="جزئیات نقش" description={role ? `مدیریت نقش «${role.role_name}»` : "بارگذاری..."}>
        <Button variant="outline" onClick={() => router.push("/admin/settings/roles")} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          بازگشت به نقش‌ها
        </Button>
      </PageHeader>
      <SettingsNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              اطلاعات نقش
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setOpenEdit(true)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
                <div className="h-3 w-full animate-pulse rounded bg-neutral-200 dark:bg-neutral-700" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">نام نقش</p>
                  <p className="font-semibold text-lg">{role?.role_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">توضیحات</p>
                  <p className="text-sm">{role?.description ?? "—"}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-800/50">
                    <p className="text-xl font-bold">{role?.permission_count ?? 0}</p>
                    <p className="text-xs text-muted-foreground">پرمیشن</p>
                  </div>
                  <div className="rounded-lg bg-neutral-50 p-3 text-center dark:bg-neutral-800/50">
                    <p className="text-xl font-bold">{role?.employee_count ?? 0}</p>
                    <p className="text-xs text-muted-foreground">کارمند</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">مدیریت پرمیشن‌ها</CardTitle>
            <p className="text-sm text-muted-foreground">
              {currentPermissionIds.size} پرمیشن انتخاب شده — با تیک زدن، پرمیشن اضافه یا حذف می‌شود.
            </p>
          </CardHeader>
          <CardContent className="max-h-[70vh] space-y-5 overflow-y-auto pl-2">
            {grouped.map(([module, perms]) => (
              <div key={module}>
                <h4 className="mb-2 text-sm font-semibold text-muted-foreground">{module}</h4>
                <div className="space-y-1 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  {perms.map((p) => {
                    const checked = currentPermissionIds.has(p.id);
                    return (
                      <label
                        key={p.id}
                        className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                      >
                        <span className="flex items-center gap-3">
                          <Checkbox
                            checked={checked}
                            disabled={busy}
                            onCheckedChange={(v) => togglePermission(p, Boolean(v))}
                          />
                          <span className="font-medium">{p.action_display}</span>
                        </span>
                        {p.extra_flag && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                            {p.extra_flag}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            {grouped.length === 0 && (
              <p className="text-sm text-muted-foreground">هیچ پرمیشنی در سیستم تعریف نشده است.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={openEdit}
        onOpenChange={(v) => !v && setOpenEdit(false)}
        title="ویرایش نقش"
        className="max-w-md"
        footer={
          <div className="flex w-full gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setOpenEdit(false)} disabled={updateMutation.isPending}>
              انصراف
            </Button>
            <Button type="submit" form="role-edit-form" className="flex-1 gap-2" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره تغییرات"
              )}
            </Button>
          </div>
        }
      >
        <form id="role-edit-form" onSubmit={handleSubmit(submitEdit)} className="space-y-4">
          <Input
            id="role_name"
            label="نام نقش"
            required
            error={errors.role_name?.message}
            {...register("role_name", { required: "نام نقش الزامی است" })}
          />
          <Textarea id="description" label="توضیحات" {...register("description")} />
        </form>
      </Dialog>
    </div>
  );
}
