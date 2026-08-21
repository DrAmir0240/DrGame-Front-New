# hr — منابع انسانی

## هدف
دو بخش: مدیریت کارمندان/مدارک (employee-files) و پنل کامل HR (hr-management) شامل رزومه، تردد، درخواست‌ها، حقوق و اضافه‌کاری.

## employee-files — پرونده کارمند
```
employee-files/
└── apis/index.ts
```
- API:
  - `GET /hr/employees/?params` → لیست paginated کارمندان (`PaginatedResponse<Employee>`)
  - `POST /hr/employees/create/` → ایجاد کارمند (`EmployeeFormData`)
  - `POST /hr/employees/files/create/` (FormData) → آپلود فایل برای پرونده

## hr-management — مدیریت منابع انسانی
مسیرهای مرتبط: `/admin/hr/management` ، `/admin/hr/employees`

### اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/hr/employees/` | لیست کارمندان |
| GET | `/hr/resumes/?params` | رزومه‌ها |
| POST | `/hr/resumes/create/` (FormData) | ثبت رزومه |
| GET | `/hr/arrivals/?params` | تردد/ورود و خروج |
| POST | `/hr/arrivals/create/` | ثبت تردد (`ArrivalFormData`) |
| GET | `/hr/request-types/` | انواع درخواست |
| POST | `/hr/request-types/create/` | تعریف نوع درخواست |
| GET | `/hr/requests/?params` | درخواست‌های کارکنان |
| POST | `/hr/requests/create/` | ثبت درخواست (`EmployeeRequestFormData`) |
| GET | `/hr/payrolls/?params` | لیست حقوق و دستمزد |
| POST | `/hr/payrolls/create/` | ثبت فیش حقوقی (`PayrollFormData`) |
| GET | `/hr/overtimes/?params` | اضافه‌کاری‌ها |
| POST | `/hr/overtimes/create/` | ثبت اضافه‌کاری (`OvertimeFormData`) |
| GET | `/accounting/choices/?type=...` | آیتم‌های dropdown مشترک با حسابداری |

## کامپوننت‌ها (hr-management)
- `ResumeTab.tsx` — تب رزومه؛ فرم شامل «شماره موبایل» با required.
- تب‌های دیگر برای arrivals / requests / payrolls / overtimes با جدول + دیالوگ فرم.

## نکات
- همه لیست‌ها `limit/offset` paginated هستند.
- آپلود فایل (رزومه، مدارک) با FormData/multipart.
- هوک‌های payroll جداگانه در `features/admin/payroll` هستند (محاسبه/پرداخت) — ببین [admin/payroll.md](./admin/payroll.md).
