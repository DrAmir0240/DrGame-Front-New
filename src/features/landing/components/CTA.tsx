"use client";

import { Gamepad2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section id="contact" className="relative py-24 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-background to-secondary-600/10 dark:from-primary-600/20 dark:via-[#0a0118] dark:to-secondary-600/20" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary-500/10 rounded-full blur-[100px]" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/30">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              آماده‌ای شروع کنی؟
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
              همین الان به جمع گیمرهای دکترگیم بپیوند و از تخفیف‌های ویژه
              بهره‌مند شو
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="group flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-8 py-3.5 rounded-xl text-base font-semibold transition-all shadow-xl shadow-primary-600/30 hover:shadow-primary-500/50 hover:-translate-y-0.5"
              >
                شروع کنید
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <a
                href="tel:"
                className="flex items-center gap-2 border border-border text-muted-foreground hover:text-foreground px-8 py-3.5 rounded-xl text-base font-medium transition-all hover:bg-muted"
              >
                تماس با ما
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
