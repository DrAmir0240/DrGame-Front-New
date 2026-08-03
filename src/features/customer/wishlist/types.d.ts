// src/features/customer/wishlist/types.ts
export interface WishlistProduct {
  id: number;
  title: string;
  main_img: string | null;
  price: number;
  stock: number;
  category_title?: string;
}

export interface WishlistGame {
  id: number;
  title: string;
  main_img?: string | null;
  price?: number;
}

export interface WishlistItem {
  id: number;
  content_type: "product" | "game" | string;
  object_id: number;
  product?: WishlistProduct | null;
  game?: WishlistGame | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}