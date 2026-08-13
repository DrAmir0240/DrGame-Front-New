"use client";

import { PersianDatePicker } from "@/components/shared";
import type { DateRange } from "../types";
import { X } from "lucide-react";

interface Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DashboardDateRange({ value, onChange }: Props) {
  const hasValue = Boolean(value.date_from || value.date_to);

  const handleReset = () => {
    onChange({ date_from: undefined, date_to: undefined });
  };

  return (
    <div className="flex flex-wrap items-end gap-3">
      <PersianDatePicker
        label="از تاریخ"
        value={value.date_from}
        onChange={(date) =>
          onChange({ ...value, date_from: date || undefined })
        }
        placeholder="انتخاب تاریخ شروع"
      />
      <PersianDatePicker
        label="تا تاریخ"
        value={value.date_to}
        onChange={(date) =>
          onChange({ ...value, date_to: date || undefined })
        }
        placeholder="انتخاب تاریخ پایان"
      />

      {hasValue && (
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-neutral-200 bg-transparent px-3 text-sm text-muted-foreground transition-colors hover:bg-neutral-100 hover:text-foreground dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          <X className="h-4 w-4" />
          پاک کردن
        </button>
      )}
    </div>
  );
}