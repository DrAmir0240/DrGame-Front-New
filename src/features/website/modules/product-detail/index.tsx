"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart, Check, Minus, Plus, Package, Layers } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { getImageUrl } from "@/lib/utils";
import { formatPrice } from "@/utils/format";
import { useProductDetail, useProductImages, useAddToProductCart } from "../../apis";

export function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useProductDetail(id);
  const { data: images } = useProductImages(product?.id ?? null);
  const addToCart = useAddToProductCart();

  const productInfo = product?.product;
  const stockCount = product?.stock_count ?? (product as unknown as { product_stock?: number })?.product_stock ?? 0;

  useEffect(() => {
    setActiveImage(0);
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">محصول یافت نشد</h2>
        <Button variant="outline" onClick={() => router.push("/products")}>
          <ArrowRight className="w-4 h-4 ml-2" />
          بازگشت به فروشگاه
        </Button>
      </div>
    );
  }

  const mainImage = productInfo?.product_main_img || "";
  const productTitle = productInfo?.title || product.title;
  const productCategory = productInfo?.category_title || "";
  const productPrice = productInfo?.price || "0";
  const productDescription = productInfo?.description || "";

  const allImages: string[] = [];
  if (mainImage) allImages.push(mainImage);
  if (images) images.forEach((i) => { if (i.img) allImages.push(i.img); });

  const displayImage =
    allImages[Math.min(activeImage, allImages.length - 1)] || allImages[0] || "";

  const handleAddToCart = () => {
    addToCart
      .mutateAsync({
        storeProductId: product.id,
        color: selectedColor || undefined,
      })
      .then(() => router.push("/cart"));
  };

  return (
    <div className="container py-8">
      <button
        onClick={() => router.push("/products")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به فروشگاه
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <img
              src={getImageUrl(displayImage)}
              alt={productTitle}
              className="w-full h-full object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 bg-neutral-100 dark:bg-neutral-800 transition-colors ${
                    activeImage === i
                      ? "border-primary-500"
                      : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`${productTitle} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {productCategory && (
            <Badge variant="secondary" className="mb-3">
              {productCategory}
            </Badge>
          )}
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
            {productTitle}
          </h1>
          {product.title !== productTitle && (
            <p className="text-sm text-muted-foreground mb-4">{product.title}</p>
          )}

          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatPrice(Number(productPrice))}
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full ${stockCount > 0 ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400 border border-success-200 dark:border-success-800" : "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400 border border-error-200 dark:border-error-800"}`}>
              {stockCount > 0 ? `${stockCount} عدد در انبار` : "ناموجود"}
            </span>
          </div>

          {productDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {productDescription}
            </p>
          )}

          {product.available_colors && product.available_colors.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                <Layers className="w-4 h-4 inline ml-1" />
                رنگ انتخابی
              </label>
              <div className="flex flex-wrap gap-2">
                {product.available_colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                      selectedColor === color
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                        : "border-neutral-200 dark:border-neutral-700 text-muted-foreground hover:border-neutral-300"
                    }`}
                  >
                    {selectedColor === color && <Check className="w-3 h-3 inline ml-1" />}
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            disabled={addToCart.isPending}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            {addToCart.isPending ? "در حال افزودن..." : "افزودن به سبد خرید"}
          </Button>

          {stockCount > 0 && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Package className="w-3.5 h-3.5" />
              <span>تحویل فوری و تضمین اصالت کالا</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
