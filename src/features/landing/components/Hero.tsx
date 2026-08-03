"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-secondary-600/10 rounded-full blur-[128px] dark:bg-secondary-600/15" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* PS5 Controller - Absolute on the left */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden lg:block pointer-events-none">
        <div className="absolute w-[350px] h-[350px] bg-primary-500/15 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <Image
          src="/ps5-controller.png"
          alt="دسته PS5"
          width={420}
          height={420}
          className="object-contain"
          style={{
            transform: "rotate(-15deg)",
            filter: "drop-shadow(0 25px 50px rgba(139,92,246,0.3))",
          }}
          priority
        />
      </div>

      {/* Xbox Controller - Absolute on the right */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden lg:block pointer-events-none">
        <div className="absolute w-[350px] h-[350px] bg-secondary-500/15 rounded-full blur-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <Image
          src="/xbox-controller.png"
          alt="دسته Xbox"
          width={420}
          height={420}
          className="object-contain"
          style={{
            transform: "rotate(15deg) scaleX(-1)",
            filter: "drop-shadow(0 25px 50px rgba(99,102,241,0.3))",
          }}
          priority
        />
      </div>

      <div className="container relative z-10 pt-24 pb-16">
        <div className="flex flex-col items-center min-h-[70vh] justify-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
            <span className="text-xs text-primary-600 dark:text-primary-300">فروشگاه تخصصی گیمینگ</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6 text-center">
            دنیای
            <span className="bg-gradient-to-l from-primary-400 via-secondary-400 to-primary-500 bg-clip-text text-transparent">
              {" "}گیمینگ{" "}
            </span>
            <br />
            همینجاست
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed text-center">
            خرید اکانت بازی، کنسول نسل نهم، تعمیرات تخصصی و هزاران محصول گیمینگ
            با بهترین قیمت و ضمانت اصالت
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="group flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-xl shadow-primary-600/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
            >
              مشاهده محصولات
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/about-us"
              className="flex items-center gap-2 border border-border text-muted-foreground hover:text-foreground px-8 py-3.5 rounded-xl text-base font-medium transition-all hover:bg-muted"
            >
              درباره ما
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="relative mt-16 max-w-3xl mx-auto">
          <div className="relative bg-card/60 border border-border rounded-2xl p-8 backdrop-blur-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                  +۵۰۰۰
                </div>
                <div className="text-xs text-muted-foreground mt-1">مشتری فعال</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                  +۲۰۰
                </div>
                <div className="text-xs text-muted-foreground mt-1">محصول</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                  +۱۰K
                </div>
                <div className="text-xs text-muted-foreground mt-1">سفارش</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                  %۹۸
                </div>
                <div className="text-xs text-muted-foreground mt-1">رضایت</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
