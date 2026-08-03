"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WishlistEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
        <Heart className="h-10 w-10 text-rose-400" />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-gray-900">
        لیست علاقه‌مندی‌ها خالی است
      </h3>
      <p className="mt-2 max-w-xs text-sm text-gray-500">
        محصولات و بازی‌های مورد علاقه‌ات را اضافه کن تا بعداً راحت پیداشون کنی
      </p>

      <Button href="/store" className="mt-6 rounded-xl gap-2">
        <Heart className="h-4 w-4" />
        رفتن به فروشگاه
      </Button>
    </div>
  );
}