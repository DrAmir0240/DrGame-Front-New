"use client";

import { MapPin, Phone, Mail, Award, Shield, Users, Gamepad2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { getImageUrl } from "@/lib/utils";
import { useAboutUs } from "./hooks";

export function AboutUsPage() {
  const { data: aboutUsList, isLoading } = useAboutUs();
  const info = aboutUsList?.[0];

  if (isLoading) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-64 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">اطلاعاتی یافت نشد</h2>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-xs text-primary-600 dark:text-primary-300">درباره ما</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          درباره <span className="text-primary-500">{info.title}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          {info.logo && (
            <img
              src={getImageUrl(info.logo)}
              alt={info.title}
              className="w-full h-full object-contain p-8"
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
            <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-500" />
              اطلاعات تماس
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">شماره تماس</p>
                  <p className="text-sm font-medium text-foreground" dir="ltr">
                    {info.phone_number}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">ایمیل</p>
                  <p className="text-sm font-medium text-foreground">{info.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">آدرس</p>
                  <p className="text-sm font-medium text-foreground">{info.address}</p>
                </div>
              </div>
            </div>
          </div>

          {info.e_namaad && (
            <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
              <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-500" />
                نماد اعتماد
              </h3>
              <a
                href={info.e_namaad_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={getImageUrl(info.e_namaad)}
                  alt="نماد اعتماد"
                  className="h-24"
                />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-sm mb-1">تضمین اصالت</h3>
          <p className="text-xs text-muted-foreground">
            تمامی محصولات و اکانت‌ها با ضمانت اصالت عرضه می‌شوند
          </p>
        </div>
        <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-sm mb-1">پشتیبانی ۲۴/۷</h3>
          <p className="text-xs text-muted-foreground">
            تیم پشتیبانی در تمام ساعات شبانه‌روز آماده پاسخگویی است
          </p>
        </div>
        <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 flex items-center justify-center mx-auto mb-3">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-foreground text-sm mb-1">بیش از ۵ سال سابقه</h3>
          <p className="text-xs text-muted-foreground">
            بیش از ۵ سال سابقه درخشان در صنعت گیمینگ ایران
          </p>
        </div>
      </div>
    </div>
  );
}
