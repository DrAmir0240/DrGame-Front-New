"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { useAboutUs } from "@/features/website/apis";
import { getImageUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

export default function AboutSection() {
  const { data: aboutUsList, isLoading } = useAboutUs();
  const info = aboutUsList?.[0];

  if (isLoading) {
    return (
      <section className="py-12 bg-muted/30 dark:bg-muted/10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Skeleton className="h-72 rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!info) return null;

  return (
    <section id="about" className="py-12 bg-muted/30 dark:bg-muted/10">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-card border border-neutral-200 dark:border-neutral-700">
            {info.logo ? (
              <img
                src={getImageUrl(info.logo)}
                alt={info.title}
                className="w-full h-full object-contain p-10"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-600/10 to-secondary-600/10">
                <ShieldCheck className="w-16 h-16 text-primary-500" />
              </div>
            )}
          </div>

          <div>
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
              <span className="text-xs text-primary-600 dark:text-primary-300">
                درباره ما
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">
              {info.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              فروشگاه تخصصی محصولات گیمینگ با ضمانت اصالت و پشتیبانی ۲۴/۷ در
              خدمت گیمرهای ایرانی است.
            </p>

            <div className="space-y-3 mb-8">
              {info.phone_number && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-muted-foreground" dir="ltr">
                    {info.phone_number}
                  </span>
                </div>
              )}
              {info.email && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-muted-foreground" dir="ltr">
                    {info.email}
                  </span>
                </div>
              )}
              {info.address && (
                <div className="flex items-start gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-muted-foreground">{info.address}</span>
                </div>
              )}
            </div>

            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:gap-3 transition-all"
            >
              اطلاعات بیشتر
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
