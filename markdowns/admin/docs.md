# admin/docs — اسناد و اموال

## هدف
مدیریت دو بخش: ۱) **اسناد/فایل‌ها** با تاکسونومی دسته و زیردسته ۲) **اموال واقعی (Real Assets)** با تصویر، قیمت و کارمند مسئول.
مسیر: `/admin/docs`

## ساختار
```
docs/
├── index.tsx                  # DocsPage — تب documents / real-assets
├── types.d.ts · constants.ts · apis/index.ts
└── components/
    ├── DocumentSection.tsx        # سایدبار درخت دسته + جدول paginated
    ├── CategoryTree.tsx           # ناوبری دسته/زیردسته
    ├── DocumentFormDialog.tsx     # آپلود/ویرایش سند (multipart)
    ├── CategoryFormDialog.tsx · SubCategoryFormDialog.tsx
    ├── RealAssetsSection.tsx      # همان پترن برای اموال
    └── RealAssetFormDialog.tsx    # فرم اموال (تصویر، قیمت، کارمند)
```

## اندپوینت‌ها — اسناد
| متد | مسیر | هوک |
|---|---|---|
| GET | `/docs/categories/` | `useDocCategories` |
| POST | `/docs/categories/create/` | `useCreateDocCategory` |
| GET | `/docs/sub-categories/?category=` | `useDocSubCategories` |
| POST | `/docs/sub-categories/create/` | `useCreateDocSubCategory` |
| GET | `/docs/` (paginated) | `useDocumentList` |
| GET | `/docs/{id}/` | `useDocumentDetail` |
| POST | `/docs/create/` (FormData) | `useCreateDocument` |
| PATCH | `/docs/{id}/` (FormData) | `useUpdateDocument` |
| DELETE | `/docs/{id}/` | `useDeleteDocument` |

## اندپوینت‌ها — اموال
همان الگو روی پیشوند `/real-assets/`: `categories/`, `categories/create/`, `sub-categories/?category=`, `sub-categories/create/`, لیست paginated، detail، create/update/delete با FormData.
+ `GET /hr/employees/` فقط برای dropdown انتخاب کارمند (`useEmployeeList`، خروجی `.results`).

## تایپ‌ها
`DocCategory, DocSubCategory, Document, RealAssets*, *FormData, DocFilters, RealAssetsFilters, PaginatedResponse<T>`

## نکات
- پیجینیشن LIMIT=10 با کامپوننت Pagination مشترک؛ حذف‌ها با ConfirmModal.
- تغییر دسته/زیردسته/جستجو صفحه را به 0 برمی‌گرداند؛ فیلترهای خالی ارسال نمی‌شوند.
