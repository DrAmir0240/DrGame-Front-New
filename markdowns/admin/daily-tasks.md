# admin/daily-tasks — وظایف روزانه

## هدف
ثبت و پیگیری وظایف روزانه (شخصی/سازمانی). مسیر: `/admin/tasks/daily`

## ساختار
```
daily-tasks/
├── index.tsx · types.d.ts · constants.ts
├── apis/index.ts
└── components/TaskFormDialog.tsx
```

## اندپوینت‌ها
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/task-manager/choices/` | گزینه‌های فرم (`ChoicesData` شامل `employees`) |
| GET | `/task-manager/daily-tasks/list/` | لیست وظایف روزانه (`TaskListResponse`) |
| POST | `/task-manager/daily-tasks/add/` | ایجاد روزانه شخصی |
| POST | `/task-manager/daily-tasks/organize/add/` | ایجاد روزانه سازمانی |

## نکات
- ساختار و کامپوننت‌ها با `admin/tasks` مشترک است؛ تفاوت فقط پیشوند `/daily-tasks/` در اندپوینت‌ها.
- برخلاف tasks، اینجا update/delete وجود ندارد (فقط create/list).
- مستند مرتبط: [tasks.md](./tasks.md)
