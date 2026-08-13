"use client";

import { useProductOrderCategories, useCreateProductOrderCategory, useUpdateProductOrderCategory, useDeleteProductOrderCategory } from "../apis";
import { SettingsNav } from "../components/settings-nav";
import { SimpleCategoryCrud } from "../components/simple-category-crud";

export default function ProductOrderCategoriesPage() {
  const { data = [], isLoading } = useProductOrderCategories();
  const createMutation = useCreateProductOrderCategory();
  const updateMutation = useUpdateProductOrderCategory();
  const deleteMutation = useDeleteProductOrderCategory();

  const saving = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6">
      <SimpleCategoryCrud
        pageTitle="دسته‌بندی سفارش کالا"
        pageDescription="مدیریت دسته‌بندی سفارشات کالا"
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
