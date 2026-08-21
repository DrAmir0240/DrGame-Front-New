# admin/videos — مدیریت ویدیوها

## هدف
CRUD ویدیوهای سایت که در صفحه عمومی `/videos` نمایش داده می‌شوند.
مسیر: `/admin/website/videos`

## ساختار
```
videos/
├── index.tsx · apis/index.ts
└── components/ (جدول + فرم آپلود)
```

## اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| POST | `/website/employee/videos/` (FormData) | آپلود ویدیو |
| PATCH | `/website/employee/videos/{id}/` (FormData) | ویرایش |
| DELETE | `/website/employee/videos/{id}/` | حذف |
| GET | (لیست) `/website/videos/` paginated | همان منبع بخش عمومی |

## نکات
- آپلود multipart است؛ interceptor هدر Content-Type را برای FormData حذف می‌کند.
- مصرف‌کننده سمت سایت: هوک `GET /website/videos/` در `features/website/videos/apis`.
