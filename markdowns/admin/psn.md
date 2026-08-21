# admin/psn — مدیریت اکانت‌های PlayStation

## هدف
مدیریت اکانت‌های سونی/PSN که فروخته می‌شوند: مشخصات اکانت، بازی‌های هر اکانت، دسته‌ها و وضعیت‌ها.
مسیرها: `/admin/psn/accounts`, `/account-statuses`, `/account-categories`

## ساختار
```
psn/
├── index.tsx · types.d.ts · apis/index.ts
└── components/ (جدول، فرم‌ها، گیم‌پیکر)
```

## اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/psn/accounts/` (paginated) | لیست اکانت‌ها |
| GET | `/psn/accounts/{id}/` | جزئیات اکانت |
| POST | `/psn/accounts/` | ایجاد (`payload`) |
| PATCH | `/psn/accounts/{id}/` | ویرایش |
| DELETE | `/psn/accounts/{id}/` | حذف |
| GET | `/psn/accounts/{accountId}/games/` | بازی‌های اکانت |
| POST | `/psn/accounts/{accountId}/games/` `{game_ids}` | افزودن گروهی بازی |
| DELETE | `/psn/accounts/{accountId}/games/{id}/` | حذف بازی از اکانت |
| GET | `/psn/games/` (paginated) | پیکر بازی برای انتخاب |
| GET | `/psn/account-statuses/` | لیست وضعیت‌ها |
| POST/PATCH/DELETE | `/psn/account-statuses/[{id}/]` | CRUD وضعیت |
| GET | `/psn/account-categories/` | لیست دسته‌ها |

## نکات
- هوک‌ها پاسخ آرایه یا `PaginatedResponse` را هندل می‌کنند.
- افزودن بازی به اکانت به صورت انتخاب چندتایی (game_ids) است؛ بعد از mutation لیست games اکانت invalidate می‌شود.
- داشبورد مرتبط: `GET /dashboard/sony-accounts/*` (ببین [dashboard.md](./dashboard.md)).
