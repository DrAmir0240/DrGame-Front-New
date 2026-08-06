export interface Video {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  duration: string;
  priority: number;
  status: "draft" | "published" | "private";
  cover_image: string | null;
  video_file: string | null;
}