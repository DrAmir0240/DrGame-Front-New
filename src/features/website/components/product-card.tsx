"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { formatPrice } from "@/utils/format";
import type { ProductListItem } from "../types";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative bg-card border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/5"
    >
      <div className="aspect-square overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={getImageUrl(product.product_main_img)}
          alt={product.product_title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-1">
          {product.product_title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{product.title}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(Number(product.product_price))}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${product.product_stock > 0 ? "bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400" : "bg-error-50 text-error-700 dark:bg-error-900/20 dark:text-error-400"}`}>
            {product.product_stock > 0 ? "موجود" : "ناموجود"}
          </span>
        </div>
      </div>
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg">
          <ShoppingCart className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
