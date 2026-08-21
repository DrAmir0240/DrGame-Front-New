# داکیومنت کلی پروژه — دکترگیم (drgame-front)

وب‌سایت و پنل‌های مدیریت فروشگاه بازی «دکترگیم». این ریپو فقط **فرانت‌اند** است؛ بک‌اند (Django REST Framework) جدا است و از طریق REST API صدا زده می‌شود.

## ۱. استک تکنولوژی

| مورد | نسخه/ابزار |
|---|---|
| فریم‌ورک | Next.js 16 (App Router, standalone output) |
| زبان | TypeScript + چند فایل JS قدیمی در `src/lib` |
| UI | React 19 + Tailwind CSS 4 + کامپوننت‌های Radix (شبیه shadcn/ui) در `src/components/ui` |
| دیتافچینگ | TanStack React Query v5 |
| HTTP | Axios (یک instance مشترک) |
| فرم‌ها | react-hook-form |
| آیکون | lucide-react |
| تاریخ | moment / date-object / react-multi-date-picker (شمسی) |
| پکیج منیجر | pnpm |

اسکریپت‌ها (`package.json`):
- `dev` — اجرای محیط توسعه
- `build` / `start` — بیلد و اجرای پروداکشن
- `lint` — eslint
- `analyze` — تحلیل باندل

## ۲. ساختار پوشه‌ها

```
src/
├── app/                  # روتینگ App Router با Route Groups:
│   ├── (website)/        # سایت عمومی: /, products, games, blog, videos, cart, about-us
│   ├── (auth)/           # /login, /verify
│   ├── (customer)/       # پنل کاربر: profile, orders, wallet, wishlist, support, complete-profile
│   └── (admin)/admin/    # پنل ادمین: crm, orders, inventory, accounting, ...
├── features/             # کدهای اصلی به تفکیک فیچر (هر فیچر: apis/ components/ types.d.ts)
│   ├── landing/          # صفحه اصلی سایت
│   ├── website/          # بخش عمومی فروشگاه (محصول، بازی، سبد خرید، بلاگ، ویدیو)
│   ├── auth/             # لاگین OTP (login, verify)
│   ├── customer/         # پنل کاربری (profile, orders, wallet, wishlist, support, complete-profile)
│   ├── hr/               # منابع انسانی (employee-files, hr-management)
│   └── admin/            # پنل ادمین — ۱۹ زیرفیچر (پوشه markdowns/admin/)
├── components/
│   ├── ui/               # دیزاین‌سیستم (button, dialog, table, tabs, ... ~۴۰ کامپوننت)
│   └── layout/           # Header/Footer سایت، سایدبار و هدر ادمین
├── layouts/
│   ├── home-layout/      # لایه سایت عمومی
│   ├── user-layout/      # لایه پنل کاربری
│   └── admin-layout/     # لایه پنل ادمین + useGetAuthQuery (وضعیت احراز هویت)
├── api/api.ts            # Axios instance + interceptors (قلب ارتباط با سرور)
├── utils/                # cookie.ts, logout.ts, errors.ts, format.ts
└── lib/                  # utils.js (getImageUrl, cn), query-client.js
```

قاعده کلی: **هر فیچر یک پوشه** در `src/features/<section>/<name>` با ساختار `apis/index.ts` (هوک‌های React Query)، `components/`، `types.d.ts`، `constants.ts`.

## ۳. کلاینت API — `src/api/api.ts`

```ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,   // مثل https://domain/api/
  withCredentials: true,
  headers: { Accept: "application/json", "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY },
});
```

- **Request interceptor:** اگر کوکی `access_token` موجود باشد، هدر `Authorization: Bearer <token>` اضافه می‌شود. برای `FormData` هدر Content-Type حذف می‌شود (تا boundary درست ساخته شود).
- **Response interceptor (رفرش توکن):**
  - روی خطای `401` (و فقط یک بار `_retry`) → `POST {API}/users/refresh-token/` با `refresh_token` کوکی → ذخیره توکن جدید (`setAccess/setRefresh`) → تکرار درخواست اصلی.
  - اگر رفرش شکست خورد → `redirectToLogin()`: پاک کردن کوکی access، گارد `localStorage.auth_redirect`، ریدایرکت hard به `/login`.
- متغیرهای محیطی (`.env`): `NEXT_PUBLIC_API_URL` ، `NEXT_PUBLIC_X_API_KEY` ، `X_API_KEY`. توجه: هر `NEXT_PUBLIC_*` داخل باندل کلاینت embed می‌شود و عمومی است.
- ⚠️ امنیت: فعلاً API روی `http://IP` است؛ برای پروداکشن HTTPS + دامنه لازم است.

## ۴. احراز هویت

- ورود با **OTP**: موبایل → `/users/request-otp/` → صفحه verify → `/users/verify-otp/` → توکن‌ها در کوکی ذخیره می‌شوند.
- کوکی‌ها (js-cookie): `access_token` (۱ روز)، `refresh_token` (۳۰ روز) — ست/خواندن با `src/utils/cookie.ts`.
- خروج: `src/utils/logout.ts` — حذف کوکی‌ها + ریدایرکت `/login`.
- **منبع حقیقت وضعیت لاگین:** هوک `useGetAuthQuery` در `src/layouts/admin-layout/apis/use-get-auth.query.ts`
  - `GET /users/auth/status/` → `AuthStatus` شامل `is_authenticated`, `is_manager`, `is_employee`, `user_pic`, `employee_permissions`, ...
  - الگوی مصرف: `const isAuthenticated = auth?.is_authenticated === true;`
  - بعد از لاگین/تغییر پروفایل، کوئری با کلید `["auth-status"]` invalidate می‌شود.
