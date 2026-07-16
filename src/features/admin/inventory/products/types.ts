export interface Product {
  id: number;
  title: string;
  main_img: string | null;
  description: string;
  category: number;
  price: string;
  stock: number;
  min_stock: number;
  supplier: number[];
  units_sold: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface ProductFormData {
  title: string;
  main_img: File | string | null;
  description: string;
  category: number | null;
  price: string;
  min_stock: string;
  supplier: number[];
}

export interface ProductEntity {
  id: number;
  uni_id: string;
  product: number;
  color: string;
  main_img: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface EntityFormData {
  uni_id: string;
  color: string;
  product: number;
  main_img: File | string | null;
}

export interface ProductImage {
  id: number;
  img: string;
  product: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface ProductStats {
  total_inventory_value: number;
  green_count: number;
  yellow_count: number;
  red_count: number;
}

export interface ProductChoices {
  suppliers: { id: number; name: string }[];
  categories: { id: number; title: string }[];
}

export function getStockStatus(stock: number, minStock: number) {
  if (stock === 0)
    return { label: "اتمام موجودی", color: "bg-red-100 text-red-700 border-red-200" };
  if (stock <= minStock)
    return { label: "رو به اتمام", color: "bg-amber-100 text-amber-700 border-amber-200" };
  return { label: "موجود", color: "bg-emerald-100 text-emerald-700 border-emerald-200" };
}
