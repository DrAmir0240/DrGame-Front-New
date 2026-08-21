# admin/crm — مدیریت مشتریان (CRM)

## هدف
باشگاه مشتریان: پرونده مشتری عادی و B2B، پروفایل تجاری، خلاصه مالی (تراکنش/فاکتور) و ارسال پیامک گروهی.
مسیر: `/admin/crm`

## ساختار
```
crm/
├── index.tsx                      # CrmPage — تب‌های files / sms
├── types.d.ts · constants.ts
├── apis/index.ts
└── components/
    ├── CustomerListPanel.tsx      # لیست paginated + زیرتب عادی/B2B
    ├── CustomerDetailPanel.tsx    # نمای کامل مشتری
    ├── CustomerFormDialog.tsx     # ایجاد/ویرایش مشتری
    ├── B2BFormDialog.tsx          # پروفایل تجاری
    └── SendSmsTab.tsx             # پیامک گروهی
```

## اندپوینت‌ها
| متد | مسیر | هوک |
|---|---|---|
| GET | `/crm/customers/` | `useCustomerList` |
| GET | `/crm/customers/b2b/` | `useB2BCustomerList` |
| GET | `/crm/customers/{id}/` | `useCustomerDetail` |
| POST | `/crm/customers/create/` (FormData) | `useCreateCustomer` |
| PATCH | `/crm/customers/{id}/` (FormData) | `useUpdateCustomer` |
| DELETE | `/crm/customers/{id}/` | `useDeleteCustomer` |
| GET | `/crm/customers/{id}/b2b/detail/` | `useB2BProfile` |
| POST | `/crm/customers/{id}/b2b/` | `useCreateB2BProfile` |
| PATCH | `/crm/customers/{id}/b2b/detail/` | `useUpdateB2BProfile` |
| DELETE | `/crm/customers/{id}/b2b/detail/` | `useDeleteB2BProfile` |
| GET | `/crm/customers/{id}/summary/` | `useCustomerSummary` |
| GET | `/crm/customers/{id}/transactions/` | `useCustomerTransactions` |
| GET | `/crm/customers/{id}/invoices/` | `useCustomerInvoices` |
| POST | `/crm/customer/send-sms-service/` | `useSendSms` |

## آدرس‌های مشتری
کارت «آدرس‌ها» در `CustomerDetailPanel` از کامپوننت مشترک `AddressSection` (`features/customer/addresses`) با prop `customerId` استفاده می‌کند. هوک‌ها در همان فیچر هستند و با scope ادمین به پیشوند زیر می‌روند (permission: IsEmployee):
- `GET /crm/customers/{customerId}/addresses/?limit=&offset=` → لیست (paginated)
- `POST /crm/customers/{customerId}/addresses/` → افزودن آدرس برای مشتری
- `PATCH /crm/customers/{customerId}/addresses/{id}/` → ویرایش / پیش‌فرض‌سازی (`{is_default:true}`)
- `DELETE /crm/customers/{customerId}/addresses/{id}/` → حذف نرم (204)
- کلید کوئری: `["addresses", customerId, page]`؛ آدرس متعلق به مشتری دیگر → 404

## فرم ایجاد مشتری (`POST /crm/customers/create/`)
فیلدهای بک‌اند: `number`, `first_name`, `last_name`, `profile_pic`
- **شماره موبایل** — الزامی + pattern `/^0?9\d{9}$/`، `dir="ltr"`، maxLength=11
- **نام / نام خانوادگی** — الزامی
- **تصویر پروفایل** — انتخاب فایل با پیش‌نمایش (اختیاری)
- حالت ویرایش (`PATCH /crm/customers/{id}/`) به جای فیلدهای بالا، آدرس + کدپستی + تصویر را می‌فرستد.
- کلیدهای کوئری: `["crm","customers","normal"|"b2b",filters]`؛ بعد از CRUD همه `["crm","customers"]` invalidate می‌شوند.

## تایپ‌ها
`Customer` (شامل full_name, phone, address, postal_code, profile_pic, has_b2b) · `CustomerFormData` · `B2BProfile(FormData)` · `CustomerSummary` · `CustomerTransaction` · `CustomerInvoice` · `SendSmsPayload {message, customer_ids[], send_time?}` · `PaginatedResponse<T>`

## نکات
- پیجینیشن LIMIT=10؛ فیلتر `"all"` حذف می‌شود؛ `refreshKey` برای رفرش دستی لیست.
- SendSms خطای `response.data.detail` را مستقیم toast می‌کند.
