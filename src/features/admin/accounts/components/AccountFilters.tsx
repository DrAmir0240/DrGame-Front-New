"use client";

import { Search } from "lucide-react";
import { Input, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { typeLabels } from "../constants";

interface Props {
  search: string;
  filterType: string;
  onSearchChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

const filterTabs = [
  { value: "all", label: "همه" },
  ...Object.entries(typeLabels).map(([k, v]) => ({ value: k, label: v })),
];

export default function AccountFilters({ search, filterType, onSearchChange, onTypeChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="جستجو..." value={search} onChange={(e) => onSearchChange(e.target.value)} className="pr-10" />
      </div>
      <Tabs value={filterType} onValueChange={onTypeChange}>
        <TabsList>
          {filterTabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
