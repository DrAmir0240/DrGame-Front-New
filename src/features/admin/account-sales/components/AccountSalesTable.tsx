"use client";

import moment from "moment";
import { Calendar, Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui";
import { DataTable, DataTableColumn } from "@/components/shared";
import type { AccountSale } from "../types";
import { mockAccountSales, mockAccounts } from "../constants";

export default function AccountSalesTable() {
  const getAccountName = (id: string) =>
    mockAccounts.find((a) => a.id === id)?.name ?? "—";

  const columns: DataTableColumn<AccountSale>[] = [
    {
      header: "تاریخ",
      render: (row) => (
        <Badge variant="outline" className="gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {moment(row.createdDate).format("YYYY/MM/DD - HH:mm")}
        </Badge>
      ),
    },
    {
      header: "اکانت",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{getAccountName(row.accountId)}</p>
            <p className="text-xs text-muted-foreground">{row.accountId}</p>
          </div>
        </div>
      ),
    },
    {
      header: "بازی‌های فروخته‌شده",
      render: (row) =>
        row.soldGames?.length ? (
          <div className="flex flex-wrap gap-1.5">
            {row.soldGames.map((g) => (
              <Badge key={g.gameId} variant="secondary" className="text-xs hover:bg-primary/10 cursor-default">
                {g.gameName}
              </Badge>
            ))}
            <span className="text-xs text-muted-foreground w-full mt-0.5">
              {row.soldGames.length} بازی
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        ),
    },
  ];

  return <DataTable<AccountSale> columns={columns} data={mockAccountSales} isLoading={false} emptyMessage="فروشی ثبت نشده" />;
}
