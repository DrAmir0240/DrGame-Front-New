"use client";

import { Search } from "lucide-react";
import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { ProductChoices } from "../types";

interface Props {
  search: string;
  category: string;
  supplier: string;
  choices: ProductChoices | null;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onSupplierChange: (v: string) => void;
}

export default function ProductFilters({
  search,
  category,
  supplier,
  choices,
  onSearchChange,
  onCategoryChange,
  onSupplierChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pr-10"
          placeholder="جستجوی عنوان کالا..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="دسته‌بندی" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه دسته‌بندی‌ها</SelectItem>
          {choices?.categories.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={supplier} onValueChange={onSupplierChange}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="تامین‌کننده" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه تامین‌کنندگان</SelectItem>
          {choices?.suppliers.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
