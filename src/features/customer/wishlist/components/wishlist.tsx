"use client";

import { Loader2 } from "lucide-react";

import type { WishlistItem } from "../types";
import { WishlistEmptyState } from "./wishlist-empty";
import { WishlistItemCard } from "./wishlist-item";

interface Props {
  items: WishlistItem[];
  isLoading?: boolean;
}

export function WishlistList({ items, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!items.length) {
    return <WishlistEmptyState />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <WishlistItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}