- **گیت سبد خرید:** تمام کوئری‌های cart در `features/website/apis` با `enabled: isAuthenticated` قفل شده‌اند تا کاربر مهمان درخواستی به اندپوینت‌های cart نفرستد؛ دکمه افزودن به سبد در حالت لاگین‌نبودن به `/login` ریدایرکت می‌کند.

## ۵. کنوانسیون‌ها و پترن‌های رایج

1. **نرمال‌سازی پاسخ لیست** — بک‌اند بعضی لیست‌ها را paginate می‌کند (`{count,next,previous,results}`) و بعضی آرایه خام برمی‌گرداند. هلپر استاندارد:
   ```ts
   function extractArray<T>(data: unknown): T[] {
     if (Array.isArray(data)) return data;
     if (data && typeof data === "object" && "results" in data) return (data as { results: T[] }).results;
     return [];
   }
   ```
   (در `features/website/apis`، `features/admin/orders/apis`, `dashboard: unwrapResponse`)
2. **کلیدهای کوئری** به صورت آرایه تو در تو: `["crm","customers",filters]`، `["website","cart","product"]` و... . بعد از هر mutation موفق، کوئری مرتبط invalidate می‌شود.
3. **آپلود فایل:** همیشه `FormData` + multipart؛ interceptor هدر Content-Type را حذف می‌کند.
4. **پیجینیشن:** معمولاً `limit=10/offset` با کامپوننت `Pagination`; فیلترها مقدار `""/null/"all"` را نمی‌فرستند (`buildParams`).
5. **خطاها:** `toastApiError(err, "پیام پیش‌فرض")` از `src/utils/errors.ts` + sonner toast.
6. **قالب‌بندی:** `formatPrice/formatNumber` در `src/utils/format.ts`؛ تصاویر نسبی با `getImageUrl(path)` در `src/lib/utils.js` به baseURL API وصل می‌شوند.
7. **UI:** همه چیز RTL فارسی؛ کامپوننت‌های پایه از `@/components/ui` (Dialog, DataTable, Tabs, ConfirmModal, Pagination, ...).
8. **بدون کامنت‌گذاری اضافی** و بدون state manager گلوبال (فقط React Query + کوکی).

## ۶. نقشه مسیرها (App Router)

### (website) — سایت عمومی
`/` (landing) · `/products` · `/products/[id]` · `/games` · `/games/[id]` · `/blog` · `/blog/[id]` · `/videos` · `/videos/[id]` · `/cart` · `/about-us`

### (auth)
`/login` · `/verify`

### (customer) — پنل کاربر
`/profile` · `/orders` · `/wallet` · `/wishlist` · `/support` · `/support/[id]` · `/complete-profile`

### (admin)/admin — پنل مدیریت
| بخش | مسیرها |
|---|---|
| داشبورد | `/admin` |
| سفارشات | `/admin/orders`, `/admin/orders/config`, `/new`, `/product`, `/repair`, `/sony-account`, `/[id]` |
| CRM | `/admin/crm` |
| انبار | `/admin/inventory` + `products/categories/movements/suppliers/purchase-orders` |
| حسابداری | `/admin/accounting` + `daily, invoices, reports, expense/income/payroll/purchase/sales/[id], transactions/[id]` |
| اکانت سونی (PSN) | `/admin/psn/accounts`, `/account-statuses`, `/account-categories` |
| فروشگاه | `/admin/store/products`, `/game-categories`, `/games`, `/product-categories` |
| وبسایت | `/admin/website/banners`, `/sections`, `/blog`, `/blog-categories`, `/videos`, `/about-us` |
| منابع انسانی | `/admin/hr/employees`, `/management`, `/payroll` |
| تنظیمات | `/admin/settings` + `roles/[id], permissions, employee-roles, bank-accounts, invoice-categories, sony-banks, sell-methods, *-order-categories` |
| سایر | `/admin/tasks`, `/tasks/daily`, `/admin/docs`, `/admin/accounts`, `/admin/account-sales`, `/admin/games` (ماک), `/admin/repairs` |

## ۷. دیپلوی

- `Dockerfile` سه‌مرحله‌ای (deps → build → runner) با خروجی **standalone** روی node:22-alpine، پورت 3000.
- `ARG NEXT_PUBLIC_API_URL` و `ARG NEXT_PUBLIC_X_API_KEY` موقع build تزریق می‌شوند (مقادیر NEXT_PUBLIC در زمان build قطعی می‌شوند نه runtime!).
- `docker-compose.dev.yml` برای توسعه، `docker-compose.prod.yml` برای پروداکشن.

## ۸. داکیومنت‌های هر فیچر

- [auth.md](./auth.md) — ورود OTP
- [landing.md](./landing.md) — صفحه اصلی
- [website.md](./website.md) — فروشگاه عمومی (محصول/بازی/سبدخرید/بلاگ/ویدیو)
- [customer.md](./customer.md) — پنل کاربری
- [hr.md](./hr.md) — منابع انسانی
- [admin/](./admin/) — ۱۹ زیرفیچر پنل ادمین (هر کدام یک فایل md)
