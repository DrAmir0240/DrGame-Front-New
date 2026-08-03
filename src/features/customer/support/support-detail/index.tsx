// src/features/customer/support/support-detail.tsx
"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTicketDetail } from "@/features/customer/support/apis";
import { categoryConfig } from "@/features/customer/support/constants";
import { cn } from "@/lib/utils";
import { TicketStatusBadge } from "../components/ticket-status-badge";
import { TicketPriorityBadge } from "../components/ticket-priority-badge";
import { TicketMessages } from "../components/messages";
import { TicketReplyForm } from "../components/reply-form";

interface Props {
  id: number;
}

export default function TicketDetailPage({ id }: Props) {
  const { data: ticket, isLoading } = useTicketDetail(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16 text-center text-gray-500">
        تیکت یافت نشد
      </div>
    );
  }

  const cat = categoryConfig[ticket.category] ?? categoryConfig.general;
  const isClosed = ticket.status === "closed";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/80">
      <div className="container mx-auto flex max-w-2xl flex-1 flex-col px-4 py-6">
        {/* هدر */}
        <div className="mb-4 flex items-center gap-2">
          <Link href="/support">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold text-gray-900">
              {ticket.title}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={cn("text-xs font-medium", cat.color)}>
                {cat.label}
              </span>
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
          </div>
        </div>

        {/* پیام‌ها */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-4">
          <TicketMessages messages={ticket.messages ?? []} />
        </div>

        {/* فرم پاسخ */}
        <div className="mt-4">
          <TicketReplyForm ticketId={id} disabled={isClosed} />
        </div>
      </div>
    </div>
  );
}