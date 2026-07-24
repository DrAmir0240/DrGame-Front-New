<div dir="rtl">

# مستندات API بخش اسناد و دارایی‌ها (Docs & Real Assets) — DrGame ERP

> Base URL: `/docs/`  
> Authentication: `CustomJWTAuthentication`  
> Permission: `IsEmployee | IsMainManager`  
> Soft Delete: تمام حذف‌ها با `is_deleted=True`  
> Pagination: Category/SubCategory ها بدون pagination — Document/RealAssets دارای pagination

---

## ۱. معماری کلی

```
Docs Module
├── اسناد (Documents)
│   ├── DocCategory (دسته‌بندی اصلی)
│   ├── DocSubCategory (زیردسته‌بندی)
│   └── Document (فایل سند)
│
└── دارایی‌های واقعی (Real Assets)
    ├── RealAssetsCategory (دسته‌بندی اصلی)
    ├── RealAssetsSubCategory (زیردسته‌بندی)
    └── RealAssets (دارایی + قیمت + تصویر + کارمند)
```

> هر دو بخش ساختار یکسانی دارند: **Category → SubCategory → Item**

---

## ۲. اندپوینت‌ها

### ۲.۱ اسناد (Documents)

| # | متد | endpoint | توضیح |
|---|-----|----------|-------|
| 1 | GET | `docs/docs/` | لیست اسناد |
| 2 | POST | `docs/docs/create/` | ایجاد سند |
| 3 | GET | `docs/docs/{pk}/` | جزئیات سند |
| 4 | PATCH | `docs/docs/{pk}/` | ویرایش سند |
| 5 | DELETE | `docs/docs/{pk}/` | حذف سند |
| 6 | GET | `docs/docs/categories/` | لیست دسته‌بندی‌ها |
| 7 | POST | `docs/docs/categories/create/` | ایجاد دسته‌بندی |
| 8 | GET | `docs/docs/sub-categories/` | لیست زیردسته‌بندی‌ها |
| 9 | POST | `docs/docs/sub-categories/create/` | ایجاد زیردسته‌بندی |

### ۲.۲ دارایی‌های واقعی (Real Assets)

| # | متد | endpoint | توضیح |
|---|-----|----------|-------|
| 10 | GET | `docs/real-assets/` | لیست دارایی‌ها |
| 11 | POST | `docs/real-assets/create/` | ایجاد دارایی |
| 12 | GET | `docs/real-assets/{pk}/` | جزئیات دارایی |
| 13 | PATCH | `docs/real-assets/{pk}/` | ویرایش دارایی |
| 14 | DELETE | `docs/real-assets/{pk}/` | حذف دارایی |
| 15 | GET | `docs/real-assets/categories/` | لیست دسته‌بندی‌ها |
| 16 | POST | `docs/real-assets/categories/create/` | ایجاد دسته‌بندی |
| 17 | GET | `docs/real-assets/sub-categories/` | لیست زیردسته‌بندی‌ها |
| 18 | POST | `docs/real-assets/sub-categories/create/` | ایجاد زیردسته‌بندی |

---

## ۳. مدل‌ها

### ۳.۱ DocCategory

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | integer | PK |
| `title` | string | عنوان — unique |
| `description` | text | توضیحات (حداکثر ۵۰۰۰ کاراکتر) |
| `is_deleted` | boolean | Soft delete |
| `created_at` | datetime | تاریخ ایجاد |
| `updated_at` | datetime | تاریخ بروزرسانی |

### ۳.۲ DocSubCategory

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | integer | PK |
| `title` | string | عنوان — unique |
| `description` | text | توضیحات (حداکثر ۵۰۰۰ کاراکتر) |
| `category` | FK → DocCategory | دسته‌بندی اصلی (قابل حذف) |
| `is_deleted` | boolean | Soft delete |
| `created_at` | datetime | تاریخ ایجاد |
| `updated_at` | datetime | تاریخ بروزرسانی |

### ۳.۳ Document

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | integer | PK |
| `title` | string | عنوان |
| `file` | file | فایل سند (آپلود در `docs/`) |
| `category` | FK → DocSubCategory | زیردسته‌بندی (قابل حذف) |
| `is_deleted` | boolean | Soft delete |
| `created_at` | datetime | تاریخ ایجاد |
| `updated_at` | datetime | تاریخ بروزرسانی |

