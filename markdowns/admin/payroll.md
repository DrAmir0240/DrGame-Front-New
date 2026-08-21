# admin/payroll — حقوق و دستمزد

## هدف
محاسبه پیش‌نمایش حقوق کارمند، صدور فیش حقوقی و پرداخت.
مسیر: `/admin/hr/payroll`

## ساختار
```
payroll/
├── index.tsx · apis/index.ts
└── components/
```

## اندپوینت‌ها
| متد | مسیر | هوک | توضیح |
|---|---|---|---|
| GET | `/hr/payroll/calculate/?params` | `usePayrollPreview` | محاسبه زنده قبل از ثبت |
| GET | (لیست) paginated | `usePayrollList` | لیست فیش‌ها |
| GET | `/hr/payroll/{id}/` | `usePayrollDetail` | جزئیات فیش |
| POST | `/hr/payroll/` | `useCreatePayrollInvoice` | صدور فیش (`payload`) |
| POST | `/hr/payroll/pay/` | `usePaySalary` | پرداخت (`PayrollPayResponse`) |

## نکات
- `calculate` با پارامترها (کارمند/بازه) پیش‌نمایش محاسبه را برمی‌گرداند؛ فرم قبل از ثبت آن را نشان می‌دهد.
- این فیچر مکمل `hr-management` است: تعریف حقوق در HR، محاسبه/پرداخت اینجا؛ گزارش مالی آن در حسابداری (`/accounting/payroll/*`).
