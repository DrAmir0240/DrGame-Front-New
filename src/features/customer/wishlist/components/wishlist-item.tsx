"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Package, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WishlistItem } from "../types";
import { useRemoveFromWishlist } from "../apis";

interface Props {
  item: WishlistItem;
}

export function WishlistItemCard({ item }: Props) {
  const removeMutation = useRemoveFromWishlist();

  const isProduct = item.content_type === "product" || !!item.product;
  const data = isProduct ? item.product : item.game;

  if (!data) return null;

  const href = isProduct
    ? `/store/products/${data.id}`
    : `/store/games/${data.id}`;

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeMutation.mutate(item.id);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md">
      {/* تصویر */}
      <Link href={href} className="relative aspect-[4/3] bg-gray-50">
        {data.main_img ? (
          <Image
            src={data.main_img}
            alt={data.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            {isProduct ? (
              <Package className="h-12 w-12" />
            ) : (
              <Gamepad2 className="h-12 w-12" />
            )}
          </div>
        )}

        {/* بج نوع */}
        <span
          className={cn(
            "absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm",
            isProduct
              ? "bg-violet-500/90 text-white"
              : "bg-blue-500/90 text-white"
          )}
        >
          {isProduct ? "محصول" : "بازی"}
        </span>

        {/* دکمه حذف */}
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={handleRemove}
          disabled={removeMutation.isPending}
          className="absolute left-3 top-3 h-9 w-9 rounded-full bg-white/90 text-rose-500 opacity-0 shadow-sm backdrop-blur-sm transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </Link>

      {/* اطلاعات */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={href}>
          <h3 className="line-clamp-2 text-sm font-medium text-gray-900 transition group-hover:text-primary">
            {data.title}
          </h3>
        </Link>

        {"price" in data && data.price != null && (
          <p className="mt-2 text-base font-bold text-gray-900">
            {data.price.toLocaleString("fa-IR")}
            <span className="mr-1 text-xs font-normal text-gray-500">
              تومان
            </span>
          </p>
        )}

        {"stock" in data && (
          <p
            className={cn(
              "mt-1 text-xs",
              data.stock > 0 ? "text-emerald-600" : "text-rose-500"
            )}
          >
            {data.stock > 0 ? `موجود (${data.stock})` : "ناموجود"}
          </p>
        )}

        <div className="mt-auto pt-4">
          <Button
            href={href}
            variant="outline"
            size="sm"
            className="w-full rounded-xl"
          >
            مشاهده
          </Button>
        </div>
      </div>
    </div>
  );
}