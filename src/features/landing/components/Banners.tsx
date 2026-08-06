"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, ChevronLeft, ImageIcon } from "lucide-react";
import { useBanners } from "@/features/website/apis";
import { getImageUrl } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton/skeleton";

export default function Banners() {
  const { data: banners, isLoading } = useBanners();
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const list = banners ?? [];

  useEffect(() => {
    if (list.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % list.length);
    }, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [list.length]);

  if (isLoading) {
    return (
      <section className="container py-8">
        <Skeleton className="h-64 md:h-80 rounded-3xl" />
      </section>
    );
  }

  if (list.length === 0) return null;

  const goTo = (index: number) => {
    setActive((index + list.length) % list.length);
  };

  return (
    <section id="banners" className="container py-8">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700">
        {list.map((banner, idx) => (
          <div
            key={banner.id}
            className={`relative aspect-[16/7] md:aspect-[16/5] transition-opacity duration-500 ${
              idx === active ? "opacity-100" : "opacity-0 absolute inset-0"
            }`}
          >
            {banner.image ? (
              <img
                src={getImageUrl(banner.image)}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-white/60" />
              </div>
            )}
            {banner.title && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end">
                <h3 className="text-white font-bold text-xl md:text-2xl px-6 md:px-10 pb-6 md:pb-8">
                  {banner.title}
                </h3>
              </div>
            )}
          </div>
        ))}

        {list.length > 1 && (
          <>
            <button
              onClick={() => goTo(active - 1)}
              aria-label="بنر قبلی"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => goTo(active + 1)}
              aria-label="بنر بعدی"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {list.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goTo(idx)}
                  aria-label={`بنر ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === active
                      ? "w-6 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
