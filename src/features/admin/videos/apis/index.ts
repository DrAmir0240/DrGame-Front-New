import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { PaginatedResponse } from "@/features/admin/website-home/types";
import type { Video } from "../types";

const LIMIT = 10;

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

export function useVideos(filters?: {
  limit?: number;
  offset?: number;
  is_active?: string | boolean;
}) {
  return useQuery<PaginatedResponse<Video>>({
    queryKey: ["admin", "videos", filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Video>>(
        "/website/employee/videos/",
        { params: buildParams(filters as Record<string, unknown>) }
      );
      return data;
    },
  });
}

export function useCreateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/website/employee/videos/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "videos"] });
      toast.success("ویدیو با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد ویدیو"),
  });
}

export function useUpdateVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/website/employee/videos/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "videos"] });
      toast.success("ویدیو با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی ویدیو"),
  });
}

export function useDeleteVideo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/website/employee/videos/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "videos"] });
      toast.success("حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}

export { LIMIT };