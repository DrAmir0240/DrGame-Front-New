export interface StoreProduct {
  id: number;
  title: string;
  product_id: number;
  product_title: string;
  product_main_img: string | null;
  product_price: string;
  product_stock: number;
  is_deleted: boolean;
}

export interface StoreProductCategory {
  id: number;
  title: string;
}

export interface StoreGame {
  id: number;
  title: string | null;
  main_img: string | null;
  description: string | null;
  volume: number | null;
  units_sold: number;
  category_id: number;
  is_deleted: boolean;
}

export interface GameCategory {
  id: number;
  title: string;
  description: string;
  is_deleted: boolean;
}