### ۳.۴ RealAssetsCategory

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | integer | PK |
| `title` | string | عنوان — unique |
| `description` | text | توضیحات (حداکثر ۵۰۰۰ کاراکتر) |
| `is_deleted` | boolean | Soft delete |
| `created_at` | datetime | تاریخ ایجاد |
| `updated_at` | datetime | تاریخ بروزرسانی |

### ۳.۵ RealAssetsSubCategory

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | integer | PK |
| `title` | string | عنوان — unique |
| `description` | text | توضیحات (حداکثر ۵۰۰۰ کاراکتر) |
| `category` | FK → RealAssetsCategory | دسته‌بندی اصلی (قابل حذف) |
| `is_deleted` | boolean | Soft delete |
| `created_at` | datetime | تاریخ ایجاد |
| `updated_at` | datetime | تاریخ بروزرسانی |

### ۳.۶ RealAssets

| فیلد | نوع | توضیح |
|------|-----|-------|
| `id` | integer | PK |
| `title` | string | عنوان |
| `image` | file | تصویر (آپلود در `real_assets/photos/`) — اختیاری |
| `category` | FK → RealAssetsSubCategory | زیردسته‌بندی (قابل حذف) |
| `employee` | FK → Employee | کارمند مسئول (اختیاری — قابل حذف) |
| `price` | integer | قیمت (اختیاری) |
| `is_deleted` | boolean | Soft delete |
| `created_at` | datetime | تاریخ ایجاد |
| `updated_at` | datetime | تاریخ بروزرسانی |

---

## ۴. Responseها

### ۴.۱ DocCategory List

```json
[
  {
    "id": 1,
    "title": "قراردادها",
    "description": "قراردادهای شرکت"
  }
]
```

### ۴.۲ DocSubCategory List

```json
[
  {
    "id": 1,
    "title": "قراردادهای فروش",
    "description": "قراردادهای فروش محصولات",
    "category": 1,
    "category_title": "قراردادها"
  }
]
```

### ۴.۳ Document List

```json
[
  {
    "id": 1,
    "title": "قرارداد فروش شماره ۱۲",
    "file": "/media/docs/contract.pdf",
    "category": 1,
    "sub_category_title": "قراردادهای فروش",
    "main_category_id": 1,
    "main_category_title": "قراردادها",
    "created_at": "2026-07-20T10:00:00Z"
  }
]
```

### ۴.۴ RealAssetsCategory List

```json
[
  {
    "id": 1,
    "title": "تجهیزات اداری",
    "description": "تجهیزات و لوازم اداری"
  }
]
```

### ۴.۵ RealAssetsSubCategory List

```json
[
  {
    "id": 1,
    "title": "کامپیوتر",
    "description": "کامپیوتر و لوازم جانبی",
    "category": 1,
    "category_title": "تجهیزات اداری"
  }
]
```

### ۴.۶ RealAssets List

```json
[
  {
    "id": 1,
    "title": "کامپیوتر دفتر مرکزی",
    "image": "/media/real_assets/photos/pc1.jpg",
    "price": 50000000,
    "category": 1,
    "sub_category_title": "کامپیوتر",
    "main_category_id": 1,
    "main_category_title": "تجهیزات اداری",
    "created_at": "2026-07-20T10:00:00Z",
    "employee": 1,
    "employee_name": "علی محمدی"
  }
]
```

---

## ۵. Body درخواست‌ها

### ۵.۱ ایجاد DocCategory

```json
{
  "title": "قراردادها",
  "description": "قراردادهای شرکت"
}
```

| فیلد | نوع | اجباری | توضیح |
|------|-----|--------|-------|
| `title` | string | بله | عنوان — unique |
| `description` | string | خیر | توضیحات |

### ۵.۲ ایجاد DocSubCategory

```json
{
  "title": "قراردادهای فروش",
  "description": "قراردادهای فروش محصولات",
  "category": 1
}
```

| فیلد | نوع | اجباری | توضیح |
|------|-----|--------|-------|
| `title` | string | بله | عنوان — unique |
| `description` | string | خیر | توضیحات |
| `category` | integer | بله | شناسه دسته‌بندی اصلی |

### ۵.۳ ایجاد Document

