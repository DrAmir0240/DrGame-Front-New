"use client";

import Link from "next/link";
import { Gamepad2, Menu, X, Sun, Moon, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { NavLink } from "@/features/landing/types";

export const navLinks: NavLink[] = [
  { label: "خانه", href: "/" },
  { label: "فروشگاه", href: "/products" },
  { label: "بازی‌ها", href: "/games" },
  { label: "درباره ما", href: "/about-us" },
];

export const  Header = ()=> {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-foreground">
              دکتر<span className="text-primary-500">گیم</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-primary-600 dark:text-primary-400 font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/cart" className="relative text-muted-foreground hover:text-foreground p-2 transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 relative flex items-center justify-center rounded-lg border border-neutral-400 dark:border-neutral-600 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
            >
              ورود
            </Link>
            <Link
              href="/login"
              className="text-sm bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 rounded-lg transition-all shadow-lg shadow-primary-600/25 hover:shadow-primary-500/40"
            >
              ثبت‌نام
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link href="/cart" className="relative text-muted-foreground hover:text-foreground">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 relative flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
            >
              <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>
            <button
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-border mt-2 pt-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground py-2">
                ورود
              </Link>
              <Link
                href="/login"
                className="text-sm bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-lg text-center"
              >
                ثبت‌نام
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
