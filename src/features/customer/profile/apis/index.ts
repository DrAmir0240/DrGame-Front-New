import { useQuery } from "@tanstack/react-query";
import type { Profile } from "../types";
import api from "@/api/api";
import { toastApiError } from "@/utils/errors";

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ["customer", "profile"],
    queryFn: async () => {
      const { data } = await api.get<Profile>("/customer/profile/");
      return data;
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: Partial<Profile>) => {
      const { data } = await api.patch<Profile>("/customer/profile/", payload);

      return data;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["customer", "profile"], data);

      queryClient.invalidateQueries({
        queryKey: ["customer", "profile"],
      });
    },

    onError: (error) => {
      toastApiError(error, "خطا در ذخیره اطلاعات");
    },
  });
}

export function useUploadProfilePic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("profile_pic", file);

      const { data } = await api.patch<Profile>("/customer/profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["customer", "profile"], data);

      queryClient.invalidateQueries({
        queryKey: ["customer", "profile"],
      });

      queryClient.invalidateQueries({
        queryKey: ["auth-status"],
      });
    },

    onError: (error) => {
      toastApiError(error, "خطا در آپلود تصویر");
    },
  });
}
