"use client";

import { TicketMessageBubble } from "./message-bubble";
import type { TicketMessage } from "../types";

interface Props {
  messages: TicketMessage[];
}

export function TicketMessages({ messages }: Props) {
  // پیام‌های داخلی از قبل در بک‌اند فیلتر شده‌اند
  const visible = messages.filter((m) => !m.is_internal);

  if (!visible.length) {
    return (
      <div className="py-12 text-center text-sm text-gray-400">
        هنوز پیامی رد و بدل نشده است
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visible.map((msg) => (
        <TicketMessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  );
}