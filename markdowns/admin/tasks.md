# admin/tasks و admin/daily-tasks — وظایف

## tasks — مدیریت وظایف
مسیر: `/admin/tasks`

### اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/task-manager/choices/` | گزینه‌های فرم (شامل `employees`) |
| GET | `/task-manager/list/` | لیست وظایف (`TaskListResponse`) |
| POST | `/task-manager/personal/add/` | ایجاد وظیفه شخصی |
| POST | `/task-manager/organize/add/` | ایجاد وظیفه سازمانی |
| PATCH | `/task-manager/personal/{id}/` | ویرایش (JSON یا FormData) / تغییر وضعیت `{status}` |
| PATCH | `/task-manager/organize/{id}/` | ویرایش وظیفه سازمانی |
| DELETE | `/task-manager/personal/{id}/` · `/organize/{id}/` | حذف |

### کامپوننت‌ها
- `TaskFormDialog.tsx` — فرم مشترک با Select کارکنان از `choices.employees`.
- تفکیک دو نوع وظیفه: شخصی (personal) و سازمانی (organize).

## daily-tasks — وظایف روزانه
مسیر: `/admin/tasks/daily`

### اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/task-manager/choices/` | گزینه‌ها (employees و...) |
| GET | `/task-manager/daily-tasks/list/` | لیست وظایف روزانه |
| POST | `/task-manager/daily-tasks/add/` | ایجاد روزانه شخصی |
| POST | `/task-manager/daily-tasks/organize/add/` | ایجاد روزانه سازمانی |

- ساختار مشابه tasks است (`TaskFormDialog`, `ChoicesData`) ولی فقط create/list دارد.

## نکات
- تغییر وضعیت وظیفه با PATCH مینیمال `{status}` انجام می‌شود.
- هر دو فیچر بعد از mutation لیست را invalidate و toast موفقیت نشان می‌دهند.
