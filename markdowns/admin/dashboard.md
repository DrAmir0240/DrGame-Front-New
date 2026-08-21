# admin/dashboard — داشبورد مدیریتی

## هدف
نمای کلی KPI و نمودارها در ۶ حوزه: مالی، سفارشات، انبار، اکانت سونی، مشتریان، کارکنان — با فیلتر بازه تاریخ سراسری.
مسیر: `/admin`

## ساختار
```
dashboard/
├── index.tsx                  # DashboardPage — ۶ تب + DateRange مشترک
├── types.d.ts · apis/index.ts
└── components/
    ├── DateRange.tsx          # انتخاب بازه (پیش‌فرض: ۳۰ روز اخیر)
    ├── TrendBadge.tsx         # درصد تغییر نسبت به دوره قبل
    ├── FinancialWidgets.tsx · OrdersWidgets.tsx · InventoryWidgets.tsx
    ├── SonyWidgets.tsx · CustomersWidgets.tsx · HrWidgets.tsx
```

## اندپوینت‌ها
همه `GET` و از یک هوک مشترک `useDashboardQuery` با کلید `["admin","dashboard",key,filters,extra]` استفاده می‌کنند:

**مالی:** `/dashboard/financial/summary/` · `/income/` · `/expense/` · `/invoice-categories/` · `/wallet-transactions/`
**سفارشات:** `/dashboard/orders/summary/` · `/by-day/` · `sony-account|repair|product` × `by-category/` · `by-source/`
**انبار:** `/dashboard/inventory/summary/` · `/low-stock/` · `/top-selling/?limit=10` · `/movements/by-reason/` · `/purchase-orders/summary/`
**اکانت سونی:** `/dashboard/sony-accounts/summary/` · `/by-region/` · `/by-status/` · `/top-used/?limit=10`
**مشتریان:** `/dashboard/customers/summary/` · `/top-by-revenue/?limit=10` · `/new-by-day/`
**کارکنان:** `/dashboard/employees/commission-summary/` · `/payroll-summary/` · `/order-actions/`

## نکات
- فقط کوئری است؛ هیچ mutation ندارد.
- `unwrapResponse` شکل‌های مختلف پاسخ را هندل می‌کند: آرایه خام، `{results:[...]}` یا تو در توی `{data:{...}}`.
- پارامترهای خالی (`""`, null) ارسال نمی‌شوند؛ تاریخ به صورت ISO دو مقدار from/to.
- داده هر تب در کامپوننت Widgets خودش جمع شده و کارت KPI + داده نمودار می‌سازد.
