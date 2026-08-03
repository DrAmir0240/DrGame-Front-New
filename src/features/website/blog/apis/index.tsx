import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import type { BlogCategory, BlogPost, BlogPostImage } from "../types";

function buildParams(filters?: Record<string, unknown>) {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      value !== "all"
    ) {
      params[key] = String(value);
    }
  }
  return params;
}

export function useBlogCategories() {
  return useQuery<BlogCategory[]>({
    queryKey: ["website", "blog", "categories"],
    queryFn: async () => {
      const { data } = await api.get<BlogCategory[]>(
        "/website/blog/categories/"
      );
      return data;
    },
  });
}

export function useBlogPosts(filters?: {
  category?: number | string;
  author?: number | string;
}) {
  return useQuery<BlogPost[]>({
    queryKey: ["website", "blog", "posts", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<BlogPost[]>("/website/blog/", {
        params,
      });
      return data;
    },
  });
}

export function useBlogPost(id: number | null) {
  return useQuery<BlogPost>({
    queryKey: ["website", "blog", "posts", id],
    queryFn: async () => {
      const { data } = await api.get<BlogPost>(`/website/blog/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}

export function useBlogPostImages(blogId: number | null) {
  return useQuery<BlogPostImage[]>({
    queryKey: ["website", "blog", "posts", blogId, "images"],
    queryFn: async () => {
      const { data } = await api.get<BlogPostImage[]>(
        `/website/blog/${blogId}/images/`
      );
      return data;
    },
    enabled: !!blogId,
  });
}