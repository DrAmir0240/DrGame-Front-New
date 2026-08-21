# admin/settings — تنظیمات پلتفرم

## هدف
تنظیمات سراسری سیستم: نقش‌ها/دسترسی‌ها، نقش کارمندان، و CRUD دسته‌بندی‌های سفارش‌ها، بانک‌های سونی، حساب‌های بانکی، دسته فاکتورها و روش‌های فروش.
مسیر: `/admin/settings` + زیرمسیرها (`roles/[id]`, `permissions`, `employee-roles`, `bank-accounts`, `invoice-categories`, `sony-banks`, `sell-methods`, `sony-order-categories`, `product-order-categories`, `repair-order-categories`)

## ساختار
```
settings/
├── index.tsx · apis/index.ts
└── employee-roles/        # تخصیص نقش به کارمند
```

## اندپوینت‌ها

### نقش‌ها و دسترسی‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/platform-settings/permissions/` | لیست دسترسی‌ها |
| GET | `/platform-settings/roles/` | لیست نقش‌ها |
| GET | `/platform-settings/roles/{id}/` | جزئیات نقش |
| POST/PATCH/DELETE | `/platform-settings/roles/[{id}/]` | CRUD نقش (`RoleFormData`) |
| POST | `/platform-settings/roles/{id}/permissions/assign/` `{permission_ids}` | افزودن دسترسی |
| POST | `/platform-settings/roles/{id}/permissions/remove/` `{permission_ids}` | حذف دسترسی |
| POST | `/platform-settings/employees/{employeePk}/roles/assign/` `{role_ids}` | تخصیص نقش به کارمند |
| POST | `/platform-settings/employees/{employeePk}/roles/remove/` `{role_ids}` | سلب نقش |

### دسته‌بندی‌ها و تنظیمات مالی
| موجودیت | مسیر پایه (GET لیست / POST / PATCH {id}/ / DELETE {id}/) |
|---|---|
| دسته سفارش سونی | `/platform-settings/sony-order-categories/` |
| دسته سفارش کالا | `/platform-settings/product-order-categories/` |
| دسته سفارش تعمیرات | `/platform-settings/repair-order-categories/` |
| روش‌های فروش | `/platform-settings/sell-methods/` |
| بانک‌های سونی | `/platform-settings/sony-banks/` |
| حساب‌های بانکی | `/platform-settings/bank-accounts/` (`BankAccountFormData`) |
| دسته‌های فاکتور | `/platform-settings/invoice-categories/` |

## نکات
- پاسخ لیست‌ها ممکن است آرایه یا `{results}` باشد — هر دو حالت هندل شده.
- صفحه employee-roles از `GET /hr/employees/` برای انتخاب کارمند استفاده می‌کند.
- این مقادیر در کل پنل (فرم سفارش‌ها، حسابداری) به عنوان dropdown مصرف می‌شوند.
