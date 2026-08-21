# admin/inventory — انبار

## هدف
مدیریت کامل انبار در ۵ زیربخش: محصولات، دسته‌ها، گردش موجودی، تأمین‌کنندگان و سفارش‌های خرید.
مسیرها: `/admin/inventory`, `/products`, `/categories`, `/movements`, `/suppliers`, `/purchase-orders`

مشترک: `shared/types.ts` شامل `PaginatedResponse<T>`, `LIMIT=10`؛ بیشتر صفحات API را مستقیم در `index.tsx` صدا می‌زنند (فقط products و purchase-orders پوشه apis دارند).

## ۱) products — کاتالوگ محصول
- **اندپوینت‌ها:**
  - `GET /inventory/products/` (limit/offset/search/category/supplier)
  - `GET /inventory/products/stats/` · `GET /inventory/products/choices/`
  - `POST /inventory/products/` (FormData) · `PATCH|DELETE /inventory/products/{id}/`
  - `GET /inventory/products/{id}/stock/` → هوک `useProductStock`
  - Entities (سریال‌ها): `GET /inventory/products/{id}/entities/?limit=100` + CRUD روی `/entities/{eid}/`
  - تصاویر: `GET|POST /inventory/products/{id}/images/` + `DELETE .../images/{iid}/`
  - `GET /inventory/products/search/?search=` — جستجوی debounce برای انتخاب محصول
- کامپوننت‌ها: ProductsPage (کارت‌های آمار + فیلتر + جدول)، ProductStatsCards (ارتفاع ارزش انبار و وضعیت سبز/زرد/قرمز)، ProductDetailPage (مدیریت entities و گالری)، EntityFormDialog.
- تایپ‌ها: `Product, ProductFormData, ProductEntity, ProductImage, ProductStats, ProductChoices, getStockStatus`

## ۲) categories — دسته‌بندی‌ها
- CRUD کامل: `GET /inventory/categories/?limit&offset&search` ، `POST/PATCH` با FormData (title/description/img)، `DELETE`.
- جدول + دیالوگ فرم + جستجو.

## ۳) movements — گردش موجودی
- `GET /inventory/movements/?direction&product_title&limit&offset`
- `POST/PATCH/DELETE /inventory/movements/{id}/` — بدنه JSON `{product,direction,product_entity?}`
- بَج رنگی ورود/خروج (`MovementDirection`, `DIRECTION_MAP`).

## ۴) suppliers — تأمین‌کنندگان
- CRUD JSON: `GET /inventory/suppliers/?type&search` ، POST/PATCH/DELETE.
- فیلتر نوع حقیقی/حقوقی؛ به عنوان dropdown توسط purchase-orders هم مصرف می‌شود.

## ۵) purchase-orders — سفارش خرید
هوک‌ها (`apis/index.ts`):
- `usePurchaseOrders` → `GET /inventory/purchase-orders/`
- `usePurchaseOrderDetail` → `GET .../{id}/`
- `useCreatePurchaseOrder` → `POST .../`
- `useUpdatePurchaseOrder` → `PATCH .../{id}/` (مثل `{status:"confirmed"}`)
- `useDeletePurchaseOrder` · `useReceivePurchaseOrder` → `POST .../{id}/receive/` (افزایش موجودی)

چرخه وضعیت: `draft → confirmed → received` (دکمه‌ها بر اساس وضعیت disable می‌شوند).
کامپوننت کلیدی: `CreatePurchaseOrderDialog` با react-hook-form + `useFieldArray` برای ردیف‌ها و ProductPicker با جستجوی debounce.

## نکات کلی
- آپلود تصویر محصول/دسته/entity همیشه multipart FormData است.
- تغییر فیلتر یا جستجو صفحه را ریست می‌کند؛ حذف‌ها ConfirmModal دارند.
