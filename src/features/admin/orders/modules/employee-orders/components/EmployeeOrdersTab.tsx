"use client";

import { useState } from "react";
import { useMyStages, useCategoryStages, useOrdersByStage } from "../../../apis";
import type { OrderPrefix, StageQueue } from "../../../types";
import OrdersStageList from "./OrdersStageList";

interface Props {
  orderPrefix: OrderPrefix;
}

export default function EmployeeOrdersTab({ orderPrefix }: Props) {
  const { data: myStages = [], isLoading: stagesLoading } = useMyStages(orderPrefix);

  const categories = getUniqueCategories(myStages);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    categories[0]?.category_id || null
  );
  const { data: categoryStages = [] } = useCategoryStages(orderPrefix, selectedCategoryId);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);

  const { data: orders = [], isLoading: ordersLoading } = useOrdersByStage(orderPrefix, selectedStageId);

  function handleCategoryClick(catId: number) {
    setSelectedCategoryId(catId);
    setSelectedStageId(null);
  }

  return (
    <div className="space-y-4">
      {stagesLoading ? (
        <p className="text-sm text-muted-foreground">در حال بارگذاری مراحل...</p>
      ) : myStages.length === 0 ? (
        <p className="text-sm text-muted-foreground">مرحله‌ای به شما اختصاص داده نشده</p>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex gap-1 border-b border-neutral-200 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => handleCategoryClick(cat.category_id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
                  selectedCategoryId === cat.category_id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-muted-foreground hover:text-neutral-700"
                }`}
              >
                {cat.category_title}
              </button>
            ))}
          </div>

          {/* Stage Sub-tabs */}
          {selectedCategoryId && (
            <div className="flex gap-1 overflow-x-auto">
              {categoryStages
                .sort((a, b) => a.order - b.order)
                .map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                      selectedStageId === stage.id
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "bg-neutral-50 text-neutral-600 border border-transparent hover:bg-neutral-100"
                    }`}
                  >
                    {stage.title}
                  </button>
                ))}
            </div>
          )}

          {/* Orders List */}
          {selectedStageId ? (
            <OrdersStageList
              orders={orders}
              orderPrefix={orderPrefix}
              isLoading={ordersLoading}
            />
          ) : (
            <p className="text-sm text-muted-foreground py-4">یک مرحله را انتخاب کنید</p>
          )}
        </>
      )}
    </div>
  );
}

function getUniqueCategories(stages: StageQueue[]) {
  const map = new Map<number, { category_id: number; category_title: string }>();
  stages.forEach((s) => {
    if (!map.has(s.category_id)) {
      map.set(s.category_id, { category_id: s.category_id, category_title: s.category_title });
    }
  });
  return Array.from(map.values());
}
