# گزارش تغییرات پروژه DrGame — سمت مشتری

این گزارش خلاصه‌ای از تغییرات اعمال‌شده در سه کامیت اخیر (بخش‌های یک، دو و سه) در پروژه DrGame می‌باشد. این تغییرات با هدف پیاده‌سازی رابط کاربری مشتری (Customer Interface) شامل فروشگاه، پروفایل، کیف پول، سفارشات، تیکت‌های پشتیبانی و وبلاگ انجام شده است.

---

## بخش اول — پیاده‌سازی زیرساخت و ماژول‌های پایه

### ۱. مدل‌ها و دیتابیس

- **کیف پول (`accounting/models.py`)**:
  - تغییر فیلد `balance` از `IntegerField` به `BigIntegerField`
  - افزودن فیلد `is_active = BooleanField(default=True)`
  - ایجاد مدل `WalletTransaction` با فیلدهای: نوع تراکنش (شارژ ادمین/درگاه/کسر سفارش/برگشت وجه)، وضعیت، مبلغ، درگاه پرداخت، Generic FK به سفارش، `performed_by` (کارمند)، `balance_before` و `balance_after`
- **سرویس کیف پول (`accounting/services.py`)**:
  - `WalletService.charge()` — شارژ اتمیک کیف پول با `select_for_update()`
  - `WalletService.debit()` — برداشت اتمیک با بررسی موجودی
- **سیگنال کیف پول (`accounting/signals.py`)**:
  - ایجاد خودکار `Wallet` هنگام ثبت‌نام کاربر جدید (`post_save` signal)
- **کش Redis (`utils/cache.py`)**:
  - ابزارهای کش کردن: `get_cached_data()` و `set_cached_data()` با TTL
  - پشتیبانی از `redis_cache` و `fallback_cache`
- **علاقه‌مندی‌های مشتری (`crm/models.py`)**:
  - مدل `CustomerWishlist` با Generic FK به `Product` یا `Game`
  - `unique_together = ('customer', 'content_type', 'object_id')`
- **برنامه پشتیبانی (`support/app`)**:
  - مدل `Ticket`: مشتری، عنوان، دسته‌بندی (order/payment/account/general)، وضعیت (open/in_progress/waiting/closed)، اولویت (low/medium/high)، Generic FK سفارش، `closed_at`
  - مدل `TicketMessage`: فرستنده (customer/employee/system)، بدنه، پیوست، `is_internal`
  - ادمین `TicketAdmin` با `TicketMessageInline` و تنظیم خودکار `closed_at`
- **برنامه وبلاگ (`blog/app`)**:
  - مدل `BlogPostCategory`: عنوان، توضیحات
  - مدل `BlogPost`: عنوان، اسلاگ، بدنه، تصویر کاور، دسته‌بندی، نویسنده (Employee)، وضعیت (draft/published)، `published_at`
  - مدل `BlogPostImage`: FK به پست + تصویر
  - ادمین `BlogPostAdmin` با `prepopulated_fields` برای اسلاگ

### ۲. مجوزها (`users/permissions.py`)

- رفع باگ `IsCustomer`: بررسی `hasattr(request.user, 'customer')` و `is_deleted=False`
- افزودن `IsCustomerOrReadOnly`: دسترسی کامل برای مشتری، فقط خواندنی برای کاربران مهمان
- افزودن `IsTicketOwner`: سطح آبجکت — فقط صاحب تیکت می‌تواند به آن دسترسی داشته باشد
- به‌روزرسانی `IsSuperuserOrHasRole`

### ۳. تنظیمات و URLها

- افزودن `support` و `blog` به `INSTALLED_APPS`
- افزودن مسیرهای `website/`, `customer/`, `support/`, `blog/` در `DrGame/urls.py`
- رفع circular import در `psn/models.py` (استفاده از lazy string FK)
- رفع مشکل مالکیت فایل در پوشه `blog/` (دسترسی نوشتن)

### ۴. ادمین

