"use client";

import { useState } from "react";
import { MessageSquarePlus, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTickets } from "@/features/customer/support/apis";

import type { TicketStatus } from "@/features/customer/support/types";
import { TicketsFilter } from "./components/tickets-filter";
import { TicketsList } from "./components/tickets-list";
import { CreateTicketDialog } from "./components/create-ticket-dialog";

export default function SupportPage() {
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isFetching } = useTickets({ status, page });

  return (
    <div className="space-y-6">
 
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">
              <Headphones className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">پشتیبانی</h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {data?.count
                  ? `${data.count.toLocaleString("fa-IR")} تیکت`
                  : "پیگیری درخواست‌های پشتیبانی"}
              </p>
            </div>
          </div>

          <Button
            onClick={() => setCreateOpen(true)}
            className="shrink-0 gap-2 rounded-xl"
          >
            <MessageSquarePlus className="h-4 w-4" />
            تیکت جدید
          </Button>
        </div>

        <div className="mb-6">
          <TicketsFilter
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          />
        </div>

        <TicketsList
          data={data}
          isLoading={isLoading}
          isFetching={isFetching}
          page={page}
          onPageChange={setPage}
          onCreateClick={() => setCreateOpen(true)}
        />
      <CreateTicketDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}