# customer — پنل کاربری

## هدف
قسمت‌های مخصوص کاربر لاگین‌شده: پروفایل، سفارشات، کیف پول، علاقه‌مندی‌ها، تیکت پشتیبانی و تکمیل پروفایل. لایه مسیرها: `(customer)` با `user-layout`.

## زیرفیچرها

### complete-profile — تکمیل پروفایل
- مسیر: `/complete-profile`
- API: `POST /users/complete-profile/` (FormData)
- پس از موفقیت `["auth-status"]` را invalidate می‌کند تا بنر «پروفایل ناقص» در هدر محو شود.
- اگر کاربر هنوز آدرسی نداشته باشد (`profile.has_address == false`)، اولین آدرس با `is_default=true` از همین مسیر ساخته می‌شود.

### addresses — آدرس‌های من
- مسیر: `/addresses` (آیتم سایدبار «آدرس‌ها») — کامپوننت مشترک `AddressSection` در `features/customer/addresses`
- API (پیشوند `/customer/addresses/`, permission: IsCustomer):
  - `GET /customer/addresses/?limit=&offset=` → `useAddressList` (پاسخ paginated `{count,next,previous,results}`؛ ترتیب: پیش‌فرض اول)
  - `POST /customer/addresses/` → `useCreateAddress`
  - `PATCH /customer/addresses/{id}/` → `useUpdateAddress`
  - `PATCH /customer/addresses/{id}/` `{is_default:true}` → `useSetDefaultAddress` (سرور خودش بقیه را false می‌کند)
  - `DELETE /customer/addresses/{id}/` → `useDeleteAddress` (حذف نرم، پاسخ 204)
- فیلدهای فرم (`AddressFormDialog`): title, receiver_name, receiver_phone, province, city, address, postal_code, is_default (Switch)
- اعتبارسنجی سمت فرانت (سرور فقط طول/required چک می‌کند): موبایل `^09\d{9}$`، کد پستی `^\d{10}$`؛ استان/شهر متن آزاد
- کلید کوئری: `["addresses","me",page]` — کامپوننت مشترک با پارامتر `customerId` در CRM ادمین هم استفاده می‌شود

### profile — پروفایل کاربر
- مسیر: `/profile`
- API:
  - `GET /customer/profile/` → `useProfile` (تایپ `Profile`)
  - `PATCH /customer/profile/` (JSON یا FormData برای تصویر) → آپدیت پروفایل + invalidate `["auth-status"]`
- کامپوننت اصلی: `profile-info-card.tsx` (ویرایش نام، شماره موبایل با لیبل «شماره موبایل»)

### orders — سفارشات کاربر
- مسیر: `/orders`
- API:
  - `GET /customer/orders/` → لیست کل سفارش‌ها
  - `GET /customer/orders/products/?params` → سفارش کالا
  - `GET /customer/orders/sony/?params` → سفارش اکانت سونی
  - `GET /customer/orders/repair/?params` → سفارش تعمیرات
  - `POST /customer/orders/products/create/` → ثبت سفارش کالا از سبد

### wallet — کیف پول
- مسیر: `/wallet`
- API:
  - `GET /customer/wallet/` → نمای کلی (موجودی) — تایپ `WalletOverview`
  - `GET /customer/wallet/transactions/` → تراکنش‌ها
  - `POST /customer/wallet/charge/` `{amount}` → شارژ کیف پول

### wishlist — علاقه‌مندی‌ها
- مسیر: `/wishlist`
- API:
  - `GET /customer/wishlist/?params` → لیست علاقه‌مندی‌ها
  - `POST /customer/wishlist/add/` → افزودن
  - `POST /customer/wishlist/toggle/` → افزودن/حذف (toggle) — توسط صفحات محصول/بازی هم استفاده می‌شود

### support — تیکت پشتیبانی
- مسیرها: `/support` و `/support/[id]`
- API:
  - `GET /customer/tickets/` → لیست تیکت‌ها
  - `POST /customer/tickets/create/` → ایجاد تیکت

## نکات
- همه اندپوینت‌ها پیشوند `/customer/` دارند و نیاز به توکن دارند (interceptor خودش Authorization می‌گذارد).
- الگوی هوک‌ها مثل بقیه پروژه است: React Query + invalidate بعد از mutation + toast موفقیت.
