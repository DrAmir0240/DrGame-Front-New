export interface Banner {
  id: number;
  title: string;
  image: string | null;
  is_chosen: boolean;
  order: number;
}

export interface Section {
  id: number;
  title: string;
  model_content: "game" | "product" | "blog";
  is_deleted?: boolean;
}

export interface SectionItem {
  id: number;
  section_id: number;
  item_id: number;
  is_active: boolean;
  // فیلدهای نمایشی اختیاری
  item_title?: string;
  item_image?: string | null;
}

export interface AboutUs {
  id: number;
  title: string;
  logo: string | null;
  phone_number: string;
  email: string;
  address: string;
  e_namaad: string | null;
  e_namaad_url: string;
  is_active: boolean;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}