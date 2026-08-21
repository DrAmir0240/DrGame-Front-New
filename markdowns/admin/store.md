# admin/store — مدیریت فروشگاه (کالا و بازی)

## هدف
CRUD محصولات فیزیکی و بازی‌های دیجیتال به همراه دسته‌بندی‌شان — همان داده‌هایی که سایت عمومی در `/products` و `/games` نمایش می‌دهد.
مسیرها: `/admin/store/products`, `/product-categories`, `/games`, `/game-categories`

## ساختار
```
store/
├── index.tsx · apis/index.tsx
└── components/ (جدول‌ها و فرم‌های هر ۴ بخش)
```

## اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/website/employee/products/` (paginated) | لیست محصولات |
| POST / PATCH / DELETE | `/website/employee/products/[{id}/]` | CRUD محصول |
| GET | `/website/employee/product-categories/` (paginated) | دسته کالا |
| POST / PATCH / DELETE | `/website/employee/product-categories/[{id}/]` | CRUD دسته کالا |
| GET | `/website/employee/games/` (paginated) | لیست بازی‌ها |
| POST / PATCH | `/website/employee/games/` (FormData) · `/{id}/` | ایجاد/ویرایش بازی (آپلود تصویر) |
| DELETE | `/website/employee/games/{id}/` | حذف بازی |
| GET | `/website/employee/game-categories/` (paginated) | دسته بازی |
| POST / PATCH / DELETE | `/website/employee/game-categories/[{id}/]` | CRUD دسته بازی |

## نکات
- پیشوند همه اندپوینت‌ها `/website/employee/` است (نقش employee/admin).
- فقط **بازی‌ها** FormData/multipart هستند (تصویر اصلی)؛ بقیه payload JSON.
- بعد از هر mutation، کوئری لیست همان بخش invalidate می‌شود؛ پیام موفقیت با toast.
- مصرف‌کننده سمت سایت: هوک‌های عمومی `useProducts/useGames` (ببین [../website.md](../website.md)).
