export interface BlogCategory {
  id: number;
  title: string;
  description?: string | null;
  created_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  body: string;
  cover_image: string | null;
  category_id: number | null;
  author_id: number | null;
  status: "draft" | "published";
  published_at: string | null;
  is_deleted: boolean;
}