```json
{
  "title": "قرارداد فروش شماره ۱۲",
  "file": <file>,
  "category": 1
}
```

| فیلد | نوع | اجباری | توضیح |
|------|-----|--------|-------|
| `title` | string | بله | عنوان |
| `file` | file | بله | فایل سند |
| `category` | integer | بله | شناسه زیردسته‌بندی |

### ۵.۴ ایجاد RealAssetsCategory

```json
{
  "title": "تجهیزات اداری",
  "description": "تجهیزات و لوازم اداری"
}
```

### ۵.۵ ایجاد RealAssetsSubCategory

```json
{
  "title": "کامپیوتر",
  "description": "کامپیوتر و لوازم جانبی",
  "category": 1
}
```

### ۵.۶ ایجاد RealAssets

```json
{
  "title": "کامپیوتر دفتر مرکزی",
  "image": <file>,
  "category": 1,
  "employee": 1,
  "price": 50000000
}
```

| فیلد | نوع | اجباری | توضیح |
|------|-----|--------|-------|
| `title` | string | بله | عنوان |
| `image` | file | خیر | تصویر |
| `category` | integer | بله | شناسه زیردسته‌بندی |
| `employee` | integer | خیر | شناسه کارمند |
| `price` | integer | خیر | قیمت |

---

## ۶. فیلترها

### ۶.۱ DocumentFilter

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `category` | integer | فیلتر بر اساس دسته‌بندی اصلی |
| `sub_category` | integer | فیلتر بر اساس زیردسته‌بندی |

> جستجو بر اساس `title` — مرتب‌سازی بر اساس `created_at`

### ۶.۲ DocumentSubCatFilter

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `category` | integer | فیلتر بر اساس دسته‌بندی اصلی |

### ۶.۳ RealAssetsFilter

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `category` | integer | فیلتر بر اساس دسته‌بندی اصلی |
| `sub_category` | integer | فیلتر بر اساس زیردسته‌بندی |
| `min_price` | integer | حداقل قیمت |
| `max_price` | integer | حداکثر قیمت |
| `employee` | integer | فیلتر بر اساس کارمند |

> جستجو بر اساس `title` — مرتب‌سازی بر اساس `created_at` و `price`

### ۶.۴ RealAssetsSubCatFilter

| پارامتر | نوع | توضیح |
|---------|-----|-------|
| `category` | integer | فیلتر بر اساس دسته‌بندی اصلی |

---

## ۷. کامپوننت‌های پیشنهادی

```
DocsModule
├── DocumentSection
│   ├── CategoryTree
│   │   ├── CategoryList (id, title)
│   │   │   └── SubCategoryList (id, title, category_title)
│   │   └── CreateCategoryButton
│   │   └── CreateSubCategoryButton
│   │
│   ├── DocumentTable
│   │   ├── FilterBar (category, sub_category)
│   │   ├── SearchBar (title)
│   │   ├── DocumentRow (id, title, file, main_category, sub_category, created_at)
│   │   │   └── DocumentDetailModal
│   │   │       ├── Title + File (download link)
│   │   │       ├── Category + SubCategory
│   │   │       └── Edit/Delete Buttons
│   │   └── CreateDocumentForm
│   │       ├── title (input)
│   │       ├── file (file upload)
│   │       ├── category (dropdown — main categories)
│   │       └── sub_category (dropdown — filtered by main category)
│
└── RealAssetsSection
    ├── CategoryTree (same as Document section)
    │
    ├── AssetsTable
    │   ├── FilterBar (category, sub_category, min_price, max_price, employee)
    │   ├── SearchBar (title)
    │   ├── SortBar (created_at, price)
    │   ├── AssetRow (id, title, image, price, category, employee_name, created_at)
    │   │   └── AssetDetailModal
    │   │       ├── Title + Image (preview)
    │   │       ├── Price + Category
    │   │       ├── Employee
    │   │       └── Edit/Delete Buttons
    │   └── CreateAssetForm
    │       ├── title (input)
    │       ├── image (file upload)
    │       ├── category (dropdown — main categories)
    │       ├── sub_category (dropdown — filtered by main category)
    │       ├── employee (dropdown — optional)
    │       └── price (number input — optional)
```

---

## ۸. جریان داده (Data Flow)

### ۸.۱ بارگذاری اسناد

