export interface BlogCategory {
  id: number;
  title: string;
  description?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  cover_image: string | null;
  category_id: number;
  category_title: string;
  author_id: number;
  author_name: string;
  published_at: string;
  body?: string;
}

export interface BlogPostImage {
  id: number;
  image: string;
  priority: number;
  post_id: number;
}