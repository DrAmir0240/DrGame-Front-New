"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart, HardDrive, Users, Plus, Check } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { getImageUrl } from "@/lib/utils";
import { formatNumber } from "@/utils/format";
import { useGameDetail, useGameImages, useAddToGameCart } from "../../apis";
import { useGetAuthQuery } from "@/layouts/admin-layout/apis/use-get-auth.query";

export function GameDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [activeImage, setActiveImage] = useState(0);

  const { data: game, isLoading } = useGameDetail(id);
  const { data: images } = useGameImages(id);
  const addToCart = useAddToGameCart();
  const { data: auth } = useGetAuthQuery();
  const isAuthenticated = auth?.is_authenticated === true;

  useEffect(() => {
    setActiveImage(0);
  }, [game?.id]);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-2xl" />
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

  if (!game) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">بازی یافت نشد</h2>
        <Button variant="outline" onClick={() => router.push("/games")}>
          <ArrowRight className="w-4 h-4 ml-2" />
          بازگشت به فروشگاه بازی
        </Button>
      </div>
    );
  }

  const allImages = images?.map((i) => i.img) || [];
  if (game.main_img) {
    allImages.unshift(game.main_img);
  }

  const displayImage =
    allImages[Math.min(activeImage, allImages.length - 1)] || allImages[0] || "";

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    addToCart.mutateAsync(game.id).then(() => router.push("/cart"));
  };

  return (
    <div className="container py-8">
      <button
        onClick={() => router.push("/games")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
        بازگشت به فروشگاه بازی
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <img
              src={getImageUrl(displayImage)}
              alt={game.title}
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
                    alt={`${game.title} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Badge variant="secondary" className="mb-3">
            {game.category_title}
          </Badge>
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-4">
            {game.title}
          </h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <HardDrive className="w-4 h-4" />
              <span>{formatNumber(game.volume)} GB</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{formatNumber(game.units_sold)} فروش</span>
            </div>
          </div>

          <div className="mb-6">
            <span className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full ${
              game.account_stock > 0
                ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400 border border-success-200 dark:border-success-800"
                : "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400 border border-error-200 dark:border-error-800"
            }`}>
              <Check className="w-3.5 h-3.5" />
              {game.account_stock > 0
                ? `${game.account_stock} اکانت موجود`
                : "ناموجود"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            {game.description}
          </p>

          {game.account_stock > 0 && (
            <Button
              size="lg"
              className="w-full gap-2"
              disabled={addToCart.isPending}
              onClick={handleAddToCart}
            >
              <Plus className="w-4 h-4" />
              {addToCart.isPending ? "در حال افزودن..." : "افزودن به سبد خرید"}
            </Button>
          )}

          {game.account_stock > 0 && (
            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>پس از خرید، اکانت سونی دارای این بازی برای شما فعال می‌شود</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
