"use client";

import { useForm } from "react-hook-form";
import { Button, Input, Label } from "@/components/ui";
import { LogIn, Phone, Loader2 } from "lucide-react";
import { useLoginOtp } from "./apis";
import AuthLayout from "./components/AuthLayout";
import { LOGIN_LABELS } from "./constants";
import type { LoginFormData } from "./types";
import { useRouter } from "next/navigation";
import { usePhone } from "@/contexts/PhoneContext";

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const mutation = useLoginOtp();
  const router = useRouter();
  const { setPhone } = usePhone();

  const onSubmit = (data: LoginFormData) => {
    setPhone(data.phone);
    mutation.mutate(data, {
      onSuccess: () => {
        router.push("/verify");
      }
    });
  };

  return (
    <AuthLayout
      icon={LogIn}
      title={LOGIN_LABELS.title}
      subtitle={LOGIN_LABELS.subtitle}
    >
      {mutation.isError && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {LOGIN_LABELS.errorMessage}
        </div>
      )}

      {mutation.isSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
          {mutation.data?.data?.detail || "کد تأیید برای شماره شما ارسال شد"}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          id="phone"
          type="tel"
          autoComplete="tel"
          autoFocus
          label={LOGIN_LABELS.phoneLabel}
          placeholder={LOGIN_LABELS.phonePlaceholder}
          className="h-12 text-left"
          dir="ltr"
          rightSection={<Phone className="w-4 h-4 text-neutral-400" />}
          error={errors.phone?.message}
          {...register("phone", {
            required: "شماره موبایل الزامی است",
            pattern: {
              value: /^0?9\d{9}$/,
              message: "شماره موبایل معتبر نیست",
            },
          })}
        />
        <Button type="submit" className="w-full h-12 font-medium" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              {LOGIN_LABELS.loadingButton}
            </>
          ) : (
            LOGIN_LABELS.submitButton
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
