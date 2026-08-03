"use client";

import { cn } from "@/lib/utils";
import type { TicketMessage } from "../types";

interface Props {
  message: TicketMessage;
}

export function TicketMessageBubble({ message }: Props) {
  const isCustomer = message.sender === "customer";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center py-2">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
          {message.body}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex", isCustomer ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isCustomer
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md bg-gray-100 text-gray-900"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.body}
        </p>
        <p
          className={cn(
            "mt-1.5 text-[10px]",
            isCustomer ? "text-primary-foreground/70" : "text-gray-400"
          )}
        >
          {new Date(message.created_at).toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}