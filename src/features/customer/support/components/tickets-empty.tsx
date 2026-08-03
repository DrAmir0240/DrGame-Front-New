"use client";

import { MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onCreateClick?: () => void;
}

export function TicketsEmptyState({ onCreateClick }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
        <MessageSquarePlus className="h-10 w-10 text-blue-400" />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        تیکتی ثبت نشده است
      </h3>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        برای پیگیری مشکل یا سؤال خود، یک تیکت پشتیبانی ایجاد کنید
      </p>

      {onCreateClick && (
        <Button onClick={onCreateClick} className="mt-6 rounded-xl gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          ایجاد تیکت جدید
        </Button>
      )}
    </div>
  );
}