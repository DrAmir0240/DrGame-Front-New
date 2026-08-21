# website — فروشگاه عمومی (محصولات، بازی‌ها، سبد خرید، بلاگ، ویدیوها)

## هدف
تمام صفحات عمومی فروشگاه: لیست/جزئیات محصولات و بازی‌های دیجیتال، سبد خرید (کالا + بازی)، بلاگ و ویدیوها.

## ساختار
```
website/
├── apis/index.ts          # همه فچرها و هوک‌های اصلی (banners, products, games, cart)
├── types.ts               # تایپ‌های مشترک
├── blog/                  # بلاگ عمومی
│   ├── apis/index.tsx     # useBlogPosts, useBlogPost, useBlogPostImages, useBlogCategories
│   └── details/index.tsx  # BlogDetailView
├── videos/
│   └── apis/index.tsx     # GET /website/videos/
├── components/            # کامپوننت‌های مشترک سایت
└── modules/
    ├── products/  product-detail/
    ├── games/     game-detail/
    ├── cart/              # CartPage
    └── about-us/
```

## اندپوینت‌ها

### محتوا و فروشگاه
| متد | مسیر | هوک/تابع |
|---|---|---|
| GET | `/website/banners/` | `useBanners` |
| GET | `/website/sections/` | `useSections` |
| GET | `/website/section-items/{section_id}` | `useSectionItems` |
| GET | `/website/about-us/` | `useAboutUs` |
| GET | `/website/products/?product__category&min_price&max_price&in_stock` | `useProducts` |
| GET | `/website/products/{id}/` | `useProductDetail` |
| GET | `/website/products/{id}/images/` | `useProductImages` |
| GET | `/website/games/?category&min_volume&max_volume` | `useGames` |
| GET | `/website/games/{id}/` | `useGameDetail` |
| GET | `/website/games/{id}/images/` | `useGameImages` |

### سبد خرید کالا
| متد | مسیر | هوک |
|---|---|---|
| GET | `/website/cart/product/` | `useProductCart` 🔒 |
| GET | `/website/cart/product/items/` | `fetchProductCartItems` 🔒 |
| POST | `/website/cart/product/add/` `{store_product_id,color?}` | `useAddToProductCart` |
| DELETE | `/website/cart/product/remove/?store_product_id=` | `useRemoveFromProductCart` |

### سبد خرید بازی
| متد | مسیر | هوک |
|---|---|---|
| GET | `/website/cart/game/` | `useGameCart` 🔒 |
| GET | `/website/cart/game/matched-accounts/` | `useMatchedAccounts` 🔒 |
| GET | `/website/cart/game/volume/` | `useCartVolume` 🔒 |
| POST | `/website/cart/game/add/` `{game_id}` | `useAddToGameCart` |
| DELETE | `/website/cart/game/remove/?game_id=` | `useRemoveFromGameCart` |

### بلاگ و ویدیو
| متد | مسیر | هوک |
|---|---|---|
| GET | `/website/blog/categories/` | `useBlogCategories` |
| GET | `/website/blog/` (paginated) | `useBlogPosts` |
| GET | `/website/blog/{id}/` | `useBlogPost` |
| GET | `/website/blog/{id}/images/` | `useBlogPostImages` |
| GET | `/website/videos/` (paginated) | هوک ویدیوها |

🔒 = فقط برای کاربر لاگین‌شده (شرح در بخش «گیت احراز هویت»).

## گیت احراز هویت سبد خرید
- هلپر داخلی: `useIsAuthenticated()` بر پایه `useGetAuthQuery` (`auth?.is_authenticated === true`).
- هر ۴ کوئری cart با `enabled: isAuthenticated` قفل شده‌اند → کاربر مهمان **هیچ درخواستی به اندپوینت‌های cart نمی‌فرستد**.
- در صفحات جزئیات محصول/بازی (`modules/product-detail`, `modules/game-detail`)، هندلر افزودن به سبد ابتدا چک می‌کند:
  ```ts
  if (!isAuthenticated) { router.push("/login"); return; }
  ```
- mutationها بعد از موفقیت، کوئری سبد مربوطه را invalidate می‌کنند؛ کلیدها: `["website","cart","product"]` و `["website","cart","game"]`.

## پترن‌های مهم
- **extractArray:** پاسخ‌های paginated یا آرایه خام را یکدست می‌کند (`results` یا آرایه). همه لیست‌ها از آن عبور می‌کنند.
- **BlogDetailView:** تصاویر پست با `[...Array.isArray(images)?images:[]].sort((a,b)=>a.priority-b.priority)` مرتب می‌شوند (مقاوم به پاسخ غیرآرایه‌ای).
- مصرف‌کنندگان cart: `components/layout/header.tsx` (بَج تعداد)، `modules/cart` (صفحه سبد)، دو صفحه جزئیات.
- تایپ‌های کلیدی: `ProductCart/ProductCartItem`, `GameCart/GameCartItem`, `MatchedAccount`, `CartVolume`, `ProductDetail/GameDetail`, `Banner/Section/SectionItem`, `BlogPost/BlogPostImage`, `Video`.
