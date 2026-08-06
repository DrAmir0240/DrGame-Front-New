export interface Video {
  id: number;
  title: string;
  slug?: string;
  description?: string | null;
  video_url: string;          
  cover_image: string | null;
  is_active: boolean;
  order?: number;
  created_at?: string;
}