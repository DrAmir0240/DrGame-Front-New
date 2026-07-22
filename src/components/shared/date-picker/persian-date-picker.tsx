"use client";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface Props {
  value?: string;
  onChange?: (gregorianDate: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

function toDateValue(gregorianStr: string): Date | undefined {
  if (!gregorianStr) return undefined;
  const cleaned = gregorianStr.replace(" ", "T");
  const d = new Date(cleaned);
  return isNaN(d.getTime()) ? undefined : d;
}

function fromDateValue(date: any): string {
  if (!date) return "";
  const d = date.toDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function PersianDatePicker({ value, onChange, label, placeholder, required }: Props) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
          {label}
          {required && <span className="mr-1 text-error-500">*</span>}
        </label>
      )}
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={toDateValue(value || "")}
        onChange={(d) => onChange?.(fromDateValue(d))}
        format="YYYY/MM/DD"
        placeholder={placeholder}
        containerClassName="w-full"
        inputClass="flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm  transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-secondary-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
      />
    </div>
  );
}
