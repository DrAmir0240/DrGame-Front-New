# admin/accounts — حساب‌ها (نمونه اولیه/ماک)

## هدف
UI مدیریت حساب‌ها با فیلتر و فرم. **فعلاً ماک است** — بدون فراخوانی API.
مسیر: `/admin/accounts`

⚠️ مدیریت واقعی طرف‌های حساب در `admin/accounting` انجام می‌شود:
- `POST /accounting/account-sides/create/`
- `PATCH /accounting/account-sides/{id}/edit/`
- `DELETE /accounting/account-sides/{id}/delete/`

## ساختار
```
accounts/
├── index.tsx · constants.ts · types.d.ts
└── components/
    ├── AccountsTable.tsx
    ├── AccountFilters.tsx      # جستجو/فیلتر محلی
    └── AccountFormDialog.tsx   # فرم (state محلی)
```

## وضعیت فعلی
- داده ثابت + `useMemo` برای فیلتر؛ بدون پوشه apis.
- برای اتصال، CRUD `/accounting/account-sides/*` جایگزین state محلی شود.
