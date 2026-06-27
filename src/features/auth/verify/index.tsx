"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Smartphone, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useVerifyOtp } from "./apis";
import { useLoginOtp } from "../login/apis";
import { usePhone } from "@/contexts/PhoneContext";
import AuthLayout from "../login/components/AuthLayout";
import { OtpInput } from "@/components/shared";
import { VERIFY_LABELS } from "./constants";
import { setCookie, setAccess, setRefresh } from "@/utils/cookie";

export default function VerifyPage() {
  const router = useRouter();
  const { phone } = usePhone();
  const [code, setCode] = useState("");
  const verifyMutation = useVerifyOtp();
  const resendMutation = useLoginOtp();
  const [resendSent, setResendSent] = useState(false);

  if (!phone) {
    router.replace("/");
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    verifyMutation.mutate(
      { phone, code },
      {
        onSuccess: (res) => {
          console.log(res)
          setAccess(res.data.access_token);
          setRefresh(res.data.refresh_token);
          router.push("/admin");
        },
      },
    );
  }

  function handleResend() {
    resendMutation.mutate({ phone });
    setResendSent(true);
    setTimeout(() => setResendSent(false), 3000);
  }

  const maskedPhone = phone.replace(/(\d{4})(\d{3})(\d{4})/, "$1***$3");

  return (
    <AuthLayout
      icon={Smartphone}
      title={VERIFY_LABELS.title}
      subtitle={
        <span>
          کد به شماره <span dir="ltr" className="font-medium">{maskedPhone}</span> ارسال شد
        </span>
      }
    >
      {verifyMutation.isError && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {VERIFY_LABELS.errorMessage}
        </div>
      )}

      {resendSent && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          کد مجدداً ارسال شد
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <OtpInput
          value={code}
          onChange={setCode}
          error={verifyMutation.isError ? VERIFY_LABELS.errorMessage : undefined}
        />

        <Button type="submit" className="w-full h-12 font-medium" disabled={verifyMutation.isPending || code.length !== 5}>
          {verifyMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              {VERIFY_LABELS.loadingButton}
            </>
          ) : (
            VERIFY_LABELS.submitButton
          )}
        </Button>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="link"
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-primary no-underline"
          >
            <ArrowLeft className="w-4 h-4" />
            بازگشت
          </Button>

          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={resendMutation.isPending}
          >
            {resendMutation.isPending ? "درحال ارسال..." : VERIFY_LABELS.resendButton}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
}
