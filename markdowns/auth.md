# auth — ورود و تأیید (OTP)

## هدف
ورود/ثبت‌نام کاربر با شماره موبایل و کد یک‌بارمصرف (OTP) در دو مرحله: `login` → `verify`.

## ساختار
```
auth/
├── login/
│   ├── index.tsx              # فرم موبایل
│   ├── constants.ts           # لیبل‌ها (phoneLabel, phonePlaceholder)
│   ├── types.d.ts
│   ├── apis/index.ts          # requestOtp / verifyOtp
│   └── components/AuthLayout.tsx  # قالب بصری صفحات ورود
└── verify/
    ├── index.tsx              # ورود کد OTP (input-otp)
    ├── constants.ts
    ├── types.d.ts
    └── apis/index.ts
```

## اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| POST | `/users/request-otp/` | ارسال کد به موبایل |
| POST | `/users/verify-otp/` | بررسی کد؛ پاسخ حاوی توکن‌ها |

(آدرس‌ها در `constants.ts` به صورت `requestOtp: "/users/request-otp/"`)

## جریان
1. کاربر در `/login` شماره را وارد می‌کند — اعتبارسنجی react-hook-form:
   - `required: "شماره موبایل الزامی است"`
   - `pattern: /^0?9\d{9}$/` → «شماره موبایل معتبر نیست»
   - اینپوت: `dir="ltr"`, `autoComplete="tel"`، آیکون Phone.
2. `request-otp` زده می‌شود و کاربر به `/verify` هدایت می‌شود (شماره از طریق state/route منتقل می‌شود).
3. در `/verify` کد با کامپوننت OTP وارد و `verify-tp` زده می‌شود.
4. پس از موفقیت، توکن‌های دریافتی با `setAccess()` / `setRefresh()` (از `src/utils/cookie.ts`) در کوکی ذخیره و کاربر به سایت/پنل هدایت می‌شود.

## نکات
- بعد از لاگین، کوئری `["auth-status"]` باید invalidate شود تا Header وضعیت جدید را بگیرد.
- اگر پروفایل ناقص باشد (`is_complete_profile=false` در AuthStatus)، بنر CompleteProfileBanner در هدر نمایش داده می‌شود و مسیر `/complete-profile` تکمیل اطلاعات را انجام می‌دهد.
- ریدایرکت اجباری هنگام انقضای توکن هم به همین `/login` انجام می‌شود (interceptor در `src/api/api.ts`).
