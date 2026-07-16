export interface ProductCategory {
  id: number;
  title: string;
  description: string;
  img: string | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface CategoryFormData {
  title: string;
  description: string;
  img: File | string | null;
}