```
1. GET /docs/docs/categories/
   → [DocCategorySerializer] — بدون pagination

2. GET /docs/docs/sub-categories/?category=1
   → [DocSubCategorySerializer] — فیلتر بر اساس category اصلی

3. GET /docs/docs/?category=1&sub_category=2
   → [DocumentSerializer] — فیلتر + جستجو + مرتب‌سازی
```

### ۸.۲ بارگذاری دارایی‌ها

```
1. GET /docs/real-assets/categories/
   → [RealAssetsCategorySerializer]

2. GET /docs/real-assets/sub-categories/?category=1
   → [RealAssetsSubCategorySerializer]

3. GET /docs/real-assets/?category=1&min_price=1000000&max_price=50000000
   → [RealAssetsSerializer] — فیلتر + جستجو + مرتب‌سازی
```

### ۸.۳ ایجاد آیتم

```
POST /docs/docs/create/
   → {title, file, category (sub_category_id)}
   → DocumentSerializer response

POST /docs/real-assets/create/
   → {title, image, category (sub_category_id), employee, price}
   → RealAssetsSerializer response
```

---

## ۹. نکات مهم پیاده‌سازی

### ۹.۱ Category → SubCategory → Item

ساختار سلسله‌مراتبی:
- **Category** = دسته‌بندی اصلی (مثلاً "قراردادها")
- **SubCategory** = زیردسته‌بندی (مثلاً "قراردادهای فروش")
- **Item** = سند یا دارایی که به SubCategory وصل است

### ۹.۲ فیلتر دو سطحی

در Document و RealAssets، فیلتر `category` بر اساس **دسته‌بندی اصلی** و فیلتر `sub_category` بر اساس **زیردسته‌بندی** است.

### ۹.۳ Pagination

- Category و SubCategory: **بدون pagination** (`pagination_class = None`)
- Document و RealAssets: **با pagination** (پیش‌فرض DRF)

### ۹.۴ File Upload

- Documents: فایل در `docs/` آپلود می‌شود
- RealAssets: تصویر در `real_assets/photos/` آپلود می‌شود

### ۹.۵ FK Deletable

فیلدهای FK مانند `category` و `employee` دارای `on_delete=SET_NULL` هستند — اگر رکورد مرجع حذف شود، فیلد `null` می‌شود.

### ۹.۶ Read-Only Fields

- `sub_category_title`: خودکار از `category.title`
- `main_category_id`: خودکار از `category.category.id`
- `main_category_title`: خودکار از `category.category.title`
- `employee_name`: خودکار از `employee.first_name + last_name`

---

## ۱۰. خلاصه تمام اندپوینت‌ها

| # | Method | URL | توضیح |
|---|--------|-----|-------|
| 1 | GET | `docs/docs/` | لیست اسناد |
| 2 | POST | `docs/docs/create/` | ایجاد سند |
| 3 | GET | `docs/docs/{pk}/` | جزئیات سند |
| 4 | PATCH | `docs/docs/{pk}/` | ویرایش سند |
| 5 | DELETE | `docs/docs/{pk}/` | حذف سند |
| 6 | GET | `docs/docs/categories/` | لیست دسته‌بندی‌ها |
| 7 | POST | `docs/docs/categories/create/` | ایجاد دسته‌بندی |
| 8 | GET | `docs/docs/sub-categories/` | لیست زیردسته‌بندی‌ها |
| 9 | POST | `docs/docs/sub-categories/create/` | ایجاد زیردسته‌بندی |
| 10 | GET | `docs/real-assets/` | لیست دارایی‌ها |
| 11 | POST | `docs/real-assets/create/` | ایجاد دارایی |
| 12 | GET | `docs/real-assets/{pk}/` | جزئیات دارایی |
| 13 | PATCH | `docs/real-assets/{pk}/` | ویرایش دارایی |
| 14 | DELETE | `docs/real-assets/{pk}/` | حذف دارایی |
| 15 | GET | `docs/real-assets/categories/` | لیست دسته‌بندی‌ها |
| 16 | POST | `docs/real-assets/categories/create/` | ایجاد دسته‌بندی |
| 17 | GET | `docs/real-assets/sub-categories/` | لیست زیردسته‌بندی‌ها |
| 18 | POST | `docs/real-assets/sub-categories/create/` | ایجاد زیردسته‌بندی |

</div>
