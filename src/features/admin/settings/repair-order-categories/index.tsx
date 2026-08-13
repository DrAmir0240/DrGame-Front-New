"use client";

import { useRepairOrderCategories, useCreateRepairOrderCategory, useUpdateRepairOrderCategory, useDeleteRepairOrderCategory } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import { SimpleCategoryCrud } from "../components/simple-category-crud";

export default function RepairOrderCategoriesPage() {
  const { data = [], isLoading } = useRepairOrderCategories();
  const createMutation = useCreateRepairOrderCategory();
  const updateMutation = useUpdateRepairOrderCategory();
  const deleteMutation = useDeleteRepairOrderCategory();

  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <SimpleCategoryCrud
        pageTitle="دسته‌بندی سفارش تعمیر"
        pageDescription="مدیریت دسته‌بندی سفارشات تعمیر"
        itemName="دسته‌بندی"
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
