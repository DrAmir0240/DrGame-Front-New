"use client";

import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { categoryOptions } from "../constants";
import { useCreateTicket } from "../apis";
import type { TicketCategory, TicketPriority } from "../types";

interface FormValues {
  title: string;
  category: TicketCategory;
  body: string;
  priority: TicketPriority;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateTicketDialog({ open, onClose }: Props) {
  const createMutation = useCreateTicket();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: "general",
      body: "",
      priority: "medium",
    },
    mode: "onChange",
  });

  const category = watch("category");
  const priority = watch("priority");

  const onSubmit = async (data: FormValues) => {
    try {
      await createMutation.mutateAsync(data);
      reset();
      onClose();
    } catch {
      // هندل توسط هوک
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="ایجاد تیکت جدید"
      description="موضوع و شرح مشکل خود را وارد کنید"
      className="max-w-lg"
      footer={
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => handleOpenChange(false)}
            disabled={createMutation.isPending}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="create-ticket-form"
            className="flex-1 gap-2 rounded-xl"
            disabled={!isValid || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              "ثبت تیکت"
            )}
          </Button>
        </div>
      }
    >
      <form
        id="create-ticket-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <Input
          id="title"
          label="عنوان"
          placeholder="مثلاً مشکل در پرداخت سفارش"
          required
          error={errors.title?.message}
          {...register("title", {
            required: "عنوان الزامی است",
            minLength: { value: 5, message: "حداقل ۵ کاراکتر" },
          })}
        />

        {/* دسته‌بندی */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            دسته‌بندی
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setValue("category", opt.value, { shouldValidate: true })
                }
                className={cn(
                  "rounded-xl border py-2.5 text-sm font-medium transition",
                  category === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* اولویت */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            اولویت
          </label>
          <div className="flex gap-2">
            {(["low", "medium", "high"] as TicketPriority[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() =>
                  setValue("priority", p, { shouldValidate: true })
                }
                className={cn(
                  "flex-1 rounded-xl border py-2 text-sm font-medium transition",
                  priority === p
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {p === "low" ? "کم" : p === "medium" ? "متوسط" : "بالا"}
              </button>
            ))}
          </div>
        </div>

        {/* متن */}
        <div>
          <label className="mb-2 block text-sm font-medium text-neutral-700">
            شرح مشکل <span className="text-error-500">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="مشکل خود را با جزئیات بنویسید..."
            className={cn(
              "w-full rounded-xl border bg-transparent px-3 py-2 text-sm outline-none transition focus-visible:ring-1 focus-visible:ring-secondary-600",
              errors.body
                ? "border-error-500 focus-visible:ring-error-500"
                : "border-neutral-200"
            )}
            {...register("body", {
              required: "شرح مشکل الزامی است",
              minLength: { value: 10, message: "حداقل ۱۰ کاراکتر" },
            })}
          />
          {errors.body && (
            <p className="mt-1 text-xs text-error-500">{errors.body.message}</p>
          )}
        </div>
      </form>
    </Dialog>
  );
}