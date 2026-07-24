export interface DocCategory {
  id: number;
  title: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocSubCategory {
  id: number;
  title: string;
  description: string;
  category: number;
  category_title: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  title: string;
  file: string;
  category: number;
  sub_category_title: string;
  main_category_id: number;
  main_category_title: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface RealAssetsCategory {
  id: number;
  title: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface RealAssetsSubCategory {
  id: number;
  title: string;
  description: string;
  category: number;
  category_title: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface RealAssets {
  id: number;
  title: string;
  image: string | null;
  category: number;
  sub_category_title: string;
  main_category_id: number;
  main_category_title: string;
  price: number | null;
  employee: number | null;
  employee_name: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface DocCategoryFormData {
  title: string;
  description?: string;
}

export interface DocSubCategoryFormData {
  title: string;
  description?: string;
  category: number;
}

export interface DocumentFormData {
  title: string;
  file: File;
  category: number;
}

export interface RealAssetsCategoryFormData {
  title: string;
  description?: string;
}

export interface RealAssetsSubCategoryFormData {
  title: string;
  description?: string;
  category: number;
}

export interface RealAssetsFormData {
  title: string;
  image?: File;
  category: number;
  employee?: number | null;
  price?: number | null;
}

export interface DocFilters {
  search?: string;
  category?: number | null;
  sub_category?: number | null;
  limit?: number;
  offset?: number;
}

export interface RealAssetsFilters {
  search?: string;
  category?: number | null;
  sub_category?: number | null;
  min_price?: number | null;
  max_price?: number | null;
  employee?: number | null;
  limit?: number;
  offset?: number;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
}
