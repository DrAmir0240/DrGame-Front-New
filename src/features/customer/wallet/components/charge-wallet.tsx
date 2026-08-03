// src/features/customer/wallet/components/ChargeDialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { Loader2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { quickAmounts } from "../constants";
import { useChargeWallet } from "../apis";

interface ChargeFormValues {
  amount: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ChargeDialog({ open, onClose }: Props) {
  const chargeMutation = useChargeWallet();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ChargeFormValues>({
    defaultValues: {
      amount: undefined,
    },
    mode: "onChange",
  });

  const amount = watch("amount");

  const onSubmit = async (data: ChargeFormValues) => {
    try {
      await chargeMutation.mutateAsync(Number(data.amount));
      reset();
      onClose();
    } catch {
      // خطا توسط onError هوک هندل می‌شه
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
      title="شارژ کیف پول"
      description="مبلغ مورد نظر را وارد کنید"
      className="max-w-md"
      footer={
        <div className="flex w-full gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => handleOpenChange(false)}
            disabled={chargeMutation.isPending}
          >
            انصراف
          </Button>
          <Button
            type="submit"
            form="charge-wallet-form"
            className="flex-1 gap-2 rounded-xl"
            disabled={
              !isValid ||
              !amount ||
              amount < 10_000 ||
              chargeMutation.isPending
            }
          >
            {chargeMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال پردازش...
              </>
            ) : (
              "ادامه و پرداخت"
            )}
          </Button>
        </div>
      }
    >
      <form
        id="charge-wallet-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* هدر آیکون */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100">
            <Wallet className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است
            </p>
          </div>
        </div>

        {/* فیلد مبلغ */}
        <Input
          id="amount"
          type="number"
          label="مبلغ (تومان)"
          placeholder="مثلاً ۱۵۰۰۰۰"
          required
          error={errors.amount?.message}
          className="h-11 rounded-xl text-base font-medium"
          {...register("amount", {
            required: "مبلغ الزامی است",
            valueAsNumber: true,
            min: {
              value: 10_000,
              message: "حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است",
            },
            validate: (value) =>
              !isNaN(value) || "مبلغ وارد شده معتبر نیست",
          })}
        />

        {/* مبالغ پیشنهادی */}
        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((val) => (
            <Button
              key={val}
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue("amount", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
              className={cn(
                "rounded-xl",
                amount === val &&
                  "border-primary bg-primary/10 text-primary hover:bg-primary/15"
              )}
            >
              {(val / 1000).toLocaleString("fa-IR")} هزار
            </Button>
          ))}
        </div>
      </form>
    </Dialog>
  );
}