# admin/blog — مدیریت بلاگ

## هدف
مدیریت پست‌ها و دسته‌بندی‌های بلاگ که در سایت عمومی `/blog` نمایش داده می‌شوند.
مسیرها: `/admin/website/blog`, `/admin/website/blog-categories`

## ساختار
```
blog/
├── types.d.ts
├── categories/
│   ├── index.tsx
│   ├── apis/index.ts
│   └── components/category-form-dialog.tsx
└── posts/
    ├── index.tsx
    ├── apis/index.tsx
    └── components/post-form-dialog.tsx
```

## اندپوینت‌ها — پست‌ها (`posts/apis`)
| متد | مسیر | توضیح |
|---|---|---|
| GET | `/website/employee/blog/` (paginated) | لیست پست‌ها |
| POST | `/website/employee/blog/` (FormData) | ایجاد پست |
| PATCH | `/website/employee/blog/{id}/` (FormData) | ویرایش |
| DELETE | `/website/employee/blog/{id}/` | حذف |

## اندپوینت‌ها — دسته‌بندی‌ها (`categories/apis`)
| متد | مسیر |
|---|---|
| GET | `/website/employee/blog/categories/` (paginated) |
| POST | `/website/employee/blog/categories/` |
| PATCH | `/website/employee/blog/categories/{id}/` |
| DELETE | `/website/employee/blog/categories/{id}/` |

(دسته‌بندی‌ها در فرم پست هم به صورت جداگانه فچ می‌شوند.)

## نکات
- پست‌ها FormData هستند (تصویر + محتوا)؛ دسته‌ها JSON.
- سمت عمومی: `useBlogPosts/useBlogPost/useBlogPostImages/useBlogCategories` در `features/website/blog` (ببین [../website.md](../website.md)).
