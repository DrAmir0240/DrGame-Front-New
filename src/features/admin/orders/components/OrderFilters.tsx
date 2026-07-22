"use client";

import { Search } from "lucide-react";
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { legacyOrderTypeLabels, statusFilterOptions } from "../constants";

interface Props {
  search: string;
  filterType: string;
  filterStatus: string;
  onSearchChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onStatusChange: (v: string) => void;
}

export default function OrderFilters({ search, filterType, filterStatus, onSearchChange, onTypeChange, onStatusChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative flex-1 min-w-[220px] max-w-md">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pr-10"
          placeholder="شماره سفارش یا نام مشتری..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select value={filterType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه انواع</SelectItem>
          {Object.entries(legacyOrderTypeLabels).map(([key, label]) => (
            <SelectItem key={key} value={key}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterStatus} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusFilterOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
