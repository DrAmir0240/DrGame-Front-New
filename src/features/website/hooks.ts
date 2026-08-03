"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./api";
import type {
  ProductListItem,
  GameListItem,
} from "./types";

export function useBanners() {
  return useQuery({
    queryKey: ["website", "banners"],
    queryFn: api.fetchBanners,
  });
}

export function useSections() {
  return useQuery({
    queryKey: ["website", "sections"],
    queryFn: api.fetchSections,
  });
}

export function useSectionItems(sectionId: number | null) {
  return useQuery({
    queryKey: ["website", "section-items", sectionId],
    queryFn: () => api.fetchSectionItems(sectionId!),
    enabled: !!sectionId,
  });
}

export function useAboutUs() {
  return useQuery({
    queryKey: ["website", "about-us"],
    queryFn: api.fetchAboutUs,
  });
}

export function useProducts(params?: {
  product__category?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}) {
  return useQuery<ProductListItem[]>({
    queryKey: ["website", "products", params],
    queryFn: () => api.fetchProducts(params),
  });
}

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: ["website", "product", id],
    queryFn: () => api.fetchProductDetail(id),
    enabled: !!id,
  });
}

export function useProductImages(storeProductId: number | null) {
  return useQuery({
    queryKey: ["website", "product-images", storeProductId],
    queryFn: () => api.fetchProductImages(storeProductId!),
    enabled: !!storeProductId,
  });
}

export function useGames(params?: {
  category?: number;
  min_volume?: number;
  max_volume?: number;
}) {
  return useQuery<GameListItem[]>({
    queryKey: ["website", "games", params],
    queryFn: () => api.fetchGames(params),
  });
}

export function useGameDetail(id: number) {
  return useQuery({
    queryKey: ["website", "game", id],
    queryFn: () => api.fetchGameDetail(id),
    enabled: !!id,
  });
}

export function useGameImages(gameId: number | null) {
  return useQuery({
    queryKey: ["website", "game-images", gameId],
    queryFn: () => api.fetchGameImages(gameId!),
    enabled: !!gameId,
  });
}

export function useProductCart() {
  return useQuery({
    queryKey: ["website", "cart", "product"],
    queryFn: api.fetchProductCart,
  });
}

export function useGameCart() {
  return useQuery({
    queryKey: ["website", "cart", "game"],
    queryFn: api.fetchGameCart,
  });
}

export function useMatchedAccounts() {
  return useQuery({
    queryKey: ["website", "cart", "game", "matched-accounts"],
    queryFn: api.fetchMatchedAccounts,
  });
}

export function useCartVolume() {
  return useQuery({
    queryKey: ["website", "cart", "game", "volume"],
    queryFn: api.fetchCartVolume,
  });
}

export function useAddToProductCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ storeProductId, color }: { storeProductId: number; color?: string }) =>
      api.addToProductCart(storeProductId, color),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "product"] });
    },
  });
}

export function useRemoveFromProductCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (storeProductId: number) => api.removeFromProductCart(storeProductId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "product"] });
    },
  });
}

export function useAddToGameCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gameId: number) => api.addToGameCart(gameId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "game"] });
    },
  });
}

export function useRemoveFromGameCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gameId: number) => api.removeFromGameCart(gameId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "game"] });
    },
  });
}
