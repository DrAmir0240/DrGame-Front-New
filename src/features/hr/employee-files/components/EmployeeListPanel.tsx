"use client";

import { useState, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui";
import { Pagination } from "@/components/shared";
import { useEmployeeList } from "../apis";
import { LIMIT } from "../constants";
import EmployeeListItem from "./EmployeeListItem";
import type { Employee } from "../types";

interface Props {
  selectedId: number | null;
  onSelect: (employee: Employee) => void;
  onAddNew: () => void;
  refreshKey: number;
}

export default function EmployeeListPanel({ selectedId, onSelect, onAddNew, refreshKey }: Props) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const filters = {
    ...(search && { first_name: search }),
    limit: LIMIT,
    offset: page * LIMIT,
  };

  const { data, isLoading } = useEmployeeList(filters);
  const employees = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.ceil(count / LIMIT);

  useEffect(() => {
    setPage(0);
  }, [search, refreshKey]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm">لیست کارمندان</h3>
          <button
            onClick={onAddNew}
            className="text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors"
          >
            + کارمند جدید
          </button>
        </div>
        <Input
          placeholder="جستجو بر اساس نام..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          rightSection={<Search className="w-4 h-4 text-muted-foreground" />}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            کارمندی یافت نشد
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {employees.map((emp) => (
              <EmployeeListItem
                key={emp.id}
                employee={emp}
                isSelected={emp.id === selectedId}
                onClick={() => onSelect(emp)}
              />
            ))}
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        count={count}
        limit={LIMIT}
        onPageChange={(p) => setPage(p)}
        className="p-3 border-t border-neutral-200"
      />
    </div>
  );
}
