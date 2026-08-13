"use client";

import { useSonyBanks, useCreateSonyBank, useUpdateSonyBank, useDeleteSonyBank } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import { SimpleCategoryCrud } from "../components/simple-category-crud";

export default function SonyBanksPage() {
  const { data = [], isLoading } = useSonyBanks();
  const createMutation = useCreateSonyBank();
  const updateMutation = useUpdateSonyBank();
  const deleteMutation = useDeleteSonyBank();

  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <SimpleCategoryCrud
        pageTitle="بانک‌های سونی"
        pageDescription="مدیریت بانک‌های قابل استفاده در اکانت‌های سونی"
        itemName="بانک"
        data={data}
        isLoading={isLoading}
        isSaving={saving}
        onCreate={async (payload) => {
          await createMutation.mutateAsync(payload);
        }}
        onUpdate={async (id, payload) => {
          await updateMutation.mutateAsync({ id, payload });
        }}
        onDelete={async (id) => {
          await deleteMutation.mutateAsync(id);
        }}
      />
    </div>
  );
}