- **ادمین حساب‌داری (`accounting/admin.py`)**:
  - `WalletAdmin`: نمایش مشتری، موجودی، وضعیت فعال، اکشن شارژ دستی
  - `WalletTransactionAdmin`: فقط خواندنی، فیلتر بر اساس نوع و وضعیت
- **ادمین CRM (`crm/admin.py`)**:
  - بهبود `CustomerAdmin`: `list_display`، `search_fields`، `WalletInline`
  - `CustomerWishlistAdmin`
- **ادمین سفارشات**: ثبت `SonyAccountOrderCategoryAdmin`
- **ادمین پشتیبانی**: `TicketAdmin` با inline و `TicketMessageAdmin`

---

## بخش دوم — فروشگاه، پروفایل، کیف پول و سفارشات

### ۱. فروشگاه (Store) — API عمومی

**مسیر:** `/website/store/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/website/store/products/` | لیست محصولات با فیلتر (دسته، جستجو، محدوده قیمت، موجودی) |
| GET | `/website/store/products/{id}/` | جزئیات محصول |
| GET | `/website/store/products/{id}/images/` | تصاویر محصول |
| GET | `/website/store/categories/` | لیست دسته‌بندی‌ها |
| GET | `/website/store/games/` | لیست بازی‌ها (فروشگاه) |
| GET | `/website/store/games-category/` | دسته‌بندی اکانت سونی |

- مجوز: `AllowAny` برای همه (عمومی)
- فیلدهای پاسخ: `id, title, main_img, price, stock, category_id, category_title, is_in_wishlist`
- فیلد `is_in_wishlist` برای کاربران لاگین‌نشده `null` است

### ۲. پروفایل مشتری

**مسیر:** `/customer/profile/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/customer/profile/` | اطلاعات پروفایل (تلفن، نام، آدرس، کدپستی، تصویر، موجودی کیف پول) |
| PATCH | `/customer/profile/` | بروزرسانی پروفایل |
| POST | `/customer/profile/pic/` | آپلود تصویر پروفایل |

- مجوز: `IsAuthenticated + IsCustomer`
- سریالایزر: `CustomerProfileSerializer`, `CustomerProfilePicSerializer`

### ۳. کیف پول مشتری

**مسیر:** `/customer/wallet/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/customer/wallet/` | موجودی + ۵ تراکنش آخر |
| GET | `/customer/wallet/transactions/` | تاریخچه کامل تراکنش‌ها |
| POST | `/customer/wallet/charge/` | درخواست شارژ آنلاین (شبیه‌سازی‌شده) |

- تراکنش‌های `charge_gateway` با وضعیت `success` شبیه‌سازی می‌شوند

### ۴. علاقه‌مندی‌ها (Wishlist)

**مسیر:** `/customer/wishlist/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/customer/wishlist/` | لیست موارد موردعلاقه |
| POST | `/customer/wishlist/add/` | افزودن آیتم |
| DELETE | `/customer/wishlist/remove/{id}/` | حذف آیتم |
| POST | `/customer/wishlist/toggle/` | تغییر وضعیت (افزودن/حذف) |

### ۵. سفارشات مشتری

**مسیر:** `/customer/orders/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/customer/orders/` | لیست همه سفارش‌ها (فیلتر: type=product/sony/repair) |
| GET | `/customer/orders/products/` | سفارشات محصول |
| GET | `/customer/orders/products/{id}/` | جزئیات سفارش محصول |
| POST | `/customer/orders/products/create/` | ایجاد سفارش محصول |
| GET | `/customer/orders/sony/` | سفارشات اکانت سونی |
| GET | `/customer/orders/sony/{id}/` | جزئیات سفارش سونی (آیتم‌ها فقط در مرحله پایانی) |
| POST | `/customer/orders/sony/create/` | ایجاد سفارش سونی |
| GET | `/customer/orders/repair/` | سفارشات تعمیرات |
| GET | `/customer/orders/repair/{id}/` | جزئیات سفارش تعمیر |
| POST | `/customer/orders/repair/create/` | ایجاد سفارش تعمیر |

