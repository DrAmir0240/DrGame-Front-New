"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Menu, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useProductCart, useGameCart } from "@/features/website/apis";

const navItems = [
  { label: "خانه", href: "/" },
  { label: "بازی‌ها", href: "/games" },
  { label: "محصولات", href: "/products" },
  { label: "درباره ما", href: "/about-us" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const { data: productCart } = useProductCart();
  const { data: gameCart } = useGameCart();

  const cartCount =
    (productCart?.item_count ?? 0) + (gameCart?.games?.length ?? 0);

  return (
    <>
      <header className="h-16 border-b border-neutral-200 bg-background/80 backdrop-blur-sm flex items-center sticky top-0 z-30">
        <div className="container flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">
                دکتر<span className="text-primary-500">گیم</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm transition-all",
                      isActive
                        ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              href="/cart"
              aria-label="سبد خرید"
              className="relative"
            >
              <ShoppingCart className="w-7 h-7" />

              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-error rounded-full text-[10px] text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button href="/login" className="hidden sm:inline-flex">
              ورود / ثبت‌نام
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />

          <nav className="absolute top-0 right-0 h-full w-64 bg-background border-l border-border p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-sm transition-all",
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-semibold bg-primary-500/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              ورود / ثبت‌نام
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
