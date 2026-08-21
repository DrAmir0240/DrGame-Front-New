# admin/accounting — حسابداری

## هدف
سیستم حسابداری کامل: سندهای پایه (درآمد/هزینه/خرید/فروش/حقوق)، تراکنش و فاکتور روزانه، گزارش‌های درآمد/هزینه/خالص و گزارش تخصصی تعمیرات/سونی/کالا.
مسیرها: `/admin/accounting` + `daily`, `invoices`, `reports`, `expense/[id]`, `income/[id]`, `payroll/[id]`, `purchase/[id]`, `sales/[id]`, `transactions/[id]`

## ساختار
```
accounting/
├── index.tsx · apis/index.ts
└── components/
```

## اندپوینت‌ها

### انتخابگرها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/accounting/choices/?type=` | آیتم‌های dropdown (`DropdownItem[]`) |
| GET | `/accounting/account-sides/{id}/` | جزئیات طرف حساب |

### طرف حساب (account-sides)
- `POST /accounting/account-sides/create/` · `PATCH /accounting/account-sides/{id}/edit/` · `DELETE /accounting/account-sides/{id}/delete/`

### گزارش‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/accounting/report/income/` (+`/weekly/`) | خلاصه و هفتگی درآمد |
| GET | `/accounting/report/expense/` (+`/weekly/`) | هزینه |
| GET | `/accounting/report/net/` | خالص (`NetReport`) |
| GET | `/accounting/repair/report/` (+`/weekly/`) | گزارش تعمیرات |
| GET | `/accounting/sony/report/` (+`/weekly/`) | گزارش اکانت سونی |
| GET | `/accounting/product/report/` (+`/weekly/`) | گزارش کالا |
| GET | `/accounting/product/report/by-category/` | تفکیک بر اساس دسته |

### سندهای پایه — الگوی یکسان CRUD
هر سند: `GET {base}/{id}/` ، `POST {base}/create/` ، `PATCH {base}/{id}/edit/` ، `DELETE {base}/{id}/delete/`

| سند | مسیر پایه |
|---|---|
| هزینه | `/accounting/expense/` |
| درآمد | `/accounting/income/` |
| حقوق | `/accounting/payroll/` |
| خرید | `/accounting/purchase/` |
| فروش | `/accounting/sales/` |

### اسناد روزانه
| متد | مسیر | توضیح |
|---|---|---|
| GET / PATCH / DELETE | `/accounting/daily/invoices/[{id}/edit|delete/]` | فاکتورهای ثبت‌شده |
| GET / PATCH / DELETE | `/accounting/daily/transactions/[{id}/edit|delete/]` | تراکنش‌های روزانه |

### ایجاد سریع
- `POST /accounting/invoices/create/`
- `POST /accounting/transactions/create/`

## نکات
- فرم‌های سند از `choices?type=...` برای انتخاب طرف حساب/دسته استفاده می‌کنند.
- گزارش‌های weekly آرایه `WeeklyReportItem[]` برمی‌گردانند (منبع نمودارها).
