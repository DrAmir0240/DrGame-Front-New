"use client";

import { Trash2, ShoppingBag, Gamepad2, ArrowLeft, Minus, Plus, HardDrive, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton/skeleton";
import { getImageUrl } from "@/lib/utils";
import { formatPrice, formatNumber } from "@/utils/format";
import { useProductCart, useGameCart, useRemoveFromProductCart, useRemoveFromGameCart } from "./hooks";

export function CartPage() {
  const { data: productCart, isLoading: loadingProduct } = useProductCart();
  const { data: gameCart, isLoading: loadingGame } = useGameCart();
  const removeProduct = useRemoveFromProductCart();
  const removeGame = useRemoveFromGameCart();

  const isLoading = loadingProduct || loadingGame;

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const hasProductItems = productCart && productCart.items.length > 0;
  const hasGameItems = gameCart && gameCart.games.length > 0;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-1.5 mb-4">
          <span className="text-xs text-primary-600 dark:text-primary-300">سبد خرید</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">
          سبد <span className="text-primary-500">خرید</span>
        </h1>
      </div>

      {!hasProductItems && !hasGameItems ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">سبد خرید خالی است</h2>
          <p className="text-sm text-muted-foreground mb-6">
            محصولات و بازی‌های مورد نظر خود را به سبد خرید اضافه کنید
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" href="/products">
              فروشگاه کالا
            </Button>
            <Button href="/games">
              فروشگاه بازی
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {hasProductItems && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="w-5 h-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-foreground">
                    کالاها ({productCart!.item_count})
                  </h2>
                </div>
                <div className="space-y-3">
                  {productCart!.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                        <img
                          src={getImageUrl(item.product_main_img)}
                          alt={item.product_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground truncate">
                          {item.product_title}
                        </h3>
                        <p className="text-xs text-muted-foreground">{item.store_product_title}</p>
                        {item.color && (
                          <span className="text-xs text-muted-foreground">رنگ: {item.color}</span>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                            {formatPrice(item.unit_price)}
                          </span>
                          <span className="text-xs text-muted-foreground">× {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold text-foreground">
                          {formatPrice(item.total_item_price)}
                        </div>
                        <button
                          onClick={() => removeProduct.mutate(item.store_product_id)}
                          className="text-xs text-error-500 hover:text-error-600 flex items-center gap-1 mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasGameItems && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Gamepad2 className="w-5 h-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-foreground">
                    بازی‌ها ({gameCart!.games.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {gameCart!.games.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center gap-4 bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-4"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                        <img
                          src={getImageUrl(game.game_main_img)}
                          alt={game.game_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground truncate">
                          {game.game_title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{formatNumber(game.game_volume)} GB</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeGame.mutate(game.game_id)}
                        className="text-xs text-error-500 hover:text-error-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        حذف
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {productCart && productCart.items.length > 0 && (
              <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4">خلاصه سبد کالا</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>تعداد کالا</span>
                    <span>{productCart.item_count}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>تعداد آیتم</span>
                    <span>{productCart.items.reduce((a, i) => a + i.quantity, 0)}</span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>جمع کل</span>
                      <span className="text-primary-600 dark:text-primary-400">
                        {formatPrice(productCart.total_price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameCart && gameCart.games.length > 0 && (
              <div className="bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl p-6">
                <h3 className="font-bold text-foreground mb-4">خلاصه سبد بازی</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>تعداد بازی</span>
                    <span>{gameCart.games.length}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>حجم کل</span>
                    <span>{formatNumber(gameCart.total_volume)} GB</span>
                  </div>
                  <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 mt-2">
                    <div className="flex justify-between font-bold text-foreground">
                      <span>وضعیت حجم</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        gameCart.volume_flag === "< 500GB"
                          ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                          : gameCart.volume_flag === "> 1TB"
                          ? "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400"
                          : "bg-warning-50 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400"
                      }`}>
                        {gameCart.volume_flag}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button variant="outline" href="/products" className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              ادامه خرید
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
