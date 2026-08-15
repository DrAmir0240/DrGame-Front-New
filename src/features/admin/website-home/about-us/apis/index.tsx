import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AboutUs } from "../types";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { toastApiError } from "@/utils/errors";

export function useAboutUsList() {
  return useQuery({
    queryKey: ["admin", "about-us"],
    queryFn: async (): Promise<AboutUs[]> => {
      const { data } = await api.get(
        "/website/employee/about-us/"
      );
      return  data.results;
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
      toast.success("درباره ما با موفقیت ایجاد شد");
    },
    onError: (err) => toastApiError(err, "خطا در ایجاد درباره ما"),
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
      toast.success("درباره ما با موفقیت بروزرسانی شد");
    },
    onError: (err) => toastApiError(err, "خطا در بروزرسانی درباره ما"),
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
    onError: (err) => toastApiError(err, "خطا در حذف"),
  });
}