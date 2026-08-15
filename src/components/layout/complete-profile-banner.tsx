"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { useGetAuthQuery } from "@/layouts/admin-layout/apis/use-get-auth.query";

export default function CompleteProfileBanner() {
  const { data: auth, isLoading } = useGetAuthQuery();

  if (isLoading || !auth?.is_authenticated) return null;
  if (auth.is_complete_profile) return null;

  return (
    <Link
      href="/complete-profile"
      className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-500/10 border-t border-primary-200 text-primary-700 dark:text-primary-300 text-xs font-medium hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-colors"
    >
      <AlertTriangle className="w-4 h-4 shrink-0" />
      <span>پروفایل شما تکمیل نشده است، لطفا برای تکمیل اطلاعات کلیک کنید</span>
    </Link>
  );
}
