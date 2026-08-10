export interface BlogCategory {
  id: number;
  title: string;
  description?: string | null;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  body: string;
  cover_image: string | null;
  category_id: number | null;
  category_title: string | null;
  author_id: number | null;
  author_name: string | null;
  status: "draft" | "published";
  published_at: string | null;
}

export interface BlogPostImage {
  id: number;
  image: string;
  blog: number;
  priority: number;
  created_at: string;
}
