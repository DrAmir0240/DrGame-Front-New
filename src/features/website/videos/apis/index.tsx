import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import type { Video } from "../types";
import { PaginatedResponse } from "@/features/admin/website-home/types";

function buildParams(filters?: Record<string, unknown>) {
  const params: Record<string, string> = {};
  if (!filters) return params;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      params[key] = String(value);
    }
  }
  return params;
}

export function useVideos(filters?: {
  limit?: number;
  offset?: number;
}) {
  return useQuery<PaginatedResponse<Video>>({
    queryKey: ["website", "videos", filters],
    queryFn: async () => {
      const params = buildParams(filters as Record<string, unknown>);
      const { data } = await api.get<PaginatedResponse<Video>>("/website/videos/", { params });
      return data;
    },
  });
}

export function useVideoDetail(id: number | null) {
  return useQuery<Video>({
    queryKey: ["website", "videos", id],
    queryFn: async () => {
      const { data } = await api.get<Video>(`/website/videos/${id}/`);
      return data;
    },
    enabled: !!id,
  });
}