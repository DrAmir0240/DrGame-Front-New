import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { toast } from "@/components/ui";
import { toastApiError } from "@/utils/errors";
import type { CompleteProfileFormData } from "../types";

export function useCompleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CompleteProfileFormData) => {
      const formData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;

        if (key === "profile_pic" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const { data } = await api.post("/users/complete-profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      queryClient.invalidateQueries({ queryKey: ["customer", "profile"] });
      toast.success("پروفایل شما با موفقیت تکمیل شد");
    },

    onError: (error) => {
      toastApiError(error, "خطا در تکمیل پروفایل");
    },
  });
}
