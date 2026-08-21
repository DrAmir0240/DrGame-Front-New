# admin/account-sales — فروش اکانت (نمونه اولیه/ماک)

## هدف
UI لیست/مدیریت فروش اکانت‌های بازی. **فعلاً ماک است** — بدون فراخوانی API.
مسیر: `/admin/account-sales`

⚠️ داده واقعی فروش اکانت‌های سونی از `admin/orders` (پیشوند `sony-account`) و مدیریت خود اکانت‌ها از `admin/psn` می‌آید.

## ساختار
```
account-sales/
├── index.tsx · constants.ts · types.d.ts
└── components/AccountSalesTable.tsx
```

## وضعیت فعلی
- جدول با داده ثابت (`constants.ts`)؛ بدون apis، بدون React Query، بدون mutation.
- برای واقعی شدن باید به هوک‌های سفارشات سونی متصل شود:
  - `useMyStages("sony-account")` / `useOrdersByStage(...)` از `features/admin/orders/apis`
  - یا داشبورد: `GET /dashboard/orders/sony-account/*`
