"use client";

import { useForm } from "react-hook-form";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReplyTicket } from "../apis";

interface FormValues {
  body: string;
}

interface Props {
  ticketId: number;
  disabled?: boolean;
}

export function TicketReplyForm({ ticketId, disabled }: Props) {
  const replyMutation = useReplyTicket(ticketId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: { body: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await replyMutation.mutateAsync({ body: data.body.trim() });
      reset();
    } catch {
      // هندل توسط هوک
    }
  };

  if (disabled) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
        این تیکت بسته شده و امکان ارسال پیام وجود ندارد
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white p-3"
    >
      <textarea
        rows={2}
        placeholder="پاسخ خود را بنویسید..."
        className="max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent text-sm outline-none placeholder:text-gray-400"
        {...register("body", {
          required: true,
          validate: (v) => v.trim().length > 0,
        })}
      />
      <Button
        type="submit"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl"
        disabled={!isValid || replyMutation.isPending}
      >
        {replyMutation.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}