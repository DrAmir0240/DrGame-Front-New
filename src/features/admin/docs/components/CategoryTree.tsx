"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, FolderPlus, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Category {
  id: number;
  title: string;
  description?: string;
}

interface SubCategory {
  id: number;
  title: string;
  category: number;
  category_title: string;
}

interface Props {
  categories: Category[];
  subCategories: SubCategory[];
  selectedCategoryId: number | null;
  selectedSubCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  onSelectSubCategory: (id: number | null) => void;
  onAddCategory: () => void;
  onAddSubCategory: (categoryId: number) => void;
  isLoading?: boolean;
}

export default function CategoryTree({
  categories,
  subCategories,
  selectedCategoryId,
  selectedSubCategoryId,
  onSelectCategory,
  onSelectSubCategory,
  onAddCategory,
  onAddSubCategory,
  isLoading,
}: Props) {
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  function toggleExpand(id: number) {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function getSubCategoriesForCategory(categoryId: number) {
    return subCategories.filter((sc) => sc.category === categoryId);
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 bg-neutral-100 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-neutral-700">دسته‌بندی‌ها</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onAddCategory}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-0.5">
        <button
          onClick={() => {
            onSelectCategory(null);
            onSelectSubCategory(null);
          }}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-right",
            selectedCategoryId === null && selectedSubCategoryId === null
              ? "bg-blue-50 text-blue-700 font-medium"
              : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <FolderPlus className="w-4 h-4 shrink-0" />
          <span className="flex-1">همه</span>
        </button>

        {categories.map((cat) => {
          const isExpanded = expandedCategories.has(cat.id);
          const isSelected = selectedCategoryId === cat.id && selectedSubCategoryId === null;
          const subs = getSubCategoriesForCategory(cat.id);

          return (
            <div key={cat.id}>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onSelectSubCategory(null);
                    toggleExpand(cat.id);
                  }}
                  className={cn(
                    "flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all text-right",
                    isSelected
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  {subs.length > 0 ? (
                    <ChevronLeft
                      className={cn(
                        "w-3.5 h-3.5 shrink-0 transition-transform",
                        isExpanded && "rotate-90"
                      )}
                    />
                  ) : (
                    <span className="w-3.5 shrink-0" />
                  )}
                  <span className="flex-1 truncate">{cat.title}</span>
                </button>
                <button
                  onClick={() => onAddSubCategory(cat.id)}
                  className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {isExpanded && subs.length > 0 && (
                <div className="mr-6 space-y-0.5">
                  {subs.map((sub) => {
                    const isSubSelected = selectedSubCategoryId === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          onSelectCategory(cat.id);
                          onSelectSubCategory(sub.id);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all text-right",
                          isSubSelected
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-neutral-500 hover:bg-neutral-50"
                        )}
                      >
                        <span className="flex-1 truncate">{sub.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
