# admin/repairs — تعمیرات (نمونه اولیه/ماک)

## هدف
UI مدیریت سفارش‌های تعمیر دستگاه. **فعلاً ماک است** — بدون فراخوانی API.
مسیر: `/admin/repairs`

⚠️ سیستم واقعی تعمیرات از طریق `admin/orders` با پیشوند `repair` (`/orders/repair/*`) انجام می‌شود.

## ساختار
```
repairs/
├── index.tsx · constants.ts · types.d.ts
└── components/
    ├── RepairsList.tsx          # لیست + جستجوی محلی
    ├── NewRepairDialog.tsx      # ثبت تعمیر جدید
    └── RepairStatusActions.tsx  # تغییر وضعیت محلی
```

## وضعیت فعلی
- داده‌ها state محلی + فیلتر `useMemo` روی متن جستجو.
- بدون پوشه apis و بدون React Query.
- برای اتصال به بک‌اند باید به هوک‌های `features/admin/orders/apis` (prefix = `repair`) مهاجرت کند:
  - لیست: `GET /orders/repair/orders/by-stage/{stageId}/`
  - جزئیات: `GET /orders/repair/orders/{id}/`
  - اقدام: `POST /orders/repair/orders/{id}/execute-action/` و `/advance-stage/`
