"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import type {
  Banner,
  Section,
  SectionItem,
  AboutUs,
  ProductListItem,
  ProductDetail,
  ProductImage,
  GameListItem,
  GameDetail,
  GameImage,
  ProductCart,
  ProductCartItem,
  GameCart,
  MatchedAccount,
  CartVolume,
} from "../types";

function extractArray<T>(responseData: unknown): T[] {
  if (Array.isArray(responseData)) return responseData;
  if (responseData && typeof responseData === "object" && "results" in responseData) {
    return (responseData as { results: T[] }).results;
  }
  return [];
}

export async function fetchBanners(): Promise<Banner[]> {
  const { data } = await api.get("/website/banners/");
  return extractArray<Banner>(data);
}

export async function fetchSections(): Promise<Section[]> {
  const { data } = await api.get("/website/sections/");
  return extractArray<Section>(data);
}

export async function fetchSectionItems(section_id: number): Promise<SectionItem[]> {
  const { data } = await api.get(`/website/section-items/${section_id}`);
  return extractArray<SectionItem>(data);
}

export async function fetchAboutUs(): Promise<AboutUs[]> {
  const { data } = await api.get("/website/about-us/");
  return extractArray<AboutUs>(data);
}

export async function fetchProducts(params?: {
  product__category?: number;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}): Promise<ProductListItem[]> {
  const { data } = await api.get("/website/products/", { params });
  return extractArray<ProductListItem>(data);
}

export async function fetchProductDetail(id: number): Promise<ProductDetail> {
  const { data } = await api.get(`/website/products/${id}/`);
  return data;
}

export async function fetchProductImages(storeProductId: number): Promise<ProductImage[]> {
  const { data } = await api.get("/website/products/images/", {
    params: { store_product_id: storeProductId },
  });
  return extractArray<ProductImage>(data);
}

export async function fetchGames(params?: {
  category?: number;
  min_volume?: number;
  max_volume?: number;
}): Promise<GameListItem[]> {
  const { data } = await api.get("/website/games/", { params });
  return extractArray<GameListItem>(data);
}

export async function fetchGameDetail(id: number): Promise<GameDetail> {
  const { data } = await api.get(`/website/games/${id}/`);
  return data;
}

export async function fetchGameImages(gameId: number): Promise<GameImage[]> {
  const { data } = await api.get("/website/games/images/", {
    params: { game_id: gameId },
  });
  return extractArray<GameImage>(data);
}

export async function fetchProductCart(): Promise<ProductCart> {
  const { data } = await api.get("/website/cart/product/");
  return data;
}

export async function fetchProductCartItems(): Promise<ProductCartItem[]> {
  const { data } = await api.get("/website/cart/product/items/");
  return extractArray<ProductCartItem>(data);
}

export async function addToProductCart(storeProductId: number, color?: string) {
  const { data } = await api.post("/website/cart/product/add/", {
    store_product_id: storeProductId,
    color,
  });
  return data;
}

export async function removeFromProductCart(storeProductId: number) {
  await api.delete("/website/cart/product/remove/", {
    params: { store_product_id: storeProductId },
  });
}

export async function fetchGameCart(): Promise<GameCart> {
  const { data } = await api.get("/website/cart/game/");
  return data;
}

export async function fetchMatchedAccounts(): Promise<MatchedAccount[]> {
  const { data } = await api.get("/website/cart/game/matched-accounts/");
  return extractArray<MatchedAccount>(data);
}

export async function fetchCartVolume(): Promise<CartVolume> {
  const { data } = await api.get("/website/cart/game/volume/");
  return data;
}

export async function addToGameCart(gameId: number) {
  const { data } = await api.post("/website/cart/game/add/", {
    game_id: gameId,
  });
  return data;
}

export async function removeFromGameCart(gameId: number) {
  await api.delete("/website/cart/game/remove/", {
    params: { game_id: gameId },
  });
}

// ─── Hooks ───

export function useBanners() {
  return useQuery({
    queryKey: ["website", "banners"],
    queryFn: fetchBanners,
  });
}

export function useSections() {
  return useQuery({
    queryKey: ["website", "sections"],
    queryFn: fetchSections,
  });
}

export function useSectionItems(sectionId: number | null) {
  return useQuery({
    queryKey: ["website", "section-items", sectionId],
    queryFn: () => fetchSectionItems(sectionId!),
    enabled: !!sectionId,
  });
}

export function useAboutUs() {
  return useQuery({
    queryKey: ["website", "about-us"],
    queryFn: fetchAboutUs,
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
    queryFn: () => fetchProducts(params),
  });
}

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: ["website", "product", id],
    queryFn: () => fetchProductDetail(id),
    enabled: !!id,
  });
}

export function useProductImages(storeProductId: number | null) {
  return useQuery({
    queryKey: ["website", "product-images", storeProductId],
    queryFn: () => fetchProductImages(storeProductId!),
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
    queryFn: () => fetchGames(params),
  });
}

export function useGameDetail(id: number) {
  return useQuery({
    queryKey: ["website", "game", id],
    queryFn: () => fetchGameDetail(id),
    enabled: !!id,
  });
}

export function useGameImages(gameId: number | null) {
  return useQuery({
    queryKey: ["website", "game-images", gameId],
    queryFn: () => fetchGameImages(gameId!),
    enabled: !!gameId,
  });
}

export function useProductCart() {
  return useQuery({
    queryKey: ["website", "cart", "product"],
    queryFn: fetchProductCart,
  });
}

export function useGameCart() {
  return useQuery({
    queryKey: ["website", "cart", "game"],
    queryFn: fetchGameCart,
  });
}

export function useMatchedAccounts() {
  return useQuery({
    queryKey: ["website", "cart", "game", "matched-accounts"],
    queryFn: fetchMatchedAccounts,
  });
}

export function useCartVolume() {
  return useQuery({
    queryKey: ["website", "cart", "game", "volume"],
    queryFn: fetchCartVolume,
  });
}

export function useAddToProductCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ storeProductId, color }: { storeProductId: number; color?: string }) =>
      addToProductCart(storeProductId, color),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "product"] });
    },
  });
}

export function useRemoveFromProductCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (storeProductId: number) => removeFromProductCart(storeProductId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "product"] });
    },
  });
}

export function useAddToGameCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gameId: number) => addToGameCart(gameId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "game"] });
    },
  });
}

export function useRemoveFromGameCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (gameId: number) => removeFromGameCart(gameId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["website", "cart", "game"] });
    },
  });
}
