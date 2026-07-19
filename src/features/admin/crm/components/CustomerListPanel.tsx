"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge, Button, Input, Tabs, TabsList, TabsTrigger } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomerType, customerTypeTabs, LIMIT } from "../constants";
import { useCustomerList, useB2BCustomerList } from "../apis";
import type { Customer } from "../types";

interface Props {
  selectedId: number | null;
  onSelect: (customer: Customer) => void;
  onAddNew: () => void;
  refreshKey?: number;
}

export default function CustomerListPanel({
  selectedId,
  onSelect,
  onAddNew,
  refreshKey,
}: Props) {
  const [customerType, setCustomerType] = useState("normal");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const offset = (page - 1) * LIMIT;
  const filters = { search: debouncedSearch, limit: LIMIT, offset };

  const normalQuery = useCustomerList(filters);
  const b2bQuery = useB2BCustomerList(filters);

  const isB2B = customerType === "b2b";
  const query = isB2B ? b2bQuery : normalQuery;
  const customers = query.data?.results ?? [];
  const count = query.data?.count ?? 0;
  const totalPages = Math.ceil(count / LIMIT);
  console.log(normalQuery.data)

  useEffect(() => {
    setCustomerType("normal");
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  }, [refreshKey]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-neutral-200 space-y-3">
        <div className="flex items-center gap-2">
          <Tabs
            dir="rtl"
            value={customerType}
            onValueChange={(v) => {
              setCustomerType(v);
              setPage(1);
            }}
            className="flex-1"
          >
            <TabsList className="w-full">
              {customerTypeTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="flex-1 text-xs">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Button size="icon" className="h-9 w-9 shrink-0" onClick={onAddNew}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pr-10 text-sm h-9"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {query.isLoading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-3 rounded-lg border border-neutral-200 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : customers.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            مشتری یافت نشد
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {customers.map((c) => {
              const typeInfo = getCustomerType(c.has_b2b);
              return (
                <button
                  key={c.id}
                  onClick={() => onSelect(c)}
                  className={`w-full text-right p-3 rounded-lg border transition-colors ${
                    selectedId === c.id
                      ? "border-primary bg-primary/5"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{c.full_name}</span>
                    <Badge variant="outline" className={`text-[10px] border ${typeInfo.className} shrink-0`}>
                      {typeInfo.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{c.phone}</span>
                    {c.has_b2b && (
                      <span className="text-[10px] text-purple-600">B2B</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="p-3 border-t border-neutral-200 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {count} مورد — صفحه {page} از {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
