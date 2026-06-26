"use client";

import { useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { DataTable } from "@/components/shared";
import type { GameAccount } from "../types";
import { typeColors, typeLabels } from "../constants";

interface Props {
  accounts: GameAccount[];
  search: string;
  filterType: string;
  onEdit: (a: GameAccount) => void;
  onDelete: (id: string) => void;
}

export default function AccountsTable({ accounts, search, filterType, onEdit, onDelete }: Props) {
  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const matchSearch = !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        (a.email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || a.account_type === filterType;
      return matchSearch && matchType;
    });
  }, [accounts, search, filterType]);

  const columns = [
    {
      header: "نام اکانت",
      render: (r: GameAccount) => <span className="font-medium text-sm">{r.name}</span>,
    },
    {
      header: "ایمیل",
      render: (r: GameAccount) => <span className="text-sm text-muted-foreground">{r.email || "—"}</span>,
    },
    {
      header: "نوع",
      render: (r: GameAccount) => (
        <Badge variant="outline" className={`text-xs border ${typeColors[r.account_type]}`}>
          {typeLabels[r.account_type]}
        </Badge>
      ),
    },
    {
      header: "ظرفیت",
      render: (r: GameAccount) => <span className="text-sm">{r.total_capacity || "—"}</span>,
    },
    {
      header: "فروش‌ها",
      render: (r: GameAccount) => <span className="text-sm font-semibold">{r.sold_count || 0}</span>,
    },
    {
      header: "وضعیت",
      render: (r: GameAccount) => (
        <Badge variant="outline" className={r.is_active ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-red-100 text-red-700 border-red-200"}>
          {r.is_active ? "فعال" : "غیرفعال"}
        </Badge>
      ),
    },
    {
      header: "",
      render: (r: GameAccount) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(r)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(r.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={filtered} isLoading={false} />;
}
