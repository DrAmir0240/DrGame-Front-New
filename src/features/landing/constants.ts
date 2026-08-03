import type { Stat, Feature, Service, NavLink } from "./types";


export const stats: Stat[] = [
  { value: "+۵۰۰۰", label: "مشتری فعال" },
  { value: "+۲۰۰", label: "بازی و محصول" },
  { value: "+۱۰۰۰۰", label: "سفارش موفق" },
  { value: "%۹۸", label: "رضایت مشتریان" },
];

export const features: Feature[] = [
  {
    icon: "Gamepad2",
    title: "فروش اکانت بازی",
    description: "خرید و فروش اکانت‌های اصلی بازی‌های PS5, PS4, Xbox و PC با بهترین قیمت و تضمین اصالت",
  },
  {
    icon: "Wrench",
    title: "تعمیرات تخصصی",
    description: "تعمیر کنسول‌های بازی توسط تیم حرفه‌ای با ضنانت کار و قطعات اصلی",
  },
  {
    icon: "ShoppingBag",
    title: "فروشگاه آنلاین",
    description: "خرید لوازم جانبی کنسول، گیم‌پد، هدست و دیگر تجهیزات گیمینگ",
  },
  {
    icon: "Headphones",
    title: "پشتیبانی ۲۴/۷",
    description: "تیم پشتیبانی ما در تمام ساعات شبانه‌روز آماده پاسخگویی و رفع مشکلات شماست",
  },
  {
    icon: "Shield",
    title: "ضمانت اصالت",
    description: "تمامی محصولات و اکانت‌ها با ضمانت اصالت و بازگشت وجه در صورت عدم رضایت",
  },
  {
    icon: "Zap",
    title: "تحویل فوری",
    description: "ارسال سریع سفارشات و فعال‌سازی آنی اکانت‌ها پس از تأیید پرداخت",
  },
];

export const services: Service[] = [
  {
    icon: "Monitor",
    title: "کنسول‌های نسل نهم",
    description: "PS5, Xbox Series X و دیگر کنسول‌های نسل جدید",
    color: "from-primary-500 to-secondary-500",
  },
  {
    icon: "Palette",
    title: "بازی‌های AAA",
    description: "جدیدترین بازی‌های روز دنیا با قیمت مناسب",
    color: "from-info-500 to-primary-500",
  },
  {
    icon: "Cpu",
    title: "گیمینگ PC",
    description: "مشاوره و فروش قطعات کامپیوتر گیمینگ",
    color: "from-success-500 to-info-500",
  },
];
