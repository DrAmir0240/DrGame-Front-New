# landing — صفحه اصلی سایت

## هدف
صفحه نخست سایت عمومی (مسیر `/`) که محتوای داینامیک را از API وبسایت می‌گیرد: بنرها، سکشن‌های محصولات/بازی‌ها، درباره ما و CTA.

## ساختار
```
landing/
├── index.tsx              # ترکیب نهایی صفحه
├── constants.ts           # متن‌ها/فیچرهای ثابت (ضمانت اصالت، پشتیبانی ۲۴/۷ و...)
├── types.d.ts
└── components/
    ├── Navbar.tsx         # ناوبری بالای صفحه
    ├── Hero.tsx           # بخش قهرمان + CTA اصلی («با بهترین قیمت و ضمانت اصالت»)
    ├── Banners.tsx        # بنرهای داینامیک → useBanners()
    ├── Features.tsx       # کارت‌های ویژگی‌ها (constants)
    ├── HomeSections.tsx   # سکشن‌های داینامیک محصولات/بازی‌ها → useSections() + useSectionItems(id)
    ├── AboutSection.tsx   # معرفی فروشگاه («ضمانت اصالت و پشتیبانی ۲۴/۷»)
    ├── Services.tsx       # خدمات
    ├── CTA.tsx            # فراخوان ثبت‌نام — با useGetAuthQuery چک می‌کند لاگین است یا نه
    └── Footer.tsx
```

## داده‌ها
از هوک‌های `features/website/apis` استفاده می‌کند:
- `useBanners()` → `GET /website/banners/`
- `useSections()` → `GET /website/sections/`
- `useSectionItems(sectionId)` → `GET /website/section-items/{id}`
- `useGetAuthQuery()` → برای تغییر رفتار CTA بر اساس `is_authenticated`

## نکات
- محتوای بنرها/سکشن‌ها از پنل ادمین (`admin/website-home`) مدیریت می‌شود.
- کامپوننت‌ها همه client component هستند ("use client") و با React Query فچ می‌کنند.
