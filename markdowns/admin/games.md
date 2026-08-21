# admin/games — مدیریت بازی‌ها (نمونه اولیه/ماک)

## هدف
UI مدیریتی لیست بازی‌های دیجیتال (نام، پلتفرم، قیمت، فعال/غیرفعال). **فعلاً ماک است** — بدون API و بدون ذخیره‌سازی.
مسیر: `/admin/games`

⚠️ توجه: این فیچر با `admin/store/games` (واقعی، `/website/employee/games/`) اشتباه گرفته نشود.

## ساختار
```
games/
├── index.tsx              # GamesPage — نگهدارنده state
├── types.d.ts · constants.ts   # initialGames (GTA V, FIFA 24, Zelda)
└── components/
    ├── GamesTable.tsx     # جدول + اکشن ویرایش/حذف
    ├── GameFormDialog.tsx # ایجاد/ویرایش
    └── GameFilters.tsx    # جستجو + Select پلتفرم
```

## وضعیت فعلی
- هیچ پوشه apis وجود ندارد؛ CRUD روی `useState` محلی انجام می‌شود.
- شناسه جدید = `Date.now()`؛ داده با رفرش صفحه از بین می‌رود.
- تایپ‌ها: `Platform ("ps"|"xbox"|"nintendo"|"all")`, `GamePlatform`, `Game`, `GameFormData`.
- فیلتر سمت کلاینت: متن جستجو + پلتفرم.
- قیمت در فرم string است و هنگام ذخیره به Number تبدیل می‌شود.

## کار بعدی پیشنهادی
اتصال به اندپوینت واقعی `/website/employee/games/` (همان که admin/store استفاده می‌کند) و جایگزینی state محلی با React Query.
