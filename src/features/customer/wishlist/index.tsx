"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/features/customer/wishlist/apis";
import type { WishlistItem } from "@/features/customer/wishlist/types";
import { WishlistList } from "./components/wishlist";

export default function WishlistPage() {
  const { data, isLoading } = useWishlist();

  const items: WishlistItem[] = Array.isArray(data)
    ? data
    : data?.results ?? [];

  const count = Array.isArray(data) ? data.length : data?.count ?? 0;

  return (
  <div className="space-y-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100">
              <Heart className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                علاقه‌مندی‌ها
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {isLoading
                  ? "در حال بارگذاری..."
                  : count > 0
                    ? `${count.toLocaleString("fa-IR")} مورد ذخیره شده`
                    : "هنوز موردی اضافه نکرده‌اید"}
              </p>
            </div>
          </div>
        </div>

        {/* لیست */}
        <WishlistList items={items} isLoading={isLoading} />
    </div>
  );
}