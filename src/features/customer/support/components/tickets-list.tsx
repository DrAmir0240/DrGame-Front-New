"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TicketCard } from "./ticket-card";
import { TicketsEmptyState } from "./tickets-empty";
import type { Ticket, PaginatedResponse } from "../types";

interface Props {
  data?: PaginatedResponse<Ticket>;
  isLoading?: boolean;
  isFetching?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onCreateClick?: () => void;
}

export function TicketsList({
  data,
  isLoading,
  isFetching,
  page,
  onPageChange,
  onCreateClick,
}: Props) {
  const tickets = data?.results ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!tickets.length) {
    return <TicketsEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}

      {(data?.next || data?.previous) && (
        <div className="flex justify-center gap-3 pt-4">
          <Button
            variant="outline"
            disabled={!data?.previous || isFetching}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            قبلی
          </Button>
          <Button
            variant="outline"
            disabled={!data?.next || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            بعدی
          </Button>
        </div>
      )}
    </div>
  );
}