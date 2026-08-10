import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import type { Banner, Section, SectionItem, AboutUs, PaginatedResponse } from "../types";

// ─── Banners ───

export function useBanners() {
  return useQuery({
    queryKey: ["admin", "banners"],
    queryFn: async (): Promise<Banner[]> => {
      const { data } = await api.get<PaginatedResponse<Banner>>(
        "/website/employee/banners/"
      );
      return data.results;
    },
  });
}

export function useCreateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/website/employee/banners/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("بنر با موفقیت ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد بنر"),
  });
}

export function useUpdateBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/website/employee/banners/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("بنر با موفقیت بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی بنر"),
  });
}

export function useDeleteBanner() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/banners/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "banners"] });
      toast.success("بنر حذف شد");
    },
    onError: () => toast.error("خطا در حذف بنر"),
  });
}

// ─── Sections ───

export function useSections() {
  return useQuery({
    queryKey: ["admin", "sections"],
    queryFn: async (): Promise<Section[]> => {
      const { data } = await api.get<PaginatedResponse<Section>>(
        "/website/employee/sections/"
      );
      return data.results;
    },
  });
}

export function useCreateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { title: string; model_content: string }) =>
      api.post("/website/employee/sections/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "sections"] });
      toast.success("سکشن ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد سکشن"),
  });
}

export function useUpdateSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<{ title: string; model_content: string }>;
    }) => api.patch(`/website/employee/sections/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "sections"] });
      toast.success("سکشن بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی سکشن"),
  });
}

export function useDeleteSection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/sections/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "sections"] });
      toast.success("سکشن حذف شد");
    },
    onError: () => toast.error("خطا در حذف سکشن"),
  });
}

// ─── Section Items ───

export function useSectionItems(sectionId: number | null) {
  return useQuery<SectionItem[]>({
    queryKey: ["admin", "section-items", sectionId],
    queryFn: async () => {
      const { data } = await api.get<SectionItem[]>(
        "/website/employee/section-items/",
        { params: { section_id: sectionId } }
      );
      return data;
    },
    enabled: !!sectionId,
  });
}

export function useCreateSectionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      section_id: number;
      item_id: number;
      is_active: boolean;
    }) => api.post("/website/employee/section-items/", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "section-items"] });
      toast.success("آیتم اضافه شد");
    },
    onError: () => toast.error("خطا در افزودن آیتم"),
  });
}

export function useUpdateSectionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<{ item_id: number; is_active: boolean }>;
    }) => api.patch(`/website/employee/section-items/${id}/`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "section-items"] });
      toast.success("آیتم بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی آیتم"),
  });
}

export function useDeleteSectionItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/section-items/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "section-items"] });
      toast.success("آیتم حذف شد");
    },
    onError: () => toast.error("خطا در حذف آیتم"),
  });
}

// ─── About Us ───

export function useAboutUsList() {
  return useQuery<AboutUs[]>({
    queryKey: ["admin", "about-us"],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AboutUs>>(
        "/website/employee/about-us/"
      );
      return data.results;
    },
  });
}

export function useCreateAboutUs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      api.post("/website/employee/about-us/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "about-us"] });
      toast.success("درباره ما ایجاد شد");
    },
    onError: () => toast.error("خطا در ایجاد"),
  });
}

export function useUpdateAboutUs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      api.patch(`/website/employee/about-us/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "about-us"] });
      toast.success("درباره ما بروزرسانی شد");
    },
    onError: () => toast.error("خطا در بروزرسانی"),
  });
}

export function useDeleteAboutUs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api.delete(`/website/employee/about-us/${id}/`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "about-us"] });
      toast.success("حذف شد");
    },
    onError: () => toast.error("خطا در حذف"),
  });
}