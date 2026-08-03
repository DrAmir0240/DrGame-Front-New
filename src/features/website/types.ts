export interface Banner {
  id: number;
  title: string;
  image: string;
  order: number;
}

export interface Section {
  id: number;
  title: string;
  model_content: "game" | "product" | "blog";
}

export interface SectionItem {
  item_id: number;
  item_title: string;
  item_description: string;
  item_image: string;
  item_type: string;
}

export interface AboutUs {
  id: number;
  title: string;
  logo: string;
  phone_number: string;
  email: string;
  address: string;
  e_namaad: string;
  e_namaad_url: string;
}

export interface ProductSearchResult {
  id: number;
  title: string;
  product_id: number;
  product_title: string;
  product_main_img: string;
}

export interface ProductListItem {
  id: number;
  title: string;
  product_id: number;
  product_title: string;
  product_main_img: string;
  product_price: string;
  product_stock: number;
}

export interface ProductDetail {
  id: number;
  title: string;
  product: {
    id: number;
    title: string;
   product_main_img: string;
    description: string;
    price: string;
    category_id: number;
    category_title: string;
  };
  stock_count: number;
  available_colors: string[];
}

export interface ProductImage {
  id: number;
  img: string;
  product_id: number;
}

export interface GameSearchResult {
  id: number;
  title: string;
  main_img: string;
  category_id: number;
  category_title: string;
}

export interface GameListItem {
  id: number;
  title: string;
  main_img: string;
  description: string;
  volume: number;
  units_sold: number;
  category_id: number;
  category_title: string;
}

export interface GameDetail {
  id: number;
  title: string;
  main_img: string;
  description: string;
  volume: number;
  units_sold: number;
  category_id: number;
  category_title: string;
  account_stock: number;
}

export interface GameImage {
  id: number;
  img: string;
  game_id: number;
}

export interface ProductCartItem {
  id: number;
  product_id: number;
  store_product_id: number;
  store_product_title: string;
  product_title: string;
  product_main_img: string;
  unit_price: number;
  quantity: number;
  total_item_price: number;
  color: string;
}

export interface ProductCart {
  id: string;
  created_at: string;
  items: ProductCartItem[];
  total_price: number;
  item_count: number;
}

export interface GameCartItem {
  id: number;
  game_id: number;
  game_title: string;
  game_main_img: string;
  game_volume: number;
}

export interface GameCart {
  id: number;
  created_at: string;
  games: GameCartItem[];
  total_volume: number;
  volume_flag: string;
}

export interface MatchedAccount {
  id: number;
  username: string;
  price: number;
  plus: boolean;
  region: string;
  status_id: number;
  status_title: string;
  match_count: number;
}

export interface CartVolume {
  total_volume: number;
  volume_flag: string;
}
