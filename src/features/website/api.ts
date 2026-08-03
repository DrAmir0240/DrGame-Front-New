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
} from "./types";

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
