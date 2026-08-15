"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Gamepad2,
  LayoutDashboard,
  Menu,
  ShoppingCart,
  User,
  UserCircle,
  X,
} from "lucide-react";

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import { cn, getImageUrl } from "@/lib/utils";
import { useProductCart, useGameCart } from "@/features/website/apis";
import { useGetAuthQuery } from "@/layouts/admin-layout/apis/use-get-auth.query";
import CompleteProfileBanner from "./complete-profile-banner";

const navItems = [
  { label: "خانه", href: "/" },
  { label: "بازی‌ها", href: "/games" },
  { label: "محصولات", href: "/products" },
  { label: "بلاگ", href: "/blog" },
  { label: "ویدیوها", href: "/videos" },
  { label: "درباره ما", href: "/about-us" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const { data: productCart } = useProductCart();
  const { data: gameCart } = useGameCart();
  const { data: auth, isLoading: authLoading } = useGetAuthQuery();

  const isAuthenticated = auth?.is_authenticated === true;
  const isMainManager = auth?.is_manager || auth?.is_employee;

  const displayName =
    auth?.profile?.first_name && auth?.profile?.last_name
      ? `${auth.profile.first_name} ${auth.profile.last_name}`
      : auth?.phone;

  const cartCount =
    (productCart?.item_count ?? 0) + (gameCart?.games?.length ?? 0);

  return (
    <>
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm">
        <div className="h-16 border-b border-neutral-200 flex items-center">
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
              <ShoppingCart className="w-5 h-5" />

              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-error rounded-full text-[10px] text-white flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {!authLoading && isAuthenticated && (
              <>
                {isMainManager && (
                  <Button href="/admin" variant="outline" className="hidden sm:inline-flex">
                    <LayoutDashboard className="w-4 h-4 ml-1" />
                    پنل ادمین
                  </Button>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden sm:inline-flex gap-2 pr-2">
                      {auth?.user_pic ? (
                        <img
                          src={getImageUrl(auth.user_pic)}
                          alt={auth.user_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <span className="text-sm">{displayName}</span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="gap-2 cursor-pointer">
                        <UserCircle className="w-4 h-4" />
                        پنل کاربری
                      </Link>
                    </DropdownMenuItem>

                    {isMainManager && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="gap-2 cursor-pointer">
                            <LayoutDashboard className="w-4 h-4" />
                            پنل ادمین
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!authLoading && !isAuthenticated && (
              <Button href="/login" className="hidden sm:inline-flex">
                ورود / ثبت‌نام
              </Button>
            )}

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
        </div>

        <CompleteProfileBanner />
      </header>

      <div
        className={cn(
          "md:hidden fixed inset-0 z-40 transition-all duration-300",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />

        <nav
          className={cn(
            "absolute top-0 right-0 h-full w-64 bg-background border-l border-border p-4 space-y-1 transition-transform duration-300 ease-out",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
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

          {!authLoading && isAuthenticated ? (
            <div className="mt-4 space-y-1 border-t border-border pt-3">
              <div className="flex items-center gap-3 px-3 py-2">
                {auth?.user_pic ? (
                  <img
                    src={getImageUrl(auth.user_pic)}
                    alt={auth.user_name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="text-sm font-medium truncate">
                  {displayName}
                </span>
              </div>

              <Link
                href="/profile"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                پنل کاربری
              </Link>

              {isMainManager && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  پنل ادمین
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 mt-4 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}