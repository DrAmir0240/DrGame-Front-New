"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryConfig } from "../constants";
import { TicketStatusBadge } from "./ticket-status-badge";
import { TicketPriorityBadge } from "./ticket-priority-badge";
import type { Ticket } from "../types";

interface Props {
  ticket: Ticket;
}

export function TicketCard({ ticket }: Props) {
  const cat = categoryConfig[ticket.category] ?? categoryConfig.general;
  const CatIcon = cat.icon;

  return (
    <Link
      href={`/support/${ticket.id}`}
      className="block rounded-2xl border border-gray-100 bg-white p-4 transition hover:border-gray-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              cat.bg
            )}
          >
            <CatIcon className={cn("h-5 w-5", cat.color)} />
          </div>

          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {ticket.title}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={cn("text-xs font-medium", cat.color)}>
                {cat.label}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-500">
                {new Date(ticket.created_at).toLocaleDateString("fa-IR", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <ChevronLeft className="h-5 w-5 shrink-0 text-gray-400" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
        <TicketStatusBadge status={ticket.status} />
        <TicketPriorityBadge priority={ticket.priority} />
      </div>
    </Link>
  );
}