- مجوز: `IsAuthenticated + IsCustomer`
- استفاده از `select_related` و `prefetch_related` برای بهینه‌سازی
- `stage_logs` نمایش داده می‌شود، `action_logs` و اطلاعات کارمند مخفی است

---

## بخش سوم — تیکت‌های پشتیبانی و وبلاگ

### ۱. تیکت‌های پشتیبانی (مشتری)

**مسیر:** `/customer/tickets/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/customer/tickets/` | لیست تیکت‌های من |
| GET | `/customer/tickets/{id}/` | جزئیات تیکت + پیام‌ها |
| POST | `/customer/tickets/create/` | ایجاد تیکت جدید با پیام اولیه |
| POST | `/customer/tickets/{id}/reply/` | پاسخ به تیکت |
| GET | `/customer/tickets/{id}/messages/` | پیام‌های تیکت |

- مجوز: `IsAuthenticated + IsCustomer + IsTicketOwner`
- پیام‌های `is_internal=True` از دید مشتری پنهان است
- تیکت‌های بسته شده قابل پاسخ نیستند

### ۲. مدیریت تیکت‌ها (کارمندان)

**مسیر:** `/support/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/support/` | لیست همه تیکت‌ها (فیلتر: status, priority, category, assigned_to) |
| GET | `/support/{id}/` | جزئیات تیکت (با پیام‌های داخلی) |
| POST | `/support/{id}/assign/` | اختصاص تیکت به کارمند |
| POST | `/support/{id}/status/` | تغییر وضعیت تیکت |
| POST | `/support/{id}/internal-note/` | افزودن یادداشت داخلی (`is_internal=True`) |

- مجوز: `IsEmployee | IsMainManager`
- تغییر وضعیت به `closed` باعث ثبت خودکار `closed_at` می‌شود
- هنگام تغییر وضعیت و اختصاص، پیام سیستمی خودکار ثبت می‌شود

### ۳. وبلاگ عمومی

**مسیر:** `/blog/`

| متد | مسیر | توضیحات |
|------|------|---------|
| GET | `/blog/posts/` | لیست پست‌های منتشرشده (فیلتر: category) |
| GET | `/blog/posts/{slug}/` | جزئیات پست با تصاویر |
| GET | `/blog/categories/` | لیست دسته‌بندی‌های وبلاگ |

- مجوز: `AllowAny` (عمومی)
- فقط پست‌های با وضعیت `published` نمایش داده می‌شود
- فیلدهای پاسخ: `id, title, slug, body, cover_image, category, author_name, images, published_at`

### ۴. رفع باگ‌های import

- رفع `EmployeeHireSerializer` → `EmploymentResumeSerializer` در `website/views.py`
- رفع `EmployeeHire` → `EmploymentResume` در `website/views.py`
- رفع `GAME_ORDER_CONSOLE_TYPE` (import از accounting.models حذف و به صورت ثابت محلی تعریف شد)
- رفع `Game` import (از `inventory.models` به `website.models` تغییر یافت)
- رفع `CourseOrder` import تبدیل به lazy import با `apps.get_model()`
- رفع `ProductColor`, `GameImage`, `GameSerializer` (importهای شکسته در `website/serializers.py`)
- جابه‌جایی `GameSerializer` به قبل از `GameCartItemSerializer` (رفع forward reference)

---

## خلاصه APIهای نهایی

| مسیر | توضیحات |
|------|---------|
| `/website/store/` | فروشگاه عمومی (محصولات، بازی‌ها، دسته‌بندی‌ها) |
| `/customer/profile/` | پروفایل مشتری |
| `/customer/wallet/` | کیف پول و تراکنش‌ها |
| `/customer/wishlist/` | علاقه‌مندی‌ها |
| `/customer/orders/` | سفارشات (محصول، سونی، تعمیر) |
| `/customer/tickets/` | تیکت‌های پشتیبانی |
| `/support/` | مدیریت تیکت‌ها (کارمندان) |
| `/blog/` | وبلاگ عمومی |
