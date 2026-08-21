# admin/website-home — مدیریت محتوای سایت

## هدف
مدیریت محتوای صفحه اصلی و عمومی سایت: بنرها، سکشن‌ها/آیتم‌های سکشن و درباره ما.
مسیرها: `/admin/website/banners`, `/sections`, `/about-us`

## ساختار
```
website-home/
├── index.tsx · types.d.ts · constants.ts · apis/index.ts   (banners + sections + about-us)
├── banners/index.tsx · components/banner-form.tsx
├── sections/
│   ├── index.tsx
│   └── components/
│       ├── sections-form.tsx       # فرم سکشن
│       ├── section-items-panel.tsx # آیتم‌های هر سکشن
│       └── section-item-form.tsx
└── about-us/
    ├── index.tsx · types.d.ts · apis/index.tsx
    └── components/form-dialog..tsx
```

## اندپوینت‌ها
### بنرها (FormData)
| متد | مسیر |
|---|---|
| POST | `/website/employee/banners/` |
| PATCH | `/website/employee/banners/{id}/` |
| DELETE | `/website/employee/banners/{id}/` |

### سکشن‌ها و آیتم‌ها (JSON)
| متد | مسیر |
|---|---|
| POST | `/website/employee/sections/` |
| PATCH / DELETE | `/website/employee/sections/{id}/` |
| POST | `/website/employee/section-items/` |
| PATCH / DELETE | `/website/employee/section-items/{id}/` |

### درباره ما (FormData)
| متد | مسیر |
|---|---|
| POST | `/website/employee/about-us/` |
| PATCH | `/website/employee/about-us/{id}/` |
| DELETE | `/website/employee/about-us/{id}/` |

لیست‌های عمومی متناظر (`GET /website/banners/`, `/sections/`, `/section-items/{id}`, `/about-us/`) در `features/website/apis` هستند.

## نکات
- محتوای این بخش مستقیماً landing page را تغذیه می‌کند (`Banners`, `HomeSections`, `AboutSection`).
- بنر و درباره‌ما تصویر دارند → FormData/multipart؛ سکشن‌ها JSON.
