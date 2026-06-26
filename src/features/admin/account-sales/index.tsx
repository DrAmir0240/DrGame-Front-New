"use client";

import React from "react";
import moment from "moment";

import { PageHeader, DataTable, DataTableColumn } from "@/components/shared";

import { mockAccounts, mockAccountSales } from "./constants";
import { AccountSale, GameAccount } from "./types";
import { Calendar, Gamepad2 } from "lucide-react";

export default function AccountSalesPage() {
  const sales = mockAccountSales;
  const accounts = mockAccounts;

  const getAccountName = (id: string) =>
    accounts.find((account: GameAccount) => account.id === id)?.name ?? "—";

  const columns: DataTableColumn<AccountSale>[] = [
    {
      header: "تاریخ",
      render: (row) => (
        <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700">
          <Calendar className="h-3.5 w-3.5" />
          <span>{moment(row.createdDate).format("YYYY/MM/DD - HH:mm")}</span>
        </div>
      ),
    },

    {
      header: "اکانت",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Gamepad2 className="h-4 w-4" />
          </div>

          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {getAccountName(row.accountId)}
            </span>

            <span className="text-xs text-muted-foreground">
              شناسه: {row.accountId}
            </span>
          </div>
        </div>
      ),
    },

    {
      header: "بازی‌های فروخته‌شده",
      render: (row) => (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {row.soldGames.length ? (
              row.soldGames.map((game) => (
                <span
                  key={game.gameId}
                  className="
                  rounded-full
                  border
                  border-primary/15
                  bg-primary/10
                  px-3
                  py-1
                  text-xs
                  font-medium
                  text-primary
                  transition-colors
                  hover:bg-primary/15
                "
                >
                  {game.gameName}
                </span>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </div>

          {!!row.soldGames.length && (
            <span className="text-xs text-muted-foreground">
              {row.soldGames.length} بازی فروخته شده
            </span>
          )}
        </div>
      ),
    },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="لاگ فروش اکانت" description="تاریخچه فروش‌های اکانت" />

      <DataTable<AccountSale>
        columns={columns}
        data={sales}
        isLoading={false}
        emptyMessage="فروشی ثبت نشده"
      />
    </div>
  );
}
